/* eslint-disable prettier/prettier */
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 description: string;
 
 @Column()
 foundationDate: Date;
 
 @Column()
 webpage: string;

 @ManyToMany(() => AeropuertoEntity, airport => airport.airlines)
 airports: AeropuertoEntity[];

}