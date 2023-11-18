/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let airlineRepository: Repository<AerolineaEntity>;
  let airportRepository: Repository<AeropuertoEntity>;
  let airline: AerolineaEntity;
  let airportsList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    airlineRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    airportRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();
 
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AeropuertoEntity = await airportRepository.save({
          name: faker.company.name(),
          code: faker.company.name(),
          country: faker.company.name(),
          city: faker.company.name()        
        })
        airportsList.push(airport);
    }
 
    airline = await airlineRepository.save({
      name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webpage: faker.lorem.sentence(),
        airports: airportsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add an airport to a airline', async () => {
    const newAirport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
          code: faker.company.name(),
          country: faker.company.name(),
          city: faker.company.name()   
    });

    const newAirline  = await airlineRepository.save({
      name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webpage: faker.lorem.sentence(),
    })

    const result: AerolineaEntity = await service.addAirportAirline(newAirline .id, newAirport.id);
    
    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name)
    expect(result.airports[0].code).toBe(newAirport.code)
    expect(result.airports[0].country).toBe(newAirport.country)
  });

  it('addAirportAirline should thrown exception for an invalid airport', async () => {
    const newAirline : AerolineaEntity = await airlineRepository.save({
      name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webpage: faker.lorem.sentence()
    })

    await expect(() => service.addAirportAirline(newAirline .id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('addAirportAirline should thrown exception for an invalid airline', async () => {
    const newAirport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
          code: faker.company.name(),
          country: faker.company.name(),
          city: faker.company.name()   
    });

    await expect(() => service.addAirportAirline("0", newAirport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportByAirlineIdAirportId should return airport by airline', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    const result: AeropuertoEntity = await service.findAirportByAirlineIdAirportId(airline.id, airport.id);
    expect(result).not.toBeNull();
    expect(result.name).toBe(airport.name)
    expect(result.code).toBe(airport.code)
    expect(result.country).toBe(airport.country)
  });

  it('findAirportByAirlineIdAirportId should thrown exception for an invalid airport', async () => {
    await expect(() => service.findAirportByAirlineIdAirportId(airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportByAirline IdAirportId should thrown exception for an invalid airline', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    await expect(() => service.findAirportByAirlineIdAirportId("0", airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportsByAirlineId should return all airports by airline', async () => {
    const result: AeropuertoEntity[] = await service.findAirportsByAirlineId(airline.id);
    expect(result).not.toBeNull();
    expect(result.length).toBe(airportsList.length);
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an airport not associated to the airline', async () => {
    const airport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name() 
    });

    await expect(() => service.findAirportByAirlineIdAirportId(airline.id, airport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline");
  });

  it('findAirportsByAirline Id should throw an exception for an invalid museum', async () => {
    await expect(() => service.findAirportsByAirlineId("0")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('associateAirportsAirline should update airports list for a airline', async () => {
    const newAirport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name() 
    });

    const updatedAirline : AerolineaEntity = await service.associateAirportsAirline(airline.id, [newAirport]);
    expect(updatedAirline .airports.length).toBe(1);
    expect(updatedAirline .airports[0].name).toBe(newAirport.name);
    expect(updatedAirline .airports[0].code).toBe(newAirport.code);
    expect(updatedAirline .airports[0].country).toBe(newAirport.country);
  });

  it('associateAirportsAirline should throw an exception for an invalid airport', async () => {
    const newAirport: AeropuertoEntity = airportsList[0];
    newAirport.id = "0";

    await expect(()=> service.associateAirportsAirline(airline.id, [newAirport])).rejects.toHaveProperty("message", "The airport with the given id was not found"); 
  });

  it('associateAirportsAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name() 
    });
    await expect(()=> service.associateAirportsAirline("0", [newAirport])).rejects.toHaveProperty("message", "The airline with the given id was not found"); 
  });

  it('deleteAirportToAirline should remove an airport from a airline', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    await service.deleteAirportAirline (airline.id, airport.id);

    const storedAirline : AerolineaEntity = await airlineRepository.findOne({where: {id: airline.id}, relations: ["airports"]});
    const deletedAirport: AeropuertoEntity = storedAirline .airports.find(a => a.id === airport.id);

    expect(deletedAirport).toBeUndefined();
  });

  it('deleteAirportToAirline  should throw an exception for an invalid airport', async () => {
    await expect(()=> service.deleteAirportAirline (airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found"); 
  });

  it('deleteAirportToAirline  should throw an exception for an invalid airline', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    await expect(()=> service.deleteAirportAirline ("0", airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found"); 
  });

  it('deleteAirportToAirline  should throw an exception for an airport not associated to the airline', async () => {
    const airport: AeropuertoEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name() 
    });

    await expect(()=> service.deleteAirportAirline (airline.id, airport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline"); 
  });
});
