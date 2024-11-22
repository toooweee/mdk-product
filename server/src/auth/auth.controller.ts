import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@auth/dto';
import { Tokens } from '@auth/interfaces';
import { Response } from 'express';
import { Cookie, Public, UserAgent } from '@common/decorators';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) {
            throw new BadRequestException('Не получается зарегистрировать пользователя');
        }

        return user;
    }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        const tokens = await this.authService.login(dto, agent);

        if (!tokens) {
            throw new BadRequestException('Ошибка входа');
        }

        this.setRefreshTokenToCookies(tokens, res);
    }

    @Get('refresh')
    async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const tokens = await this.authService.refreshTokens(refreshToken, agent);
        if (!tokens) {
            throw new UnauthorizedException();
        }
        this.setRefreshTokenToCookies(tokens, res);
    }

    @Post('logout')
    async logout() {}

    private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            expires: new Date(tokens.refreshToken.exp),
            secure: false,
            path: '/',
        });

        res.status(HttpStatus.CREATED).json(tokens);
    }
}
