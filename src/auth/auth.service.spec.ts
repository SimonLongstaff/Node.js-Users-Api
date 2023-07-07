import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'adminPassword'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token when given valid credentials', async () => {
      const mockUser = { username: 'tester', password: 'password' };
      const mockToken = 'mocktoken';

      usersService.findAll = jest.fn().mockResolvedValue([mockUser]);
      usersService.findByUsername = jest.fn().mockResolvedValue(mockUser);
      jwtService.signAsync = jest.fn().mockResolvedValue(mockToken);

      const result = await authService.validateUser({
        username: mockUser.username,
        password: mockUser.password,
      });

      expect(result).toEqual({ access_token: 'mocktoken' });
    });

    it('should return a token when there are no users and given admin credentials', async () => {
      const mockUser = { username: 'admin', password: 'adminPassword' };
      usersService.findAll = jest.fn().mockResolvedValue([]);
      jwtService.signAsync = jest.fn().mockResolvedValue('mocktoken');

      const result = await authService.validateUser({
        username: mockUser.username,
        password: mockUser.password,
      });

      expect(result).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
        }),
      );
    });

    it('should throw an HttpException when given invalid credentials', async () => {
      const mockUser = { username: 'tester', password: 'password' };
      const mockLoginDto = { username: 'tester', password: 'wrongpassword' };

      usersService.findByUsername = jest.fn().mockResolvedValue(mockUser);
      usersService.findAll = jest.fn().mockResolvedValue([mockUser]);

      await expect(
        authService.validateUser({
          username: mockLoginDto.username,
          password: mockLoginDto.password,
        }),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw an HttpException when given no credentials', async () => {
      usersService.findAll = jest.fn().mockResolvedValue([]);
      usersService.findByUsername = jest.fn().mockResolvedValue(null);
      await expect(
        authService.validateUser({ username: '', password: '' }),
      ).rejects.toThrow(new UnauthorizedException());
    });
  });
});
