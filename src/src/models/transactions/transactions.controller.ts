import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
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
import { AccountIdDTO, IdDTO, TerminalIdDTO } from '../dto/id.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { TransactionListQueryDto } from './dto/query-list-transaction.dto';

@ApiTags('Transactions')
@ApiHeader({
  name: 'sub-account',
  required: true,
  description: 'Sub-account identifier required for all requests',
})
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: any) {
    console.log("Create transaction : ", createTransactionDto);
    return this.transactionsService.create(
      createTransactionDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Retrieve all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
  })
  @Get()
  findAll(@Req() req: any, @Query() query: TransactionListQueryDto,) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.transactionsService.findAll(req.subAccount, query, baseUrl);
  }

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
    return this.transactionsService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve all transactions by account ID' })
  @ApiParam({
    name: 'account_id',
    description: 'Unique identifier of the account',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get('account/:account_id')
  findByAccount(@Param() params: AccountIdDTO, @Req() req: any, @Query() query: TransactionListQueryDto,) {
    const baseurl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.transactionsService.findByAccount(
      params.account_id,
      req.subAccount,
      query,
      baseurl
    );
  }

  @ApiOperation({ summary: 'Retrieve all transactions by terminal ID' })
  @ApiParam({
    name: 'terminal_id',
    description: 'Unique identifier of the terminal',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Terminal not found' })
  @Get('terminal/:terminal_id')
  findByTerminal(@Param() params: TerminalIdDTO, @Req() req: any, @Query() query: TransactionListQueryDto,) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.transactionsService.findByTerminal(
      params.terminal_id,
      req.subAccount,
      query,
      baseUrl
    );
  }
}
