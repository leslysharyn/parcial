/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly airportRepository: Repository<AeropuertoEntity>,
    
        @InjectRepository(AerolineaEntity)
        private readonly airlineRepository: Repository<AerolineaEntity>
    ) {}

    async addAirportAirline(airlineId: string, airportId: string): Promise<AerolineaEntity> {
      const airport: AeropuertoEntity = await this.airportRepository.findOne({where: {id: airportId}});
      if (!airport)
        throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
    
      const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]})
      if (!airline)
        throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
  
      airline.airports = [...airline.airports, airport];
      return await this.airlineRepository.save(airline);
    }
  
  async findAirportByAirlineIdAirportId(airlineId: string, airportId: string): Promise<AeropuertoEntity> {
      const airport: AeropuertoEntity = await this.airportRepository.findOne({where: {id: airportId}});
      if (!airport)
        throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
     
      const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
      if (!airline)
        throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
 
      const airlineAirport: AeropuertoEntity = airline.airports.find(e => e.id === airport.id);
 
      if (!airlineAirport)
        throw new BusinessLogicException("The airport with the given id is not associated to the airline", BusinessError.PRECONDITION_FAILED)
 
      return airlineAirport;
  }
  
  async findAirportsByAirlineId(airlineId: string): Promise<AeropuertoEntity[]> {
      const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
      if (!airline)
        throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
     
      return airline.airports;
  }
  
  async associateAirportsAirline(airlineId: string, airports: AeropuertoEntity[]): Promise<AerolineaEntity> {
      const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
  
      if (!airline)
        throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
  
      for (let i = 0; i < airports.length; i++) {
        const airport: AeropuertoEntity = await this.airportRepository.findOne({where: {id: airports[i].id}});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
      }
  
      airline.airports = airports;
      return await this.airlineRepository.save(airline);
    }
  
  async deleteAirportAirline(airlineId: string, airportId: string){
      const airport: AeropuertoEntity = await this.airportRepository.findOne({where: {id: airportId}});
      if (!airport)
        throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
  
      const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
      if (!airline)
        throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
  
      const airlineAirport: AeropuertoEntity = airline.airports.find(e => e.id === airport.id);
  
      if (!airlineAirport)
          throw new BusinessLogicException("The airport with the given id is not associated to the airline", BusinessError.PRECONDITION_FAILED)

      airline.airports = airline.airports.filter(e => e.id !== airportId);
      await this.airlineRepository.save(airline);
  }  
        
    
}
