import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdDTO } from '../dto/id.dto';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountDetailsDto, AccountListResponseDto } from './dto/response-account.dto';
import { AccountCreateResponseDto } from './dto/response-create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountListQueryDto } from './dto/query-list-account.dto';

@ApiHeader({
  name: 'sub-account',
  required: true,
  description: 'Sub-account identifier required for all requests',
})
@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account successfully created.',
    type: AccountCreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Account already exists.' })
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: any,
  ): Promise<AccountCreateResponseDto> {
    return this.accountsService.create(createAccountDto, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve all accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all accounts',
    type: AccountListResponseDto,
  })
  @Get()
  findAll(
    @Req() req: any,
    @Query() query: AccountListQueryDto,
  ): Promise<AccountListResponseDto> {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.accountsService.findAll(req.subAccount, query, baseUrl);
  }

  @ApiOperation({ summary: 'Retrieve an account by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the account',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the account',
    type: AccountDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any): Promise<AccountDetailsDto> {
    return this.accountsService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Update an existing account' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the account to update',
    type: 'uuid',
  })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Updated account details',
    type: AccountDetailsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Account is inactive' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Put(':id')
  update(
    @Param() params: IdDTO,
    @Body() updateAccountDto: UpdateAccountDto,
    @Req() req: any,
  ): Promise<AccountDetailsDto> {
    return this.accountsService.update(
      params.id,
      updateAccountDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the account to delete',
    type: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Confirmation of account deletion',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IdDTO, @Req() req: any) {
    this.accountsService.remove(params.id, req.subAccount);
  }
}
