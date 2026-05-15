import { IncidentStatus } from '../incident.entity';

export class UpdateIncidentStatusDto {
  incidentId!: number;
  status!: IncidentStatus;
}