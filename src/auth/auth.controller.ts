import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(200) // 200 porque no tiene sentido devolver 201 cuando no se crea nada
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto);
    }

    @Post('signup')
    async signUp(@Body() signupDto: SignupDto): Promise<{ token: string }> {
        return this.authService.signUp(signupDto);
    }
}
