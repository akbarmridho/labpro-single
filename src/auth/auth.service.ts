import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user === null || user.password !== (await bcrypt.hash(password, 10))) {
      throw new UnauthorizedException();
    }

    const { password: _, ...userPayload } = user;

    return {
      token: await this.jwtService.signAsync(userPayload),
      user: userPayload,
    };
  }
}
