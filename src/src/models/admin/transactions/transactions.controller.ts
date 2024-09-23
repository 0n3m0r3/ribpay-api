import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionResponseDto } from './dto/response-transaction.dto';
import { AccountIdDTO, IdDTO, TerminalIdDTO, TransactionOxlinIdDTO } from '../../dto/id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginationResponseDto } from '../../dto/pagination-response.dto';
import { TransactionListQueryDto } from './dto/query-list-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';


@ApiTags('Admin')
@Controller('admin/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}


  @ApiOperation({ summary: 'Retrieve a transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the transaction',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.transactionsService.findOne(params.id);
  }


  @ApiOperation({ summary: 'Retrieve transactions by oxlin_id' })
  @ApiParam({
    name: 'oxlin_id',
    description: 'Unique identifier of the oxlin',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions list',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get('transaction_id_oxlin/:oxlin_id')
  findByOxlinId(@Param() params: TransactionOxlinIdDTO) {
    return this.transactionsService.findByOxlinId(params.oxlin_id);
  }

  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the transaction',
    type: 'uuid',
  })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Put(':id')
  update(
    @Param() params: IdDTO,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: any,
  ) {
    return this.transactionsService.update(
      params.id,
      updateTransactionDto,
    );
  }
}
