import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';

import { AuthGatewayResolver } from './auth/auth-gateway.resolver';
import { AuthGatewayService } from './auth/auth-gateway.service';

import { VehiclesGatewayResolver } from './vehicles/vehicles-gateway.resolver';
import { VehiclesGatewayService } from './vehicles/vehicles-gateway.service';

import { TrafficGatewayResolver } from './traffic/traffic-gateway.resolver';
import { TrafficGatewayService } from './traffic/traffic-gateway.service';

import { IncidentsGatewayResolver } from './incidents/incidents-gateway.resolver';
import { IncidentsGatewayService } from './incidents/incidents-gateway.service';

import { NotificationsGatewayResolver } from './notifications/notifications-gateway.resolver';
import { NotificationsGatewayService } from './notifications/notifications-gateway.service';

import { JwtStrategy } from './common/strategies/jwt.strategy';

@Module({
  imports: [
    HttpModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [
    JwtStrategy,

    AuthGatewayResolver,
    AuthGatewayService,

    VehiclesGatewayResolver,
    VehiclesGatewayService,

    TrafficGatewayResolver,
    TrafficGatewayService,

    IncidentsGatewayResolver,
    IncidentsGatewayService,

    NotificationsGatewayResolver,
    NotificationsGatewayService,
  ],
})
export class AppModule {}