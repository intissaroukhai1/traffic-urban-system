import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGatewayService } from './auth-gateway.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponseModel } from './models/auth-response.model';
import { UserModel } from './models/user.model';

@Resolver()
export class AuthGatewayResolver {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Mutation(() => AuthResponseModel)
  register(@Args('input') input: RegisterInput): Promise<AuthResponseModel> {
    return this.authGatewayService.register(input);
  }

  @Mutation(() => AuthResponseModel)
  login(@Args('input') input: LoginInput): Promise<AuthResponseModel> {
    return this.authGatewayService.login(input);
  }

  @Query(() => [UserModel])
  users(): Promise<UserModel[]> {
    return this.authGatewayService.users();
  }
}