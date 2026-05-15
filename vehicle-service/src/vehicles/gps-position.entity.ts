import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('gps_positions')
export class GpsPosition {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('float')
  latitude!: number;

  @Column('float')
  longitude!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.positions, {
    onDelete: 'CASCADE',
  })
  vehicle!: Vehicle;
}