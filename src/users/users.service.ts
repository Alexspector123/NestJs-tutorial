import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcryptjs';

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
}
