import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from '../dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<any> {
    const zeroUserCheck = await this.usersService.findAll();
    if (
      zeroUserCheck.length === 0 &&
      signInDto.username === 'admin' &&
      signInDto.password === 'admin'
    ) {
      const payload = { username: 'admin', sub: 'admin' };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    const user = await this.usersService.findByUsername(signInDto.username);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
