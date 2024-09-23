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
import { ContractResponseDto } from './dto/response-contract.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AccountIdDTO, IdDTO, TerminalIdDTO } from '../../dto/id.dto';
import { ContractListQueryDto } from './dto/query-list-contract.dto';

@ApiTags('Admin')
@Controller('admin/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

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
    return this.contractsService.findOne(params.id);
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
      query,
      baseUrl,
    );
  }

}
