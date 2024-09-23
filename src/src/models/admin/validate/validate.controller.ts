import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { IdDTO } from '../../dto/id.dto';
import { CreateValidatePmResponseDto } from './dto/create-validate-pm.dto';
import { ValidateService } from './validate.service';

@ApiTags('Admin')
@Controller('admin/user_has_accounts')
export class ValidateController {
  constructor(private readonly validateService: ValidateService) {}

  @ApiOperation({
    summary: 'User has accounts',
    description: 'check if user has accounts',
  })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User has accounts',
    type: CreateValidatePmResponseDto,
  })
  @Get('admin/:id')
  async userHasAccounts(@Param() params: IdDTO) {
    return this.validateService.userHasAccounts(params.id);
  }
}
