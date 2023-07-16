import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user === null || !(await compare(password, user.password))) {
      throw new UnauthorizedException('credentials not match');
    }

    const { password: _, id: __, ...userPayload } = user;

    return {
      token: await this.jwtService.signAsync(userPayload),
      user: userPayload,
    };
  }
}
