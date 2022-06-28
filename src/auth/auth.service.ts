import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findUser(username);
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(user && isPasswordMatch) {
            user.password = "";
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

}
