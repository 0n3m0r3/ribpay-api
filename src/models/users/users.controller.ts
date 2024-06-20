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
import { AccountIdDTO, IdDTO } from '../dto/id.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ResponseMoveDTO,
  ResponseUserDto,
  ResponseSingleUserDto,
  ResponseUserRoleDto,
  ResponseListUserDto,
} from './dto/response-user.dto';
import {
  AddUserToAccountDto,
  RemoveUserFromAccountDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserListQueryDto } from './dto/query-list-user.dto';

@ApiTags('Users')
@ApiHeaders([
  {
    name: 'sub-account',
    required: true,
    description: 'Sub-account identifier required for all requests',
  },
])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ResponseUserRoleDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(createUserDto, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: ResponseListUserDto,
  })
  @Get()
  findAll(
    @Req() req: any,
    @Query() query: UserListQueryDto,
  ): Promise<ResponseListUserDto> {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.usersService.findAll(req.subAccount, query, baseUrl);
  }

  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: ResponseSingleUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param() params: IdDTO, @Req() req: any) {
    return this.usersService.findOne(params.id, req.subAccount);
  }

  @ApiOperation({ summary: 'Retrieve a user by account ID' })
  @ApiParam({
    name: 'account_id',
    description: 'Unique identifier of the account',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: ResponseUserRoleDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('account/:account_id')
  findByAccountId(
    @Param() params: AccountIdDTO,
    @Req() req: any,
    @Query() query: UserListQueryDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    return this.usersService.findByAccountId(
      params.account_id,
      req.subAccount,
      query,
      baseUrl,
    );
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to update',
    type: 'uuid',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Updated user details',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  update(
    @Param() params: IdDTO,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.usersService.update(params.id, updateUserDto, req.subAccount);
  }

  @ApiOperation({ summary: 'Add a user to an account' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to add',
    type: 'uuid',
  })
  @ApiBody({ type: AddUserToAccountDto })
  @ApiResponse({
    status: 200,
    description: 'User added to account',
    type: ResponseMoveDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Put('/add/:id')
  addUserToAccount(
    @Param() params: IdDTO,
    @Body() addUserToAccountDto: AddUserToAccountDto,
    @Req() req: any,
  ) {
    return this.usersService.addUserToAccount(
      params.id,
      addUserToAccountDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Remove a user from an account' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to remove',
    type: 'uuid',
  })
  @ApiBody({ type: RemoveUserFromAccountDto })
  @ApiResponse({
    status: 200,
    description: 'User removed from account',
    type: ResponseMoveDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Put('/remove/:id')
  removeUserFromAccount(
    @Param() params: IdDTO,
    @Body() removeUserFromAccountDto: RemoveUserFromAccountDto,
    @Req() req: any,
  ) {
    return this.usersService.removeUserFromAccount(
      params.id,
      removeUserFromAccountDto,
      req.subAccount,
    );
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to delete',
    type: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Confirmation of user deletion' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IdDTO, @Req() req: any) {
    this.usersService.remove(params.id, req.subAccount);
  }
}
