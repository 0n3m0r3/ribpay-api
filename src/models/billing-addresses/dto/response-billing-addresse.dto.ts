import { ApiProperty } from '@nestjs/swagger';

export class BillingAddressDto {
  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the billing address.',
    type: 'string',
    format: 'uuid',
  })
  billing_address_id: string;

  @ApiProperty({
    example: '177 Avenue WINSTON CHURCHILL 62000 ARRAS',
    description: 'Full billing address.',
  })
  billing_address: string;

  @ApiProperty({ example: '177', description: 'Street number.' })
  billing_address_numero_voie: string;

  @ApiProperty({ example: 'BIS', description: 'Street number suffix.' })
  billing_address_indice_repetition?: string;

  @ApiProperty({ example: 'AVENUE', description: 'Type of street.' })
  billing_address_type_voie: string;

  @ApiProperty({ example: 'WINSTON CHURCHILL', description: 'Street name.' })
  billing_address_libelle_voie: string;

  @ApiProperty({ example: 'Bat A', description: 'Complement address.' })
  billing_address_complement_localisation?: string;

  @ApiProperty({ example: '62000', description: 'Postal code.' })
  billing_address_code_postal: string;

  @ApiProperty({ example: 'ARRAS', description: 'City name.' })
  billing_address_libelle_commune: string;

  @ApiProperty({ example: 'Cedex', description: 'Special delivery.' })
  billing_address_distribution_speciale?: string;

  @ApiProperty({ example: 'FRANCE', description: 'Country name.' })
  billing_address_pays: string;

  @ApiProperty({ example: 'FR', description: 'Country code.' })
  billing_address_code_pays: string;

  @ApiProperty({
    example: '2021-09-14T08:00:00.000Z',
    description: 'Creation date.',
  })
  billing_address_created_at: string;

  @ApiProperty({
    example: '2021-09-14T08:00:00.000Z',
    description: 'Last update date.',
  })
  billing_address_last_modified: string;

  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the account.',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the creator.',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}
