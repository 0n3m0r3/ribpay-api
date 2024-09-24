import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { cancelOrder, postOrder } from 'src/lib/oxlin';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginationResponseDto } from '../../dto/pagination-response.dto';
import {
  ResponseListTransactionDto,
  TransactionResponseDto,
} from './dto/response-transaction.dto';
import { TransactionListQueryDto } from './dto/query-list-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}


  async findOne(id: string) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { transaction_id: id },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async findByOxlinId(oxlin_id: string) {
    const transaction = await this.prisma.transactions.findFirst({
      where: { transaction_id_oxlin: oxlin_id },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }


  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { transaction_id: id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.transaction_status === 'CANCELLED') {
      throw new UnprocessableEntityException(
        'Transaction has already been cancelled and cannot be updated',
      );
    }

    if (
      transaction.transaction_status === 'FINISHED' ||
      transaction.transaction_status === 'ACCEPTED' ||
      transaction.transaction_status === 'EXECUTED'
    ) {
      throw new UnprocessableEntityException(
        'Transaction has already been completed and cannot be updated',
      );
    }

    await cancelOrder({ order_id: transaction.transaction_id_oxlin });

    const updatedTransaction = await this.prisma.transactions.update({
      where: { transaction_id: id },
      data: {
        transaction_status: updateTransactionDto.status,
        transaction_last_modified: new Date(updateTransactionDto.transaction_last_modified),
        transaction_id_oxlin: updateTransactionDto.transaction_id_oxlin,
      },
    });

    return updatedTransaction;
  }
}
