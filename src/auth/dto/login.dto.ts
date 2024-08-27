import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({
        description: 'User email address',
        required: true,
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'password',
        required: true,
    })
    //MinLength(8) //TODO Uncomment when prod
    password: string;
}