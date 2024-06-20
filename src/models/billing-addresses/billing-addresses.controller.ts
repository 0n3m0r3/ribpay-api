import { Controller, Get, Param, Req } from '@nestjs/common';
import { BillingAddressesService } from './billing-addresses.service';
import { BillingAddressDto } from './dto/response-billing-addresse.dto';
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
@ApiTags('Billing Addresses')
@Controller('billing-addresses')
export class BillingAddressesController {
  constructor(
    private readonly billingAddressesService: BillingAddressesService,
  ) {}

  @ApiOperation({
    summary: 'Find a billing address by ID',
    description:
      'Retrieve detailed information of a billing address using its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the billing address',
    required: true,
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Billing address details retrieved successfully',
    type: BillingAddressDto,
  })
  @ApiResponse({ status: 404, description: 'Billing address not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.billingAddressesService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({
    summary: 'Find all billing addresses by account ID',
    description:
      'Retrieve a list of billing addresses associated with a specific account.',
  })
  @ApiParam({
    name: 'account_id',
    description: 'Unique identifier of the account',
    required: true,
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of billing addresses retrieved successfully',
    type: [BillingAddressDto],
  })
  @Get('account/:account_id')
  findByAccount(@Param() params: AccountIdDTO, @Req() req: any) {
    return this.billingAddressesService.findByAccount(
      params.account_id,
      req.subAccount,
    );
  }
}
