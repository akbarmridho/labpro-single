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

const loginSchema = z.object({
  user: userSessionSchema,
  token: z.string(),
});

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: createZodDto(createResponseSchema(loginSchema)),
  })
  @ApiTags('auth')
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
  ): Promise<z.infer<typeof loginSchema>> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({ type: createZodDto(createResponseSchema(userSessionSchema)) })
  @Get('self')
  getProfile(@Request() req): z.infer<typeof userSessionSchema> {
    return {
      username: req.user.username,
      name: req.user.name,
    };
  }
}
