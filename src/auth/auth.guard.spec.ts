import { Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let excutionContext: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<AuthGuard>(AuthGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);

    excutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer token',
          },
        }),
      }),
    };
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('returns true if execution context is authenticated', async () => {
      const result = await guard.canActivate(excutionContext);
      expect(result).toEqual(true);
    });

    it('throws UnauthorizedException if no token', async () => {
      excutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: '',
            },
          }),
        }),
      };

      await expect(guard.canActivate(excutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException if token is invalid', async () => {
      jwtService.verifyAsync = jest.fn().mockRejectedValue(new Error());

      await expect(guard.canActivate(excutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('extractTokenFromHeader', () => {
    it('returns token if authorization header is valid', () => {
      const request = excutionContext.switchToHttp().getRequest();
      const result = guard['extractTokenFromHeader'](request);
      expect(result).toEqual('token');
    });

    it('returns undefined if authorization header is invalid', () => {
      excutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: '',
            },
          }),
        }),
      };

      const request = excutionContext.switchToHttp().getRequest();
      const result = guard['extractTokenFromHeader'](request);
      expect(result).toEqual(undefined);
    });
  });
});
