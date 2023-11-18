import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaController } from './aerolinea.controller';

@Module({
  providers: [AerolineaService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  controllers: [AerolineaController],
})
export class AerolineaModule {}
