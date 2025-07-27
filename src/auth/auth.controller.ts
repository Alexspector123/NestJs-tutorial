import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-guard';
import { request } from 'http';
import { Enable2FAType } from './types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    signup(
        @Body()
        createUser: CreateUserDTO,
    ): Promise<User> {
        return this.userService.create(createUser);
    }

    @Get('login')
    login(
        @Body()
        login: LoginDTO,
    ): Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
        return this.authService.login(login);
    }

    @Get('enable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(
        @Req()
        request
    ): Promise<UpdateResult> {
        return this.authService.disable2FA(request.user.userId)
    }

    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(
        @Req()
        request
    ): Promise<Enable2FAType> {
        return this.authService.enable2FA(request.user.userId)
    }

    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    validate2FA(
        @Req()
        request,
        @Body()
        validateToken: ValidateTokenDTO,
    ): Promise<{ verified: boolean }> {
        return this.authService.validate2FAToken(
            request.user.userId,
            validateToken.token,
        )
    }

    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile (
        @Req()
        req
    ) {
        delete req.user.password;
        return {
            msg: 'authenticated with api key',
            user: req.user,
        }
    };
}
