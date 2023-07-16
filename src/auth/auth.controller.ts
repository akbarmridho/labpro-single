import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { createResponseSchema } from '../utils/wrapper';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const userSessionSchema = z.object({
  username: z.string(),
  name: z.string(),
});

const loginResponseSchema = createResponseSchema(
  z.object({
    user: userSessionSchema,
    token: z.string(),
  }),
);

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: createZodDto(loginResponseSchema),
  })
  @ApiTags('auth')
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
  ): Promise<z.infer<typeof loginResponseSchema>> {
    // custom zod error pipe, cek github page nest-zod
    const payload = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    return {
      data: payload,
      status: 'success',
      message: 'Login berhasil',
    };
  }

  @UseGuards(AuthGuard)
  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({ type: createZodDto(userSessionSchema) })
  @Get('self')
  getProfile(@Request() req) {
    return req.user;
  }
}
