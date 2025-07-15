import { Controller, Get, HttpCode, UnauthorizedException, Post, Request, Res, UseGuards, Body } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AuthService } from '@shared/auth/auth.service';
import { JwtAuthGuard } from '@shared/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@shared/auth/local-auth.guard';
import { Response } from 'express';
import { LocalRegisterAuthGuard } from '@shared/auth/local-register-auth.guard';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { AuthenticatedRequest } from '@shared/auth/auth.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(@Request() req: AuthenticatedRequest, @Res() response: Response) {
    const cookie = await this.authService.getCookieWithJwtToken(req.user);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ success: true });
  }

  @UseGuards(LocalRegisterAuthGuard)
  @Post('auth/register')
  @HttpCode(200)
  async register(@Request() req: AuthenticatedRequest, @Res() response: Response) {
    const cookie = await this.authService.getCookieWithJwtToken(req.user);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ success: true });
  }

  @Post('auth/logout')
  async logOut(@Res() response: Response) {
    const cookie = await this.authService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId || userId === -1) {
      return req.user;
    }
    const user = await this.authService.getProfile(userId);
    return Object.assign({}, req.user, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/impersonate')
  async impersonate(@Request() req: AuthenticatedRequest, @Res() response: Response) {
    if (!req.user.permissions.admin || !req.body.userId) {
      console.log('impersonate non authorized');
      throw new UnauthorizedException();
    }
    const cookie = await this.authService.getCookieForImpersonate(req.body.userId);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/unimpersonate')
  async unimpersonate(@Request() req: Express.AuthenticatedRequest, @Res() response: Response) {
    const cookie = await this.authService.getCookieForLogOut(req.user);
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Post('settings')
  async updateSettings(@Request() req: AuthenticatedRequest, @Body() data: any) {
    const userId = getUserIdFromUser(req.user);
    return this.authService.updateSettings(userId, data);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
