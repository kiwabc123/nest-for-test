import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsersByDepartment: jest.fn(),
            getUsersfilterDepartment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getUsersByDepartment', async () => {
    const mockResponse = { Engineering: [], Support: [] };
    jest.spyOn(service, 'getUsersByDepartment').mockResolvedValue(mockResponse);

    const result = await controller.getUsersByDepartmentOrFilter();
    expect(result).toEqual(mockResponse);
    expect(service.getUsersByDepartment).toHaveBeenCalled();
  });

  it('should call getUsersfilterDepartment', async () => {
    const mockResponse = [{ id: 1, name: 'Emily' }];
    const departmentName = 'Engineering';
    jest.spyOn(service, 'getUsersfilterDepartment').mockResolvedValue(mockResponse);

    const result = await controller.getUsersByDepartmentOrFilter(departmentName);
    expect(result).toEqual(mockResponse);
    expect(service.getUsersfilterDepartment).toHaveBeenCalledWith(departmentName);
  });
});

describe('UsersServiceFilter', () => {
  let service: UsersService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should group users correctly', async () => {
    const mockUsers = [
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        age: 28,
        gender: 'female',
        hair: { color: 'Brown' },
        company: { department: 'Engineering' },
        address: { postalCode: '29112' }
      },
      {
        firstName: 'Alexander',
        lastName: 'Jones',
        age: 35,
        gender: 'male',
        hair: { color: 'Black' },
        company: { department: 'Engineering' },
        address: { postalCode: '86684' }
      },
      {
        firstName: 'Madison',
        lastName: 'Collins',
        age: 40,
        gender: 'female',
        hair: { color: 'Blond' },
        company: { department: 'Engineering' },
        address: { postalCode: '62091' }
      }
    ];
  
  
  
    const mockResponse: AxiosResponse = {
      data: { users: mockUsers },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      },
      request: {}
    };
  
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
    const startTime = Date.now();
  
    const result = await service.getUsersFilter();
  
    const expected = {
      Engineering: {
        male: 1,
        female: 2,
        ageRange: '28-40',
        hair: {
          Brown: 1,
          Black: 1,
          Blond: 1
        },
        addressUser: {
          EmilyJohnson: '29112',
          AlexanderJones: '86684',
          MadisonCollins: '62091'
        }
      }
    };
  
    expect(result).toEqual(expected);
  
    const endTime = Date.now();
  
    const duration = endTime - startTime;
    console.log(`getUsersFilter executed in ${duration} ms`);
  
    expect(duration).toBeLessThan(1000);
  });
  
  
  it('should perform getUsersFilter with acceptable speed', async () => {
    const mockUsers = [
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        age: 28,
        gender: 'female',
        hair: { color: 'Brown' },
        company: { department: 'Engineering' },
        address: { postalCode: '29112' }
      },
      {
        firstName: 'Alexander',
        lastName: 'Jones',
        age: 35,
        gender: 'male',
        hair: { color: 'Black' },
        company: { department: 'Engineering' },
        address: { postalCode: '86684' }
      },
      {
        firstName: 'Madison',
        lastName: 'Collins',
        age: 40,
        gender: 'female',
        hair: { color: 'Blond' },
        company: { department: 'Engineering' },
        address: { postalCode: '62091' }
      }
    ];
  
  
  
    const mockResponse: AxiosResponse = {
      data: { users: mockUsers },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      },
      request: {}
    };
  
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
  
    const runs = 10; // Number of test runs
    let totalDuration = 0;
  
    for (let i = 0; i < runs; i++) {
      const startTime = Date.now();
      await service.getUsersFilter();
      const endTime = Date.now();
      totalDuration += endTime - startTime;
    }
  
    const averageDuration = totalDuration / runs;
    console.log(`Average execution time: ${averageDuration} ms`);
  
    expect(averageDuration).toBeLessThan(1000); // Adjust as necessary
  });
});


