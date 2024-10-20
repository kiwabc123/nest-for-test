import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { groupBy , isArray } from 'lodash'; // Optional for grouping

@Injectable()
export class UsersService {
    constructor(private readonly httpService: HttpService) { }

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

    async getUsersFilter() {
        const { data } = await firstValueFrom(
            this.httpService.get('https://dummyjson.com/users')
        );
    
        const groupedData = isArray(data.users) && data.users.reduce((acc, user) => {
            const department = user.company.department;
            const nameKey = user.firstName + user.lastName;
    
            if (!acc[department]) {
                acc[department] = {
                    male: 0,
                    female: 0,
                    minAge: user.age,
                    maxAge: user.age,
                    hair: {},
                    addressUser: {}
                };
            }
    
            // Count gender
            if (user.gender === 'male') {
                acc[department].male++;
            } else if (user.gender === 'female') {
                acc[department].female++;
            }
    
            // Update age
            if (user.age < acc[department].minAge) {
                acc[department].minAge = user.age;
            }
            if (user.age > acc[department].maxAge) {
                acc[department].maxAge = user.age;
            }
    
            // Count hair color
            if (user.hair) {
                const hairColor = user.hair.color;
                acc[department].hair[hairColor] = (acc[department].hair[hairColor] || 0) + 1;
            }
    
            // Map addresses
            acc[department].addressUser[nameKey] = user.address.postalCode;
    
            return acc;
        }, {});
    
        // Format age range
        for (const department in groupedData) {
            const minAge = groupedData[department].minAge;
            const maxAge = groupedData[department].maxAge;
            groupedData[department].ageRange = `${minAge}-${maxAge}`;
            
            delete groupedData[department].minAge;
            delete groupedData[department].maxAge;
        }
    
        // re order output structure
        const reorderedGroupedData = {};
        for (const department in groupedData) {
            reorderedGroupedData[department] = {
                male: groupedData[department].male,
                female: groupedData[department].female,
                ageRange: groupedData[department].ageRange, 
                hair: groupedData[department].hair,
                addressUser: groupedData[department].addressUser,
            };
        }
    
        return reorderedGroupedData;
    }
    
    
}

