import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@auth/dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {}

    @Get('refresh')
    async refreshTokens() {}

    @Post('logout')
    async logout() {}
}
