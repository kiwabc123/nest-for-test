import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; 
import { HttpModule } from '@nestjs/axios'; 

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], 
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsersByDepartment: jest.fn().mockResolvedValue([]), // Mock implementation
            getUsersfilterDepartment: jest.fn().mockResolvedValue([]), // Mock implementation
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

});
