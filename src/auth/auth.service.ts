import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
    ) { }

    async login(login: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOne(login);

        const passwordMatched = await bcrypt.compare(
            login.password,
            user.password,
        )

        if (passwordMatched) {
            const payload : PayloadType = { userId: user.id, email: user.email };
            const artist = await this.artistService.findArtist(user.id);
            if (artist) {
                payload.artistId = artist.id;
            }
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        } else {
            throw new UnauthorizedException('Password does not match');
        }
    }
}
