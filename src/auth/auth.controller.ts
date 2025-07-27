import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-guard';

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
    ): Promise<{ accessToken: string }> {
        return this.authService.login(login);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getProfile(
        @Req()
        request,
    ) {
        return request.user;
    }
}
