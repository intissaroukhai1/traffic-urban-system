import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GpsPosition } from './gps-position.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  plateNumber!: string;

  @Column()
  type!: string;

  @Column({ default: 'ACTIVE' })
  status!: string;

  @OneToMany(() => GpsPosition, (position) => position.vehicle)
  positions!: GpsPosition[];
}