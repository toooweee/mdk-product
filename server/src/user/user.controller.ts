import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() dto) {
        return await this.userService.save(dto);
    }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get(':idOrEmail')
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        return await this.userService.findOne(idOrEmail);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.userService.delete(id);
    }
}
