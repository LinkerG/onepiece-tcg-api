import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role, User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { hash, compare as comparePassword } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CollectionService } from 'src/collection/collection.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: MongooseModel<User>,
        private jswService: JwtService,
        private collectionService: CollectionService,
    ) { }

    async signUp(signupDto: SignupDto): Promise<{ token: string, user: User }> {
        const { name, email, password } = signupDto;

        const hashedPassword = await hash(password, 10);

        const user = await this.userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: Role.USER,
        });

        const token = this.jswService.sign({ id: user._id });

        this.collectionService.createEmptyCollection(user._id);

        return { token, user };
    }

    async login(loginDto: LoginDto): Promise<{ token: string, user: User }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatches = await comparePassword(password, user.password);

        if (!passwordMatches)
            throw new UnauthorizedException('Invalid credentials');

        const token = this.jswService.sign({ id: user._id });

        return { token, user };
    }
}
