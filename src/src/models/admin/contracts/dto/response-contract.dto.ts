import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  RIBPayContractResponseDto,
  VADSContractResponseDto,
} from 'src/models/contracts/dto/response-contract.dto';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

export class AdminVADSContractResponseDto extends VADSContractResponseDto {}

export class AdminRIBPayContractResponseDto extends RIBPayContractResponseDto {}

export class AdminContractListResponseDto {
  @ApiProperty({
    description:
      'Array of contracts which can be either RIBPay or VADS contracts',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(AdminRIBPayContractResponseDto) },
        { $ref: getSchemaPath(AdminVADSContractResponseDto) },
      ],
      discriminator: {
        propertyName: 'contract_type',
        mapping: {
          RIBPAY: getSchemaPath(AdminRIBPayContractResponseDto),
          VADS: getSchemaPath(AdminVADSContractResponseDto),
        },
      },
    },
  })
  Contracts: (AdminRIBPayContractResponseDto | AdminVADSContractResponseDto)[];

  Pagination: PaginationResponseDto;
}
