import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  TRAVAUX = 'TRAVAUX',
  ROUTE_FERMEE = 'ROUTE_FERMEE',
  EMBOUTEILLAGE = 'EMBOUTEILLAGE',
}

export enum IncidentStatus {
  SIGNALE = 'SIGNALE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
}

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  type!: IncidentType;

  @Column()
  description!: string;

  @Column()
  location!: string;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.SIGNALE,
  })
  status!: IncidentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}