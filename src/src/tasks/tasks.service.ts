import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendMail } from 'src/utils/mailing/mail';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private prisma: PrismaService;

  @Cron('0 0 */12 * * *')
  async handleCron() {
    this.logger.debug('Called twice per day');

    // Step 1: Get all VADS contracts that are not yet activated

    const contracts = await this.prisma.contracts.findMany({
      where: {
        contract_type: 'VADS',
        contract_is_active: false,
      },
    });

    // Step 2: Call Monext API to check if the contract is activated

    let contractsToActivate = [];

    for (const contract of contracts) {
      // Call Monext API to check if the contract is activated
      // If the contract is activated, update the contract status in the database

      // contractsToActivate.push(contract_id_from monext);  // Might be the merchant_id

      return contractsToActivate;
    }

    // Step 3: If the contract is activated, update the contract status in the database
    for (const contract of contractsToActivate) {
      await this.prisma.contracts.update({
        where: { contract_id: contract },
        data: { contract_is_active: true },
      });
    }

    // Step 4: Inform the user that the contract is activated by notifying him on his notification_url or by sending him an email

    for (const contract of contractsToActivate) {
      // Get the account notification url
      const { notification_url } = await this.prisma.partners.findUnique({
        where: { creator_id: contract.creator_id },
      });

      // Fallback to email if notification_url is not available
      if (!notification_url) {
        const { account_notification_email } =
          await this.prisma.accounts.findUnique({
            where: { account_id: contract.account_id },
          });
        // sendMail({account_notification_email});  // Define the sendMail function to be polymorphic
      } else {
        // Make an axios request to the notification_url

        axios.post(notification_url, {
          message: {
            merchant_id: contract.merchant_id,
            contract_id: contract.contract_id,
            contract_is_active: true,
          },
        });
      }
    }
  }
}
