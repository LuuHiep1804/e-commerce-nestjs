import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { CreateUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async addUser(createUserDTO: CreateUserDTO): Promise<User> {
        const newUser = await this.userModel.create(createUserDTO);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        return newUser;
    }

    async findUser(username: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({username: username});
        return user;
    }

}
