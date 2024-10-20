import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
