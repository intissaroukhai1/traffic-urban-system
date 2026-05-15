import { IncidentType } from '../incident.entity';

export class CreateIncidentDto {
  type!: IncidentType;
  description!: string;
  location!: string;
}