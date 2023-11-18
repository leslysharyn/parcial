/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly airportRepository: Repository<AeropuertoEntity>
    ){}

    async findAll(): Promise<AeropuertoEntity[]> {
    return await this.airportRepository.find({ relations: ["airlines"] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const airport: AeropuertoEntity = await this.airportRepository.findOne({where: {id}, relations: ["airlines"] } );
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
   
        return airport;
    }

    async create(airport: AeropuertoEntity): Promise<AeropuertoEntity> {
        return await this.airportRepository.save(airport);
    }

    async update(id: string, airport: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto: AeropuertoEntity = await this.airportRepository.findOne({where:{id}});
        if (!persistedAeropuerto)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.airportRepository.save({...persistedAeropuerto, ...airport});
    }

    async delete(id: string) {
        const airport: AeropuertoEntity = await this.airportRepository.findOne({where:{id}});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.airportRepository.remove(airport);
    }

}
