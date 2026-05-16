import { Test, TestingModule } from '@nestjs/testing';
import {
  IncidentStatus,
  IncidentType,
} from './incident.entity';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

describe('IncidentsController', () => {
  let controller: IncidentsController;

  const mockIncidentsService = {
    createIncident: jest.fn(),
    findAllIncidents: jest.fn(),
    findIncidentById: jest.fn(),
    updateIncidentStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
          useValue: mockIncidentsService,
        },
      ],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an incident', async () => {
    const input = {
      type: IncidentType.ACCIDENT,
      description: 'Accident pres du centre-ville',
      location: 'Tunis Centre',
    };

    const expectedResult = {
      id: 1,
      ...input,
      status: IncidentStatus.SIGNALE,
      createdAt: new Date(),
    };

    mockIncidentsService.createIncident.mockResolvedValue(expectedResult);

    const result = await controller.createIncident(input);

    expect(mockIncidentsService.createIncident).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });

  it('should return all incidents', async () => {
    const expectedResult = [
      {
        id: 1,
        type: IncidentType.ACCIDENT,
        description: 'Accident test',
        location: 'Tunis Centre',
        status: IncidentStatus.SIGNALE,
        createdAt: new Date(),
      },
    ];

    mockIncidentsService.findAllIncidents.mockResolvedValue(expectedResult);

    const result = await controller.findAllIncidents();

    expect(mockIncidentsService.findAllIncidents).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should return incident by id', async () => {
    const expectedResult = {
      id: 1,
      type: IncidentType.ACCIDENT,
      description: 'Accident test',
      location: 'Tunis Centre',
      status: IncidentStatus.SIGNALE,
      createdAt: new Date(),
    };

    mockIncidentsService.findIncidentById.mockResolvedValue(expectedResult);

    const result = await controller.findIncidentById(1);

    expect(mockIncidentsService.findIncidentById).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedResult);
  });

  it('should update incident status', async () => {
    const input = {
      incidentId: 1,
      status: IncidentStatus.RESOLU,
    };

    const expectedResult = {
      id: 1,
      type: IncidentType.ACCIDENT,
      description: 'Accident test',
      location: 'Tunis Centre',
      status: IncidentStatus.RESOLU,
      createdAt: new Date(),
    };

    mockIncidentsService.updateIncidentStatus.mockResolvedValue(expectedResult);

    const result = await controller.updateIncidentStatus(input);

    expect(mockIncidentsService.updateIncidentStatus).toHaveBeenCalledWith(
      input,
    );
    expect(result).toEqual(expectedResult);
  });
});