import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigService } from '@nestjs/config';

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
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => null),
            create: jest.fn(() => null),
            update: jest.fn(() => null),
            remove: jest.fn(() => null),
          },
        },
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'your-secret-key'),
          },
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'your-secret-key',
          signOptions: { expiresIn: '1d' },
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: 'a042a153-838e-4d5b-8300-8e9288556211',
          name: 'John Doe',
          email: 'user@email.com',
          password: '12345678',
        },
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = {
        id: 'a042a153-838e-4d5b-8300-8e9288556211',
        name: 'John Doe',
        email: 'user@email.com',
        password: '12345678',
      };

      const userUpdate = {
        id: 'a042a153-838e-4d5b-8300-8e9288556211',
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne(userUpdate)).toBe(result);
      expect(service.findOne).toBeCalled();
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      const result = {
        id: 'a042a153-838e-4d5b-8300-8e9288556211',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(service, 'create').mockImplementation(async () => result);

      expect(await controller.create(user)).toBe(result);
      expect(service.create).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      const userUpdate = {
        id: 'a042a153-838e-4d5b-8300-8e9288556211',
      };

      const result = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update(userUpdate, user)).toBe(result);
      expect(service.update).toBeCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = {
        id: 'a042a153-838e-4d5b-8300-8e9288556211',
      };

      await controller.remove(user);

      expect(service.remove).toBeCalled();
    });
  });
});
