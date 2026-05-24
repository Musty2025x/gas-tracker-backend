import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../users/user.entity';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString()
  stationId?: string;
}