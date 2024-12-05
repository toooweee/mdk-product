import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from '@user/responses';
import { CurrentUser, Roles } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@prisma/client';
import { RegisterDto } from '@auth/dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAllUsers() {
        const users = await this.userService.findAll();
        return users.map((user) => new UserResponse(user));
    }

    @Post('register-user')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async registerUserByAdmin(@Body() dto: RegisterDto) {
        const user = await this.userService.registerUserByAdmin(dto);
        if (!user) {
            throw new BadRequestException(`Не удается зарегистрировать пользователя с данными: ${JSON.stringify(dto)}`);
        }
        return new UserResponse(user);
    }

    @Patch('update-user/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async updateUserByAdmin(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const user = await this.userService.updateUserByAdmin(id, dto);
        if (!user) {
            throw new BadRequestException(`Не удается обновить пользователя с данными: ${JSON.stringify(dto)}`);
        }
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return new UserResponse(user);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        return this.userService.delete(id, user);
    }
}
