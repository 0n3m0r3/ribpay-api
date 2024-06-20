import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
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
import { IdDTO } from '../dto/id.dto';
import { CreateValidatePmResponseDto } from './dto/create-validate-pm.dto';
import {
  CreateValidatePpDto,
  ResponseValidatePpDto,
} from './dto/create-validate-pp.dto';
import { FilesAzureService } from './files-azure.service';
import { ValidateService } from './validate.service';

@ApiHeaders([
  {
    name: 'sub-account',
    required: true,
    description: 'Sub-account identifier required for all requests',
  },
])
@ApiTags('Validation')
@Controller('validate')
export class ValidateController {
  constructor(
    private readonly validateService: ValidateService,
    private readonly filesAzureService: FilesAzureService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary: 'Validate PP',
    description: 'Create a validation entry for PP',
  })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'uuid' })
  @ApiBody({ type: CreateValidatePpDto })
  @ApiResponse({
    status: 201,
    description: 'Validation created',
    type: ResponseValidatePpDto,
  })
  @Post('pp/:id')
  createPp(
    @Param() params: IdDTO,
    @Body() createValidateDto: CreateValidatePpDto,
    @Req() req: any,
  ) {
    return this.validateService.createPp(
      params.id,
      createValidateDto,
      req.subAccount,
    );
  }

  @ApiOperation({
    summary: 'Validate PM',
    description: 'Create a validation entry for PM with a document upload',
  })
  @ApiParam({
    name: 'id',
    description: 'Account ID',
    type: 'uuid',
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload.',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Validation created',
    type: CreateValidatePmResponseDto,
  })
  @Post('pm/:id')
  @UseInterceptors(FileInterceptor('file'))
  async createPm(
    @Param() params: IdDTO,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: params.id,
        creator_id: req.subAccount,
      },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.account_deletion_date)
      throw new BadRequestException('Account has been deleted');
    if (account.account_is_active === true)
      throw new BadRequestException('Account is already active');
    const containerName = 'account-validation-pm';
    const fileUrl = await this.filesAzureService.uploadFile(
      file,
      containerName,
    );

    return this.validateService.createPm(params.id, fileUrl, req.subAccount);
  }
}
