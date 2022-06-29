import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/user')
    async getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/admin')
    async getDashboard(@Request() req) {
        return req.user;
    }

    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO) {
        const user = await this.userService.addUser(createUserDTO);
        return user;
    }
}
