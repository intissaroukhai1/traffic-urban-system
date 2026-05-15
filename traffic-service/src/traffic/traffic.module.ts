import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { TrafficZone } from './traffic-zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficZone])],
  controllers: [TrafficController],
  providers: [TrafficService],
})
export class TrafficModule {}