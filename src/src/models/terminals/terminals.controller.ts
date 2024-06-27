import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  Req,
  NotFoundException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { TerminalDto } from './dto/response-terminal.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { AccountIdDTO, IdDTO, TerminalIdDTO } from '../dto/id.dto';
import { TerminalListQueryDto } from './dto/query-list-terminal.dto';

@ApiHeader({
  name: 'sub-account',
  required: true,
  description: 'Sub-account identifier required for all requests',
})
@ApiTags('Terminals')
@Controller('terminals')
export class TerminalsController {
  constructor(private readonly terminalsService: TerminalsService) {}

  @ApiOperation({ summary: 'Create a new terminal' })
  @ApiBody({ type: CreateTerminalDto })
  @ApiResponse({
    status: 201,
    description: 'Terminal created successfully',
    type: TerminalDto,
  })
  @Post()
  create(@Body() createTerminalDto: CreateTerminalDto, @Req() req: any) {
    try {
      return this.terminalsService.create(createTerminalDto, req.subAccount);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Retrieve all terminals' })
  @ApiResponse({
    status: 200,
    description: 'List of all terminals',
    type: [TerminalDto],
  })
  @Get()
  findAll(@Req() req: any, @Query() query: TerminalListQueryDto) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.terminalsService.findAll(req.subAccount, query, baseUrl);
  }

  @ApiOperation({ summary: 'Retrieve a terminal by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the terminal',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Terminal details',
    type: TerminalDto,
  })
  @ApiResponse({ status: 404, description: 'Terminal not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.terminalsService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve all terminals by account ID' })
  @ApiParam({
    name: 'account_id',
    description: 'Unique identifier of the account',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of terminals',
    type: [TerminalDto],
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Get('account/:account_id')
  findByAccount(
    @Param() params: AccountIdDTO,
    @Req() req: any,
    @Query() query: TerminalListQueryDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.terminalsService.findByAccount(
      params.account_id,
      req.subAccount,
      query,
      baseUrl,
    );
  }

  @ApiOperation({ summary: 'Update an existing terminal' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the terminal',
    type: 'uuid',
  })
  @ApiBody({ type: UpdateTerminalDto })
  @ApiResponse({
    status: 200,
    description: 'Updated terminal details',
    type: TerminalDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Terminal not found' })
  @Put(':id')
  update(
    @Param() params: IdDTO,
    @Body() updateTerminalDto: UpdateTerminalDto,
    @Req() req: any,
  ) {
    return this.terminalsService.update(
      params.id,
      updateTerminalDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Delete a terminal' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the terminal',
    type: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Confirmation of terminal deletion',
  })
  @HttpCode(204)
  @ApiResponse({ status: 404, description: 'Terminal not found' })
  @Delete(':id')
  remove(@Param() params: IdDTO, @Req() req: any) {
    this.terminalsService.remove(params.id, req.subAccount);
  }
}
