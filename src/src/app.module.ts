import { Module } from '@nestjs/common';
import { AccountsModule } from './models/accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './models/contracts/contracts.module';
import { EnhanceRequestInterceptor } from './interceptors/enhance-request.interceptor';
import { TerminalsModule } from './models/terminals/terminals.module';
import { UsersModule } from './models/users/users.module';
import { BillingAddressesModule } from './models/billing-addresses/billing-addresses.module';
import { TransactionsModule } from './models/transactions/transactions.module';
import { ValidateModule } from './models/validate/validate.module';
import { InvoicesModule } from './models/invoices/invoices.module';
import { ConfigModule } from '@nestjs/config';
import { StatusModule } from './models/status/status.module';
import { HealthController } from './health.controller';
import { AdminAccountsModule } from './models/admin/accounts/accounts.module';
import {AdminContractsModule} from './models/admin/contracts/contracts.module';
import { AdminTransactionsModule } from './models/admin/transactions/transactions.module';
import { AdminUsersModule } from './models/admin/users/users.module';
import { AdminValidateModule } from './models/admin/validate/validate.module';
import { AdminPartnersModule } from './models/admin/partners/partners.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ContractsModule,
    TerminalsModule,
    AccountsModule,
    UsersModule,
    BillingAddressesModule,
    TransactionsModule,
    ValidateModule,
    InvoicesModule,
    StatusModule,
    AdminAccountsModule,
    AdminContractsModule,
    AdminTransactionsModule,
    AdminUsersModule,
    AdminValidateModule,
    AdminPartnersModule,
    TasksModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: EnhanceRequestInterceptor,
    },
  ],
})
export class AppModule {}
