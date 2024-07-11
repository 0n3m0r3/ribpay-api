import Oxlin from '@ribpay/oxlin';
import { formatLabelForOxlin } from '../utils/oxlin-helpers';

const client_id = process.env.OXLIN_CLIENT_ID;
const client_secret = process.env.OXLIN_CLIENT_SECRET;

const oxlin = new Oxlin({
  clientId: process.env['OXLIN_CLIENT_ID'], // This is the default and can be omitted
  clientSecret: process.env['OXLIN_CLIENT_SECRET'], // This is the default and can be omitted
});

export async function postOrder({
  amount,
  currency = 'EUR',
  instantPayment,
  name,
  alias_id,
  redirect_url,
  ...rest
}) {
  const label = formatLabelForOxlin(rest.label);

  const order = await oxlin.paymentOrders.create({
    redirect_url:
      redirect_url ?? 'https://www.ribpay.page/authorize/confirmation',
    ...(instantPayment && { instant_payment: 'EXPECTED' }),
    instructions: [
      {
        amount,
        currency,
        beneficiary: {
          schema: 'ALIAS',
          alias_id,
        },
        label,
      },
    ],
  });

  return order;
}

export async function postAuthorizedAccounts({
  iban,
  nationalId: national_identification,
  company_name,
  headers,
}) {
  const options = {
    headers,
  };
  try {
    const authorizedAccount = await oxlin.authorizedAccounts.create(
      {
        identification: {
          schema: 'SEPA',
          iban,
          name: company_name,
        },
        entity: {
          type: 'COMPANY',
          company_name,
          national_identification,
        },
      },
      options,
    );

    return authorizedAccount;
  } catch (error) {
    return error;
  }
}

export async function postAuthorizedAccountsPersonnePhysique({
  firstname,
  surname,
  birth_date,
  birth_city,
  birth_country,
  iban,
  company_name,
  headers,
}) {
  const options = {
    headers,
  };

  try {
    const authorizedAccount = await oxlin.authorizedAccounts.create(
      {
        identification: {
          schema: 'SEPA',
          iban,
          name: company_name,
        },
        entity: {
          type: 'NATURAL_PERSON',
          firstname,
          surname,
          birth_date,
          birth_city,
          birth_country,
        },
      },
      options,
    );

    return authorizedAccount;
  } catch (error) {
    return error;
  }
}

export async function postAlias({ user_reference, label, iban, bic }) {
  const alias = await oxlin.accountAlias.create({
    user_reference,
    label,
    account: {
      schema: 'SEPA',
      iban,
    },
    bic,
  });

  return alias;
}

export async function searchProviders({ iban }) {
  const body = {
    payer: [
      {
        schema: 'SEPA',
        iban,
      },
    ],
  };

  // @ts-ignore
  const { result: providers } = await oxlin.providers.search({ body: body });

  return providers[0].providers;
}

export async function deleteAlias({ alias_id }) {
  try {
    await oxlin.accountAliases.delete(alias_id);
  } catch (error) {
    return error;
  }
}

export async function deleteAuthorizedAccount({ authorized_account_id }) {
  try {
    await oxlin.authorizedAccounts.delete(authorized_account_id);
  } catch (error) {
    return error;
  }
}
