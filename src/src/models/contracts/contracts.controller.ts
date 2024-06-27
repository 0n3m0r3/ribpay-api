import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractResponseDto } from './dto/response-contract.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AccountIdDTO, IdDTO, TerminalIdDTO } from '../dto/id.dto';
import { ContractListQueryDto } from './dto/query-list-contract.dto';

@ApiTags('Contracts')
@ApiHeader({
  name: 'sub-account',
  required: true,
  description: 'Sub-account identifier required for all requests',
})
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiOperation({ summary: 'Create a new contract' })
  @ApiBody({ type: CreateContractDto })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createContractDto: CreateContractDto, @Req() req: any) {
    return this.contractsService.create(createContractDto, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve all contracts' })
  @ApiResponse({
    status: 200,
    description: 'List of all contracts',
    type: [ContractResponseDto],
  })
  @Get()
  findAll(@Req() req: any, @Query() query: ContractListQueryDto) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.contractsService.findAll(req.subAccount, query, baseUrl);
  }

  @ApiOperation({ summary: 'Retrieve a contract by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the contract',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract details',
    type: ContractResponseDto,
  })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.contractsService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve contracts by terminal ID' })
  @ApiParam({
    name: 'terminal_id',
    description: 'Unique terminal identifier to find contracts',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Contracts for the specified terminal',
    type: [ContractResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Terminal not found' })
  @Get('terminal/:terminal_id')
  findByTerminal(
    @Param() params: TerminalIdDTO,
    @Req() req: any,
    @Query() query: ContractListQueryDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.contractsService.findByTerminal(
      params.terminal_id,
      req.subAccount,
      query,
      baseUrl,
    );
  }

  @ApiOperation({ summary: 'Retrieve contracts by account ID' })
  @ApiParam({
    name: 'account_id',
    description: 'Unique account identifier to find contracts',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Contracts for the specified account',
    type: [ContractResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get('account/:account_id')
  findByAccount(
    @Param() params: AccountIdDTO,
    @Req() req: any,
    @Query() query: ContractListQueryDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.contractsService.findByAccount(
      params.account_id,
      req.subAccount,
      query,
      baseUrl,
    );
  }

  @ApiOperation({ summary: 'Update a contract' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the contract to update',
    type: 'uuid',
  })
  @ApiBody({ type: UpdateContractDto })
  @ApiResponse({
    status: 200,
    description: 'Updated contract details',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @Put(':id')
  update(
    @Param() params: IdDTO,
    @Body() updateContractDto: UpdateContractDto,
    @Req() req: any,
  ) {
    return this.contractsService.update(
      params.id,
      updateContractDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Delete a contract' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the contract to delete',
    type: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Confirmation of contract deletion',
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IdDTO, @Req() req: any) {
    this.contractsService.remove(params.id, req.subAccount);
  }
}
