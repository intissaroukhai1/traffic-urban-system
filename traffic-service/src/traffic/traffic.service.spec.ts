import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrafficService } from './traffic.service';
import { TrafficLevel, TrafficZone } from './traffic-zone.entity';

describe('TrafficService', () => {
  let service: TrafficService;

  const mockTrafficZoneRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        {
          provide: getRepositoryToken(TrafficZone),
          useValue: mockTrafficZoneRepository,
        },
      ],
    }).compile();

    service = module.get<TrafficService>(TrafficService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a traffic zone with FAIBLE level when vehicleCount is 20', async () => {
    const input = {
      name: 'Zone Test Low',
      location: 'Tunis Centre',
      vehicleCount: 20,
    };

    const createdZone = {
      id: 1,
      ...input,
      density: 20,
      level: TrafficLevel.FAIBLE,
      congested: false,
    };

    mockTrafficZoneRepository.create.mockReturnValue(createdZone);
    mockTrafficZoneRepository.save.mockResolvedValue(createdZone);

    const result = await service.createZone(input);

    expect(mockTrafficZoneRepository.create).toHaveBeenCalledWith({
      name: input.name,
      location: input.location,
      vehicleCount: input.vehicleCount,
      density: 20,
      level: TrafficLevel.FAIBLE,
      congested: false,
    });

    expect(result.level).toBe(TrafficLevel.FAIBLE);
    expect(result.congested).toBe(false);
  });

  it('should create a traffic zone with MOYEN level when vehicleCount is 50', async () => {
    const input = {
      name: 'Zone Test Medium',
      location: 'Ariana',
      vehicleCount: 50,
    };

    const createdZone = {
      id: 2,
      ...input,
      density: 50,
      level: TrafficLevel.MOYEN,
      congested: false,
    };

    mockTrafficZoneRepository.create.mockReturnValue(createdZone);
    mockTrafficZoneRepository.save.mockResolvedValue(createdZone);

    const result = await service.createZone(input);

    expect(result.level).toBe(TrafficLevel.MOYEN);
    expect(result.congested).toBe(false);
  });

  it('should create a traffic zone with ELEVE level and congested true when vehicleCount is 90', async () => {
    const input = {
      name: 'Zone Test High',
      location: 'Lac 2',
      vehicleCount: 90,
    };

    const createdZone = {
      id: 3,
      ...input,
      density: 90,
      level: TrafficLevel.ELEVE,
      congested: true,
    };

    mockTrafficZoneRepository.create.mockReturnValue(createdZone);
    mockTrafficZoneRepository.save.mockResolvedValue(createdZone);

    const result = await service.createZone(input);

    expect(result.level).toBe(TrafficLevel.ELEVE);
    expect(result.congested).toBe(true);
  });

  it('should update traffic density and change level to FAIBLE', async () => {
    const existingZone = {
      id: 1,
      name: 'Zone Centre Ville',
      location: 'Tunis Centre',
      vehicleCount: 90,
      density: 90,
      level: TrafficLevel.ELEVE,
      congested: true,
    };

    const updatedZone = {
      ...existingZone,
      vehicleCount: 25,
      density: 25,
      level: TrafficLevel.FAIBLE,
      congested: false,
    };

    mockTrafficZoneRepository.findOne.mockResolvedValue(existingZone);
    mockTrafficZoneRepository.save.mockResolvedValue(updatedZone);

    const result = await service.updateDensity({
      zoneId: 1,
      vehicleCount: 25,
    });

    expect(result.vehicleCount).toBe(25);
    expect(result.level).toBe(TrafficLevel.FAIBLE);
    expect(result.congested).toBe(false);
  });

  it('should return congested zones only', async () => {
    const congestedZones = [
      {
        id: 1,
        name: 'Zone Lac 2',
        location: 'Tunis',
        vehicleCount: 95,
        density: 95,
        level: TrafficLevel.ELEVE,
        congested: true,
      },
    ];

    mockTrafficZoneRepository.find.mockResolvedValue(congestedZones);

    const result = await service.findCongestedZones();

    expect(mockTrafficZoneRepository.find).toHaveBeenCalledWith({
      where: {
        congested: true,
      },
    });

    expect(result).toEqual(congestedZones);
  });
});