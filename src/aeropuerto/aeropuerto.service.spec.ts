/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let airportsList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AeropuertoEntity = await repository.save({
        name: faker.company.name(),
        code: faker.company.name(),
        country: faker.company.name(),
        city: faker.company.name(),})
        airportsList.push(airport);
    }
  }

  it('findAll should return all airports', async () => {
    const airports: AeropuertoEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAeropuerto: AeropuertoEntity = airportsList[0];
    const airport: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAeropuerto.name)
    expect(airport.code).toEqual(storedAeropuerto.code)
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create should return a new airport', async () => {
    const airport: AeropuertoEntity = {
      id: "",
      name: faker.company.name(),
      code: faker.company.name(),
      country: faker.company.name(),
      city: faker.company.name(),
      airlines: []
    }
 
    const newAeropuerto: AeropuertoEntity = await service.create(airport);
    expect(newAeropuerto).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.name).toEqual(newAeropuerto.name)
    expect(storedAeropuerto.code).toEqual(newAeropuerto.code)
  });

  it('update should modify a airport', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    airport.name = "New airport";
     const updatedAeropuerto: AeropuertoEntity = await service.update(airport.id, airport);
    expect(updatedAeropuerto).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.name).toEqual(airport.name)
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AeropuertoEntity = airportsList[0];
    airport = {
      ...airport, name: "New name"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('delete should remove a airport', async () => {
    const airport: AeropuertoEntity = airportsList[0];
    await service.delete(airport.id);
     const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAeropuerto).toBeNull();
  });


});
