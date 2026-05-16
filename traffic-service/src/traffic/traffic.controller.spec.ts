import { Test, TestingModule } from '@nestjs/testing';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { TrafficLevel } from './traffic-zone.entity';

describe('TrafficController', () => {
  let controller: TrafficController;

  const mockTrafficService = {
    createZone: jest.fn(),
    findAllZones: jest.fn(),
    findZoneById: jest.fn(),
    updateDensity: jest.fn(),
    findCongestedZones: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficController],
      providers: [
        {
          provide: TrafficService,
          useValue: mockTrafficService,
        },
      ],
    }).compile();

    controller = module.get<TrafficController>(TrafficController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a traffic zone', async () => {
    const input = {
      name: 'Zone Centre Ville',
      location: 'Tunis Centre',
      vehicleCount: 85,
    };

    const expectedResult = {
      id: 1,
      name: 'Zone Centre Ville',
      location: 'Tunis Centre',
      vehicleCount: 85,
      density: 85,
      level: TrafficLevel.ELEVE,
      congested: true,
    };

    mockTrafficService.createZone.mockResolvedValue(expectedResult);

    const result = await controller.createZone(input);

    expect(mockTrafficService.createZone).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });

  it('should return all traffic zones', async () => {
    const expectedResult = [
      {
        id: 1,
        name: 'Zone Centre Ville',
        location: 'Tunis Centre',
        vehicleCount: 85,
        density: 85,
        level: TrafficLevel.ELEVE,
        congested: true,
      },
    ];

    mockTrafficService.findAllZones.mockResolvedValue(expectedResult);

    const result = await controller.findAllZones();

    expect(mockTrafficService.findAllZones).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should return one traffic zone by id', async () => {
    const expectedResult = {
      id: 1,
      name: 'Zone Centre Ville',
      location: 'Tunis Centre',
      vehicleCount: 85,
      density: 85,
      level: TrafficLevel.ELEVE,
      congested: true,
    };

    mockTrafficService.findZoneById.mockResolvedValue(expectedResult);

    const result = await controller.findZoneById(1);

    expect(mockTrafficService.findZoneById).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedResult);
  });

  it('should update traffic density', async () => {
    const input = {
      zoneId: 1,
      vehicleCount: 25,
    };

    const expectedResult = {
      id: 1,
      name: 'Zone Centre Ville',
      location: 'Tunis Centre',
      vehicleCount: 25,
      density: 25,
      level: TrafficLevel.FAIBLE,
      congested: false,
    };

    mockTrafficService.updateDensity.mockResolvedValue(expectedResult);

    const result = await controller.updateDensity(input);

    expect(mockTrafficService.updateDensity).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });

  it('should return congested zones', async () => {
    const expectedResult = [
      {
        id: 1,
        name: 'Zone Lac 2',
        location: 'Tunis Lac 2',
        vehicleCount: 95,
        density: 95,
        level: TrafficLevel.ELEVE,
        congested: true,
      },
    ];

    mockTrafficService.findCongestedZones.mockResolvedValue(expectedResult);

    const result = await controller.findCongestedZones();

    expect(mockTrafficService.findCongestedZones).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});