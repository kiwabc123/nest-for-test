import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get('grouped')
  async getUsersByDepartmentOrFilter(@Query('name') name?: string) {
    if (name) {
      return await this.usersService.getUsersfilterDepartment(name);
    }
    return await this.usersService.getUsersByDepartment();
  }
  @Get('filtered')
  async getUsersFilter() {
    return await this.usersService.getUsersFilter()
  }
}
