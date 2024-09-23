import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdDTO } from '../../dto/id.dto';
import { PartnersService } from './partners.service';

import { ResponsePartnersDto } from './dto/response-partners.dto';

@ApiTags('Admin')
@Controller('admin/partners')
export class PartnersController {
  constructor(private readonly partnerService: PartnersService) {}

  @ApiOperation({ summary: 'Retrieve a partner profile' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the partner',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Partner profile details',
    type: ResponsePartnersDto,
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO) {
    return this.partnerService.findOne(params.id);
  }
}
