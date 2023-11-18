/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl, IsDateString} from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly description: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly foundationDate: Date;
 
 @IsUrl()
 @IsNotEmpty()
 readonly webpage: string;
}