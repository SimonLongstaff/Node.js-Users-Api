import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [new User(), new User()];
      (repository.find as jest.Mock).mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = new User();
      (repository.findBy as jest.Mock).mockResolvedValue([result]);

      expect(await service.findOne('1')).toBe(result);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by name', async () => {
      const result = new User();
      result.name = '1';
      (repository.findBy as jest.Mock).mockResolvedValue([result]);

      expect(await service.findByUsername('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = new User();
      (repository.create as jest.Mock).mockReturnValue(user);
      (repository.save as jest.Mock).mockResolvedValue(user);

      expect(await service.create(user)).toBe(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = new User();
      (repository.update as jest.Mock).mockResolvedValue(user);

      expect(await service.update('1', user)).toBe(user);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = { affected: 1 };
      const deleteDto = { id: '1' };
      (repository.delete as jest.Mock).mockResolvedValue(result);

      expect(await service.remove(deleteDto)).toBe(result);
    });
  });
});
