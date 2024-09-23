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
import { AccountIdDTO, IdDTO } from '../../dto/id.dto';
import {
  ResponseMoveDTO,
  ResponseUserDto,
  ResponseSingleUserDto,
  ResponseUserRoleDto,
  ResponseListUserDto,
} from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserListQueryDto } from './dto/query-list-user.dto';

@ApiTags('Admin')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return this.usersService.update(params.id, updateUserDto);
  }
}
