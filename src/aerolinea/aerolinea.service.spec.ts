/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let airlinesList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for(let i = 0; i < 5; i++){
        const airline: AerolineaEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webpage: faker.lorem.sentence()})
        airlinesList.push(airline);
    }
  }

  it('findAll should return all airlines', async () => {
    const airlines: AerolineaEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAerolinea: AerolineaEntity = airlinesList[0];
    const airline: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAerolinea.name)
    expect(airline.description).toEqual(storedAerolinea.description)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () => {
    const airline: AerolineaEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.company.name(),
      foundationDate: faker.date.past(),
      webpage: faker.company.name(),
      airports: []
    }
 
    const newAerolinea: AerolineaEntity = await service.create(airline);
    expect(newAerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(newAerolinea.name)
    expect(storedAerolinea.description).toEqual(newAerolinea.description)
  });

  it('update should modify a airline', async () => {
    const airline: AerolineaEntity = airlinesList[0];
    airline.name = "New airline";
     const updatedAerolinea: AerolineaEntity = await service.update(airline.id, airline);
    expect(updatedAerolinea).not.toBeNull();
     const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(airline.name)
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AerolineaEntity = airlinesList[0];
    airline = {
      ...airline, name: "New name"
    }
    await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('delete should remove a airline', async () => {
    const airline: AerolineaEntity = airlinesList[0];
    await service.delete(airline.id);
     const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedAerolinea).toBeNull();
  });

});
