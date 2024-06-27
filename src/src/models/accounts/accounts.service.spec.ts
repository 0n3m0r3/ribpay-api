import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
  BadGatewayException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountCreateResponseDto } from './dto/response-create-account.dto';
import { AccountListResponseDto } from './dto/response-account.dto';
import { AccountListQueryDto } from './dto/query-list-account.dto';
import { AccountDetailsDto } from './dto/response-account.dto';
// import { UserRole } from 'src/lib/enums/index';
import { fetchImmatriculationFromAPIRNE } from '../../utils/inpi';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}
// Mock the external function
jest.mock('../../utils/inpi', () => ({
  fetchImmatriculationFromAPIRNE: jest.fn(),
}));

jest.mock('lago-javascript-client', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        customers: {
          createCustomer: jest.fn().mockResolvedValue({
            data: {
              customer: {
                lago_id: 'lago-id',
                created_at: '2023-01-01T00:00:00Z',
              },
            },
          }),
        },
        subscriptions: {
          createSubscription: jest.fn().mockResolvedValue({
            data: {
              subscription: {
                external_id: 'subscription-id',
                plan_code: 'ribpay_classic',
                billing_time: 'calendar',
                created_at: '2023-01-01T00:00:00Z',
              },
            },
          }),
        },
      };
    }),
  };
});

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: PrismaService,
          useValue: {
            accounts: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
            billing_addresses: {
              create: jest.fn(),
            },
            terminals: {
              create: jest.fn(),
            },
            users: {
              create: jest.fn(),
            },
            user_has_accounts: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const createAccountDto: CreateAccountDto = {
        siret: '12345678901234',
        notification_email: 'info@example.com',
        subscription_type: 'ribpay_plus',
      };
      const mockAccount = {
        account_id: 'uuid',
        account_national_id: '90327770500013',
        account_name: 'Test Account',
        account_type: 'personnePhysique',
        account_is_active: true,
        account_currency: 'EUR',
        account_notification_email: 'info@example.com',
        creator_id: 'test-creator-id',
        account_creation_url: 'http://localhost:3001/account/test-creator-id/uuid',
        account_created_at: '2023-01-01T00:00:00Z',
        partner_id: 'partner_id',
      };
      const mockResponse: AccountCreateResponseDto = {
        account: mockAccount as any,
        billing_address: {} as any,
        terminal: {} as any,
        user: {
          user_id: 'uuid',
          user_role: UserRole.Admin,
          creator_id: 'test-creator-id',
        },
      };

      (prisma.accounts.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.accounts.create as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.billing_addresses.create as jest.Mock).mockResolvedValue({});
      (prisma.terminals.create as jest.Mock).mockResolvedValue({});
      (prisma.users.create as jest.Mock).mockResolvedValue({ user_id: 'uuid' });
      (prisma.user_has_accounts.create as jest.Mock).mockResolvedValue({});

      (fetchImmatriculationFromAPIRNE as jest.Mock).mockResolvedValue({
        isActive: true,
        typePersonne: 'personneMorale',
        identite: { denomination: 'Test Account' },
        adresse: {code_pays: 'FR'},
      });

      const result = await service.create(createAccountDto, 'test-creator-id');
      expect(result).toEqual(mockResponse);
    });

    it('should throw conflict exception if account already exists', async () => {
      const createAccountDto: CreateAccountDto = {
        siret: '12345678901234',
        notification_email: 'info@example.com',
      };
      (prisma.accounts.findFirst as jest.Mock).mockResolvedValue({});

      try {
        await service.create(createAccountDto, 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('Account already exists');
      }
    });
  });

  describe('findAll', () => {
    it('should return a list of accounts', async () => {
      const query: AccountListQueryDto = {};
      const mockAccounts: AccountDetailsDto[] = [
        {
          account_id: 'uuid',
          account_national_id: '12345678901234',
          account_name: 'Test Account',
          account_type: 'personneMorale',
          account_is_active: true,
          account_currency: 'EUR',
          account_notification_email: 'info@example.com',
          creator_id: 'test-creator-id',
          account_creation_url: 'http://localhost:3001/account/test-creator-id/uuid',
          account_created_at: '2023-01-01T00:00:00Z',
          partner_id: 'partner_id',
          account_last_modified: null,
          account_deletion_date: null,
          account_blob_storage_url: null,
        },
      ];
      const mockResponse: AccountListResponseDto = {
        Accounts: mockAccounts,
        Pagination: {
          current_page: 1,
          next_page: null,
          prev_page: null,
          per_page: 10,
          total_pages: 1,
          total_count: 1,
          next_link: null,
          prev_link: null,
        },
      };

      (prisma.$transaction as jest.Mock).mockResolvedValue([mockAccounts, 1]);

      const result = await service.findAll(
        'test-creator-id',
        query,
        'http://localhost/api',
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return an account by ID', async () => {
      const mockAccount: AccountDetailsDto = {
        account_id: 'uuid',
        account_national_id: '12345678901234',
        account_name: 'Test Account',
        account_type: 'personneMorale',
        account_is_active: true,
        account_currency: 'EUR',
        account_notification_email: 'info@example.com',
        account_creation_url: 'http://localhost:3001/account/test-creator-id/uuid',
        partner_id: 'partner_id',
        creator_id: 'test-creator-id',
        account_last_modified: null,
        account_deletion_date: null,
        account_created_at: '2023-01-01T00:00:00Z',
        account_blob_storage_url: null,
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const result = await service.findOne('uuid', 'test-creator-id');
      expect(result).toEqual(mockAccount);
    });

    it('should throw not found exception if account not found', async () => {
      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.findOne('uuid', 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Account not found');
      }
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const updateAccountDto: UpdateAccountDto = {
        notification_email: 'user@example.com',
      };
      const mockAccount = {
        account_id: 'uuid',
        account_national_id: '12345678901234',
        account_name: 'Test Account',
        account_type: 'personneMorale',
        account_is_active: true,
        account_currency: 'EUR',
        account_notification_email: 'user@example.com',
        creator_id: 'test-creator-id',
        account_creation_url: 'http://localhost:3001/account/test-creator-id/uuid',
        account_created_at: '2023-01-01T00:00:00Z',
        partner_id: 'partner_id',
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.accounts.update as jest.Mock).mockResolvedValue(mockAccount);

      const result = await service.update('uuid', updateAccountDto, 'test-creator-id');
      expect(result).toEqual(mockAccount);
    });

    it('should throw not found exception if account not found', async () => {
      const updateAccountDto: UpdateAccountDto = {
        notification_email: 'user@example.com',
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.update('uuid', updateAccountDto, 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Account not found');
      }
    });

    it('should throw unprocessable entity exception if account is not active', async () => {
      const updateAccountDto: UpdateAccountDto = {
        notification_email: 'user@example.com',
      };
      const mockAccount = {
        account_id: 'uuid',
        account_is_active: false,
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      try {
        await service.update('uuid', updateAccountDto, 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
        expect(e.message).toBe('Account is not active');
      }
    });

    it('should throw bad gateway exception if account has been deleted', async () => {
      const updateAccountDto: UpdateAccountDto = {
        notification_email: 'user@example.com',
      };
      const mockAccount = {
        account_id: 'uuid',
        account_deletion_date: new Date(),
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      try {
        await service.update('uuid', updateAccountDto, 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(BadGatewayException);
        expect(e.message).toBe('Account has been deleted');
      }
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      const mockAccount = {
        account_id: 'uuid',
        account_national_id: '12345678901234',
        account_name: 'Test Account',
        account_type: 'personneMorale',
        account_is_active: true,
        account_currency: 'EUR',
        account_notification_email: 'info@example.com',
        creator_id: 'test-creator-id',
        account_deletion_date: null,
      };

      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(mockAccount);
      (prisma.accounts.update as jest.Mock).mockResolvedValue({
        ...mockAccount,
        account_is_active: false,
        account_deletion_date: new Date(),
      });

      await service.remove('uuid', 'test-creator-id');
      expect(prisma.accounts.update).toHaveBeenCalled();
    });

    it('should throw bad request exception if account not found or already deleted', async () => {
      (prisma.accounts.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.remove('uuid', 'test-creator-id');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Account not found or already deleted');
      }
    });
  });
});
