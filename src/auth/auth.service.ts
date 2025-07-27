import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(login: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOne(login);

        const passwordMatched = await bcrypt.compare(
            login.password,
            user.password,
        )

        if (passwordMatched) {
            const payload = { sub: user.id, email: user.email };
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        } else {
            throw new UnauthorizedException('Password does not match');
        }
    }
}
