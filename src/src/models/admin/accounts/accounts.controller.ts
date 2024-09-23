import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdDTO } from '../../dto/id.dto';
import { AccountsService } from './accounts.service';
import { AccountDetailsDto } from './dto/response-account.dto';

@ApiTags('Admin')
@Controller('admin/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Admin route to retrieve an account by ID' })
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
  findOne(@Param() params: IdDTO): Promise<AccountDetailsDto>  {
    return this.accountsService.findOne(params.id);
  }
}
