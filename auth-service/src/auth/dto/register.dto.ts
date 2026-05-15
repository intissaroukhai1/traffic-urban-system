import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  fullName!: string;
  email!: string;
  password!: string;
  role!: UserRole;
}