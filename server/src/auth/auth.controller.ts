import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@auth/dto';
import { JwtPayload, Tokens } from '@auth/interfaces';
import { Response } from 'express';
import { Cookie, CurrentUser, Public, Roles, UserAgent } from '@common/decorators';
import { UserResponse } from '@user/responses';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@prisma/client';

const REFRESH_TOKEN = 'token';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) {
            throw new BadRequestException('Не получается зарегистрировать пользователя');
        }

        return new UserResponse(user);
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
            res.sendStatus(HttpStatus.OK);
            return;
        }
        const tokens = await this.authService.refreshTokens(refreshToken, agent);

        if (!tokens) {
            throw new UnauthorizedException();
        }
        this.setRefreshTokenToCookies(tokens, res);
    }

    @Post('logout')
    async logout(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        await this.authService.deleteRefreshToken(refreshToken);
        res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: false, expires: new Date() });
        res.sendStatus(HttpStatus.OK);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('me')
    me(@CurrentUser() user: JwtPayload) {
        return user;
    }

    private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            expires: new Date(tokens.refreshToken.exp),
            secure: false,
            sameSite: 'lax',
            path: '/',
        });

        res.status(HttpStatus.CREATED).json(tokens);
    }
}
