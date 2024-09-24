export enum SubscriptionType {
  Classic = 'ribpay_classic',
  Plus = 'ribpay_plus',
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum AccountType {
  personnePhysique,
  personneMorale,
}


export enum TransactionStatus {
  Closed = 'CLOSED',
}

export enum AdminTransactionStatus {
  Closed = 'CLOSED',
  Open = 'OPEN',
  Finished = 'FINISHED',
  Accepted = 'ACCEPTED',
  Executed = 'EXECUTED',
}