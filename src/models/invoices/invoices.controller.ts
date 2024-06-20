import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoiceResponseDto } from './dto/response-invoice.dto';

import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountIdDTO, IdDTO } from '../dto/id.dto';

@ApiHeader({
  name: 'sub-account',
  required: true,
  description: 'Sub-account identifier required for all requests',
})
@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Find an invoice by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the invoice',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice details',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.invoicesService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Find all invoices by account ID' })
  @ApiParam({
    name: 'account_id',
    description: 'Unique identifier of the account',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of invoices',
    type: InvoiceResponseDto,
  })
  @Get('account/:account_id')
  findByAccount(
    @Param() params: AccountIdDTO,
    @Req() req: any,
    @Query() query: any,
  ) {
    return this.invoicesService.findByAccount(
      params.account_id,
      req.subAccount,
      query,
    );
  }
}
