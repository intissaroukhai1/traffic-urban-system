import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TrafficLevel {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE',
}

@Entity('traffic_zones')
export class TrafficZone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column({ default: 0 })
  vehicleCount!: number;

  @Column({ default: 0 })
  density!: number;

  @Column({
    type: 'enum',
    enum: TrafficLevel,
    default: TrafficLevel.FAIBLE,
  })
  level!: TrafficLevel;

  @Column({ default: false })
  congested!: boolean;
}