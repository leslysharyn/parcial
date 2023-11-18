/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsDate} from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly description: string;
 
 @IsDate()
 @IsNotEmpty()
 readonly foundationdate: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly webpage: string;
}