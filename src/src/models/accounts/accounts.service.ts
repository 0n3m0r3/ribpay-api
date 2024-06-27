import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  siretToSiren,
  formatBeneficiaryNameForOxlin,
} from '../../utils/inpi/helpers/formatters';
import { fetchImmatriculationFromAPIRNE } from '../../utils/inpi';
import { PrismaService } from '../../prisma/prisma.service';
import { Client } from 'lago-javascript-client';
import { randomUUID } from 'crypto';
import { AccountCreateResponseDto } from './dto/response-create-account.dto';
import {
  AccountDetailsDto,
  AccountListResponseDto,
} from './dto/response-account.dto';
import { AccountListQueryDto } from './dto/query-list-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAccountDto: CreateAccountDto,
    subAccount: string,
  ): Promise<AccountCreateResponseDto> {
    const client = Client(process.env.LAGO_API_KEY);
    // Return an error if the company already exists
    const existingAccount = await this.prisma.accounts.findFirst({
      where: {
        account_national_id: createAccountDto.siret,
        account_deletion_date: null,
        creator_id: subAccount,
      },
    });

    if (existingAccount) {
      throw new ConflictException('Account already exists');
    }

    // Fetch the company data from the INPI API
    const siren = siretToSiren(createAccountDto.siret);
    const { isActive, typePersonne, identite, adresse } =
      await fetchImmatriculationFromAPIRNE(siren);

    const beneficiaryName = formatBeneficiaryNameForOxlin(
      identite.denomination,
    );

    // Return an error if the company is not active
    if (!isActive) {
      throw new BadRequestException('Account is not active');
    }

    // Create the account, billingAddress, terminal, and user

    const account = await this.prisma.accounts.create({
      data: {
        account_national_id: createAccountDto.siret,
        account_is_active: false,
        account_currency: 'EUR',
        account_notification_email: createAccountDto.notification_email,
        account_name: beneficiaryName,
        account_type: typePersonne,
        creator_id: subAccount,
      },
    });

    // Create the creation_url and update the account
    const creationUrl = `http://localhost:3001/account/${subAccount}/${account.account_id}`;
    await this.prisma.accounts.update({
      where: { account_id: account.account_id },
      data: { account_creation_url: creationUrl },
    });

    const billing_address = await this.prisma.billing_addresses.create({
      data: {
        billing_address: adresse?.adresse || null,
        billing_address_complement_localisation: adresse?.complement || null,
        billing_address_numero_voie: adresse?.numero_voie || null,
        billing_address_indice_repetition: adresse?.indice_repetition || null,
        billing_address_type_voie: adresse?.type_voie || null,
        billing_address_libelle_voie: adresse?.libelle_voie || null,
        billing_address_distribution_speciale:
          adresse?.distribution_speciale || null,
        billing_address_code_postal: adresse?.code_postal || null,
        billing_address_libelle_commune: adresse?.libelle_commune || null,
        billing_address_pays: adresse?.pays || null,
        billing_address_code_pays: adresse?.code_pays || null,
        account_id: account.account_id,
        creator_id: subAccount,
      },
    });

    const locale = adresse?.code_pays.slice(0, -1).toLowerCase();

    const customerObject = {
      external_id: account.account_id,
      name: identite.denomination,
      country: locale,
      address_line1:
        adresse?.complement +
        ' ' +
        adresse?.numero_voie +
        ' ' +
        adresse?.type_voie +
        ' ' +
        adresse?.libelle_voie,
      zipcode: adresse?.code_postal,
      city: adresse?.libelle_commune,
      legal_name: beneficiaryName,
      legal_number: createAccountDto.siret,
      currency: 'EUR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      billing: {
        document_locale: locale,
      },
    };

    const {
      data: {
        customer: { lago_id, created_at },
      },
    } = await client.customers.createCustomer({
      customer: customerObject as any,
    });

    const subscriptionId = randomUUID();
    // https://stackoverflow.com/a/34053802
    const creationDate = new Date().toISOString().split('.')[0] + 'Z';

    const subscriptionObject = {
      external_customer_id: account.account_id,
      plan_code: createAccountDto.subscription_type ?? 'ribpay_classic',
      external_id: subscriptionId,
      subscription_at: creationDate,
      billing_time: 'calendar',
    };

    const {
      data: { subscription },
    } = await client.subscriptions.createSubscription({
      subscription: {
        ...subscriptionObject,
        billing_time: 'calendar',
      },
    });

    // TO DO : Use the subscription id

    const terminal = await this.prisma.terminals.create({
      data: {
        terminal_label: 'New Terminal',
        terminal_favorite_contract_type: 'RIBPAY',
        terminal_subscription_id: subscriptionId,
        terminal_subscription_type:
          createAccountDto.subscription_type ?? 'payments',
        account_id: account.account_id,
        creator_id: subAccount,
      },
    });

    const user = await this.prisma.users.create({
      data: {
        creator_id: subAccount,
      },
    });

    // Connecting the account to the user
    await this.prisma.user_has_accounts.create({
      data: {
        user_id: user.user_id,
        account_id: account.account_id,
        user_role: 'admin',
      },
    });

    const accountWithRelations = {
      account: {
        ...account,
        account_creation_url: creationUrl,
      },
      billing_address,
      terminal,
      user: {
        user_id: user.user_id,
        user_role: 'admin',
        creator_id: subAccount,
      },
    } as unknown as AccountCreateResponseDto;

    return accountWithRelations;
  }

  async findAll(
    subAccount: string,
    query: AccountListQueryDto,
    baseUrl: string,
  ): Promise<AccountListResponseDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      creator_id: subAccount,
      ...(query.search && {
        OR: [
          {
            account_national_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            account_notification_email: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            account_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            account_currency: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            account_creation_url: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            account_blob_storage_url: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.created_before && {
        account_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        account_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        account_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        account_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.deleted_before && {
        account_deletion_date: { lt: new Date(query.deleted_before) },
      }),
      ...(query.deleted_after && {
        account_deletion_date: { gt: new Date(query.deleted_after) },
      }),
      ...(query.is_active !== undefined && {
        account_is_active: query.is_active,
      }),
      ...(query.type && { account_type: query.type }),
      ...(query.is_deleted === true && {
        account_deletion_date: { not: null },
      }),
      ...(query.is_deleted === false && { account_deletion_date: null }),
      ...(query.partner_id && { partner_id: query.partner_id }),
      ...(query.account_id && { account_id: query.account_id }),
    };

    const [accounts, total_count] = await this.prisma.$transaction([
      this.prisma.accounts.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.accounts.count({ where: whereClause }),
    ]);

    if (!accounts) {
      throw new NotFoundException('Accounts not found');
    }

    const total_pages = Math.ceil(total_count / per_page);

    const pagination = {
      current_page: page,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      per_page,
      total_pages,
      total_count,
      next_link:
        page < total_pages
          ? `${baseUrl}/accounts?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/accounts?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    return {
      Accounts: accounts as unknown as AccountDetailsDto[],
      Pagination: pagination,
    };
  }

  async findOne(id: string, subAccount: string): Promise<AccountDetailsDto> {
    const account = await this.prisma.accounts.findUnique({
      where: { account_id: id, creator_id: subAccount },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account as unknown as AccountDetailsDto;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    subAccount: string,
  ): Promise<AccountDetailsDto> {
    const account = await this.prisma.accounts.findUnique({
      where: { account_id: id, creator_id: subAccount },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.account_is_active === false) {
      throw new UnprocessableEntityException('Account is not active');
    }

    if (account.account_deletion_date) {
      throw new BadGatewayException('Account has been deleted');
    }
    return (await this.prisma.accounts.update({
      where: { account_id: id, creator_id: subAccount },
      data: {
        account_notification_email: updateAccountDto.notification_email,
      },
    })) as unknown as AccountDetailsDto;
  }

  async remove(id: string, subAccount: string) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: id,
        creator_id: subAccount,
        account_deletion_date: null,
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found or already deleted');
    }
    await this.prisma.accounts.update({
      where: { account_id: id, creator_id: subAccount },
      data: { account_is_active: false, account_deletion_date: new Date() },
    });
  }
}
