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
import {
  CreateValidatePpDto,
  ResponseValidatePpDto,
} from './dto/create-validate-pp.dto';

@ApiTags('Admin')
@Controller('admin')
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
  @Get('user_has_accounts/admin/:id')
  async userHasAccounts(@Param() params: IdDTO) {
    return this.validateService.userHasAccounts(params.id);
  }

  @ApiOperation({
    summary: 'Validate Personne Physique',
    description: 'Validate Personne Physique',
  })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'uuid' })
  @ApiBody({ type: CreateValidatePpDto })
  @ApiResponse({
    status: 201,
    description: 'Validation created',
    type: ResponseValidatePpDto,
  })
  @Post('validate/pp/:id')
  createPp(
    @Param() params: IdDTO,
    @Body() createValidateDto: CreateValidatePpDto,
  ) {
    return this.validateService.validatePp(params.id, createValidateDto);
  }
}
