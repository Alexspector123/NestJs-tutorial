import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './types';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
    ) { }

    async login(login: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
        const user = await this.usersService.findOne(login);

        const passwordMatched = await bcrypt.compare(
            login.password,
            user.password,
        )

        if (passwordMatched) {
            const payload: PayloadType = { userId: user.id, email: user.email };
            const artist = await this.artistService.findArtist(user.id);
            if (artist) {
                payload.artistId = artist.id;
            }
            if (user.enable2FA && user.twoFASecret) {
                return {
                    validate2FA: 'http://localhost:3000/auth/validate-2fa',
                    message: 'Please sends the one time password/token from your Google Authenticator App',
                }
            }
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        } else {
            throw new UnauthorizedException('Password does not match');
        }
    }

    // two factor serivce
    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.usersService.findById(userId);
        if (!user.twoFASecret) {
            throw new BadRequestException('2FA is not enabled for this user');
        }
        if (user.enable2FA) {
            return { secret: user.twoFASecret };
        }
        const secret = speakeasy.generateSecret();
        console.log(secret);
        user.twoFASecret = secret.base32;
        await this.usersService.updateSecretKey(user.id, user.twoFASecret);
        return { secret: user.twoFASecret };
    }

    // Onetimepassword
    async validate2FAToken(userId: number, token: string): Promise<{ verified: boolean }> {
        try {
            const user = await this.usersService.findById(userId);
            if (!user.twoFASecret) {
                throw new BadRequestException('2FA is not enabled for this user');
            }
            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32',
            });

            if (verified) {
                return { verified: true };
            } else {
                return { verified: false };
            }
        } catch (error) {
            throw new UnauthorizedException('Error verifying token');
        }
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.usersService.disable2FA(userId);
    }
}
