import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtPayload } from '@auth/interfaces';
import { RegisterDto } from '@auth/dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { CreateUserDto } from '@user/dto';
import { Roles } from '@common/decorators';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(private readonly prismaService: PrismaService) {}

    async save(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);

        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: ['USER'],
            },
        });
    }

    async findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
        });
    }

    async findAll() {
        return this.prismaService.user.findMany();
    }

    async delete(id: string, user: JwtPayload) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }
        return this.prismaService.user.delete({
            where: { id },
            select: { id: true },
        });
    }

    async registerUserByAdmin(dto: RegisterDto) {
        const user = await this.findOne(dto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (user) {
            throw new ConflictException('Пользователь с таким email уже зарегистрирован');
        }

        return this.saveUserForAdmin(dto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async updateUserByAdmin(id: string, dto: UpdateUserDto) {
        if (dto.email) {
            const user1 = await this.findOne(dto.email).catch((err) => {
                this.logger.error(err);
                return null;
            });

            if (user1) {
                throw new ConflictException('Сейчас используется такой email');
            }
        }

        const user = await this.findOne(id).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (!user) {
            throw new BadRequestException('Такого пользователя не существует');
        }

        return this.updateUser(id, dto);
    }

    async saveUserForAdmin(dto: RegisterDto) {
        const hashedPassword = this.hashPassword(dto.password);
        return this.prismaService.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        const hashedPassword = dto.password ? this.hashPassword(dto.password) : user.password;

        return this.prismaService.user.update({
            where: { id },
            data: {
                name: dto.name ?? user.name,
                surname: dto.surname ?? user.surname,
                email: dto.email ?? user.email,
                password: hashedPassword,
                roles: user.roles,
            },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
