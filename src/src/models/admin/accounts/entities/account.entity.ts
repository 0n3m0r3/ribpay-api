export class Account {
    account_id: string;
    account_national_id: string;
    account_name: string;
    account_type: 'personneMorale' | 'personnePhysique';
    account_is_active: boolean;
    account_currency: string;
    account_notification_email: string;
    account_creation_url: string;
    creator_id: string;
    partner_id?: string;
}
