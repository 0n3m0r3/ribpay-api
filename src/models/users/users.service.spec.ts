// users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from './../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      accounts: {
        findUnique: jest.fn(),
      },
      users: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user_has_accounts: {
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        account_id: 'account123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      const accountMock = {
        account_id: 'account123',
        creator_id: 'subAccount123',
        account_deletion_date: null,
        account_is_active: true,
      };

      const userMock = {
        user_id: 'user123',
        user_first_name: 'John',
        user_last_name: 'Doe',
        user_email: 'john.doe@example.com',
        user_phone: '1234567890',
        creator_id: 'subAccount123',
      };

      (prismaService.accounts.findUnique as jest.Mock).mockResolvedValue(
        accountMock,
      );
      (prismaService.users.create as jest.Mock).mockResolvedValue(userMock);
      (prismaService.user_has_accounts.create as jest.Mock).mockResolvedValue({
        user_id: 'user123',
        account_id: 'account123',
        user_role: 'user',
      });

      const result = await service.create(createUserDto, 'subAccount123');

      expect(result).toEqual({
        ...userMock,
        user_role: 'user',
      });
      expect(prismaService.accounts.findUnique).toHaveBeenCalledWith({
        where: {
          account_id: createUserDto.account_id,
          creator_id: 'subAccount123',
        },
      });
      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          user_first_name: createUserDto.first_name,
          user_last_name: createUserDto.last_name,
          user_email: createUserDto.email,
          user_phone: createUserDto.phone,
          creator_id: 'subAccount123',
        },
      });
      expect(prismaService.user_has_accounts.create).toHaveBeenCalledWith({
        data: {
          user_id: 'user123',
          account_id: createUserDto.account_id,
          user_role: 'user',
        },
      });
    });

    it('should throw BadRequestException if account does not exist', async () => {
      const createUserDto: CreateUserDto = {
        account_id: 'account123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      (prismaService.accounts.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create(createUserDto, 'subAccount123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if account is deleted', async () => {
      const createUserDto: CreateUserDto = {
        account_id: 'account123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      const accountMock = {
        account_id: 'account123',
        creator_id: 'subAccount123',
        account_deletion_date: new Date(),
        account_is_active: true,
      };

      (prismaService.accounts.findUnique as jest.Mock).mockResolvedValue(
        accountMock,
      );

      await expect(
        service.create(createUserDto, 'subAccount123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if account is not active', async () => {
      const createUserDto: CreateUserDto = {
        account_id: 'account123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      };

      const accountMock = {
        account_id: 'account123',
        creator_id: 'subAccount123',
        account_deletion_date: null,
        account_is_active: false,
      };

      (prismaService.accounts.findUnique as jest.Mock).mockResolvedValue(
        accountMock,
      );

      await expect(
        service.create(createUserDto, 'subAccount123'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
