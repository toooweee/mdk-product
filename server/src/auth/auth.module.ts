import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { options } from '@auth/congfig';
import { STRATEGIES } from '@auth/strategies';
import { GUARDS } from '@auth/guards';

@Module({
    imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
    controllers: [AuthController],
    providers: [AuthService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
