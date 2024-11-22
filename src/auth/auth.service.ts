import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@auth/dto';
import { UserService } from '@user/user.service';
import { Tokens } from '@auth/interfaces';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {}

    async register(registerDto: RegisterDto) {
        return this.userService.save(registerDto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async login(loginDto: LoginDto): Promise<Tokens> {
        const user: User = await this.userService.findOne(loginDto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (!user || !compareSync(loginDto.password, user.password)) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.id,
            roles: user.roles,
        });

        const refreshToken = await this.getRefreshToken(user.id);

        return { accessToken, refreshToken };
    }

    private async getRefreshToken(userId: string): Promise<Token> {
        return this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
            },
        });
    }
}
