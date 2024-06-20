import { IsUUID } from 'class-validator';

export class IdDTO {
  @IsUUID()
  id: string;
}

export class AccountIdDTO {
  @IsUUID()
  account_id: string;
}

export class TerminalIdDTO {
  @IsUUID()
  terminal_id: string;
}
