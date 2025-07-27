import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private UserRepo: Repository<User>,
    ) {}

    async create(createUser: CreateUserDTO): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUser.password, salt);
        const user = await this.UserRepo.create({
            ...createUser,
            password: hashedPassword,
            apiKey: uuid4(),
        });
        const savedUser = await this.UserRepo.save(user);
        const { password, ...result } = savedUser;
        return savedUser;
    }

    async findOne(data: LoginDTO): Promise<User> {
        const user = await this.UserRepo.findOneBy({email: data.email});
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findById(userId: number): Promise<User> {
        const user = await this.UserRepo.findOneBy({id: userId});
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
        return user;
    }

    async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
        return this.UserRepo.update(
            { id: userId },
            {
                twoFASecret: secret,
                enable2FA: true,
            }
        )
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.UserRepo.update(
            { id: userId },
            {
                enable2FA: false,
                twoFASecret: null,
            }
        )
    }

    async findByApiKey(apiKey: string): Promise<User> {
        const user = await this.UserRepo.findOneBy({apiKey: apiKey});
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }
}
