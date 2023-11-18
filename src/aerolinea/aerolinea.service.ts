/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly airlineRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.airlineRepository.find({ relations: ["airports"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const airline: AerolineaEntity = await this.airlineRepository.findOne({where: {id}, relations: ["airports"] } );
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
   
        return airline;
    }
    
    async create(airline: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.airlineRepository.save(airline);
    }
    
    async update(id: string, airline: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.airlineRepository.findOne({where:{id}});
        if (!persistedAerolinea)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.airlineRepository.save({...persistedAerolinea, ...airline});
    }

    async delete(id: string) {
        const airline: AerolineaEntity = await this.airlineRepository.findOne({where:{id}});
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.airlineRepository.remove(airline);
    }
}
