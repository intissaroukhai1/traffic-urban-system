import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Incident,
  IncidentStatus,
  IncidentType,
} from './incident.entity';
import { IncidentsService } from './incidents.service';

describe('IncidentsService', () => {
  let service: IncidentsService;

  const mockIncidentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        {
          provide: getRepositoryToken(Incident),
          useValue: mockIncidentRepository,
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an incident with SIGNALE status', async () => {
    const input = {
      type: IncidentType.ACCIDENT,
      description: 'Accident pres du centre-ville',
      location: 'Tunis Centre',
    };

    const createdIncident = {
      id: 1,
      type: input.type,
      description: input.description,
      location: input.location,
      status: IncidentStatus.SIGNALE,
      createdAt: new Date(),
    };

    mockIncidentRepository.create.mockReturnValue(createdIncident);
    mockIncidentRepository.save.mockResolvedValue(createdIncident);

    const result = await service.createIncident(input);

    expect(mockIncidentRepository.create).toHaveBeenCalledWith({
      type: input.type,
      description: input.description,
      location: input.location,
    });

    expect(mockIncidentRepository.save).toHaveBeenCalledWith(createdIncident);

    expect(result.status).toBe(IncidentStatus.SIGNALE);
    expect(result.type).toBe(IncidentType.ACCIDENT);
  });

  it('should return all incidents ordered by createdAt DESC', async () => {
    const incidents = [
      {
        id: 1,
        type: IncidentType.ACCIDENT,
        description: 'Accident test',
        location: 'Tunis Centre',
        status: IncidentStatus.SIGNALE,
        createdAt: new Date(),
      },
    ];

    mockIncidentRepository.find.mockResolvedValue(incidents);

    const result = await service.findAllIncidents();

    expect(mockIncidentRepository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });

    expect(result).toEqual(incidents);
  });

  it('should return one incident by id', async () => {
    const incident = {
      id: 1,
      type: IncidentType.ACCIDENT,
      description: 'Accident test',
      location: 'Tunis Centre',
      status: IncidentStatus.SIGNALE,
      createdAt: new Date(),
    };

    mockIncidentRepository.findOne.mockResolvedValue(incident);

    const result = await service.findIncidentById(1);

    expect(mockIncidentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual(incident);
  });

  it('should throw NotFoundException when incident does not exist', async () => {
    mockIncidentRepository.findOne.mockResolvedValue(null);

    await expect(service.findIncidentById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update incident status to EN_COURS', async () => {
    const existingIncident = {
      id: 1,
      type: IncidentType.ACCIDENT,
      description: 'Accident test',
      location: 'Tunis Centre',
      status: IncidentStatus.SIGNALE,
      createdAt: new Date(),
    };

    const updatedIncident = {
      ...existingIncident,
      status: IncidentStatus.EN_COURS,
    };

    mockIncidentRepository.findOne.mockResolvedValue(existingIncident);
    mockIncidentRepository.save.mockResolvedValue(updatedIncident);

    const result = await service.updateIncidentStatus({
      incidentId: 1,
      status: IncidentStatus.EN_COURS,
    });

    expect(mockIncidentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(mockIncidentRepository.save).toHaveBeenCalledWith({
      ...existingIncident,
      status: IncidentStatus.EN_COURS,
    });

    expect(result.status).toBe(IncidentStatus.EN_COURS);
  });

  it('should update incident status to RESOLU', async () => {
    const existingIncident = {
      id: 1,
      type: IncidentType.ACCIDENT,
      description: 'Accident test',
      location: 'Tunis Centre',
      status: IncidentStatus.EN_COURS,
      createdAt: new Date(),
    };

    const updatedIncident = {
      ...existingIncident,
      status: IncidentStatus.RESOLU,
    };

    mockIncidentRepository.findOne.mockResolvedValue(existingIncident);
    mockIncidentRepository.save.mockResolvedValue(updatedIncident);

    const result = await service.updateIncidentStatus({
      incidentId: 1,
      status: IncidentStatus.RESOLU,
    });

    expect(result.status).toBe(IncidentStatus.RESOLU);
  });
});