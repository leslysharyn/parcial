/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoDto } from './aeropuerto.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly airportService: AeropuertoService) {}

    @Get()
    async findAll() {
        return await this.airportService.findAll();
    }

    @Get(':airportId')
    async findOne(@Param('airportId') airportId: string) {
        return await this.airportService.findOne(airportId);
    }

    @Post()
    async create(@Body() airportDto: AeropuertoDto) {
        const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, airportDto);
        return await this.airportService.create(airport);
    }

    @Put(':airportId')
    async update(@Param('airportId') airportId: string, @Body() airportDto: AeropuertoDto) {
      const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, airportDto);
      return await this.airportService.update(airportId, airport);
    }

    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') airportId: string) {
      return await this.airportService.delete(airportId);
    }
}
