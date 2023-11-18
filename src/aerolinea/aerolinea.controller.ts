/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly airlineService: AerolineaService) {}

    @Get()
    async findAll() {
        return await this.airlineService.findAll();
    }

    @Get(':airlineId')
    async findOne(@Param('airlineId') airlineId: string) {
        return await this.airlineService.findOne(airlineId);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
        const culture: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.airlineService.create(culture);
    }

    @Put(':airlineId')
    async update(@Param('airlineId') airlineId: string, @Body() aerolineaDto: AerolineaDto) {
      const culture: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.airlineService.update(airlineId, culture);
    }

    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('airlineId') airlineId: string) {
      return await this.airlineService.delete(airlineId);
    }

}

