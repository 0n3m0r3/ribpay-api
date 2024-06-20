import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesAzureService {
  private containerName: string;

  constructor(private readonly configService: ConfigService) {}

  private async getBlobServiceInstance() {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    return BlobServiceClient.fromConnectionString(connectionString);
  }

  private async getBlobClient(fileName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerClient = blobService.getContainerClient(this.containerName);
    return containerClient.getBlockBlobClient(fileName);
  }

  public async uploadFile(
    file: Express.Multer.File,
    containerName: string,
  ): Promise<string> {
    this.containerName = containerName;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    const blockBlobClient = await this.getBlobClient(fileName);
    await blockBlobClient.uploadData(file.buffer);
    return blockBlobClient.url;
  }
}
