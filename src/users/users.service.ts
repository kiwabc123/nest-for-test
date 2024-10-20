import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { groupBy } from 'lodash'; // Optional for grouping

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  async getUsersByDepartment() {
    const { data } = await firstValueFrom(
      this.httpService.get('https://dummyjson.com/users'),
    );
    return groupBy(data.users, 'company.department');
  }

  async getUsersfilterDepartment(name: string) {
    const { data } = await firstValueFrom(
      this.httpService.get('https://dummyjson.com/users')
    );
    const grouped = groupBy(data.users, 'company.department');
    return grouped[name] || [];
  }
}
