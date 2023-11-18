/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly airlineAirportService: AerolineaAeropuertoService){}

    @Post(':airlineId/airports/:airportId')
   async addAirportToAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
       return await this.airlineAirportService.addAirportAirline(airlineId, airportId);
   }

   @Get(':airlineId/airports/:airportId')
   async findAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
       return await this.airlineAirportService.findAirportByAirlineIdAirportId(airlineId, airportId);
   }

   @Get(':airlineId/airports')
   async findAirportsFromAirlines(@Param('airlineId') airlineId: string){
       return await this.airlineAirportService.findAirportsByAirlineId(airlineId);
   }

   @Put(':airlineId/airports')
   async updateAirportsFromAirline(@Body() airportsDto: AeropuertoDto[], @Param('airlineId') airlineId: string){
       const airports = plainToInstance(AeropuertoEntity, airportsDto)
       return await this.airlineAirportService.associateAirportsAirline(airlineId, airports);
   }

   @Delete(':airlineId/airports/:airportId')
   @HttpCode(204)
   async deleteAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
       return await this.airlineAirportService.deleteAirportAirline(airlineId, airportId);
   }

}
