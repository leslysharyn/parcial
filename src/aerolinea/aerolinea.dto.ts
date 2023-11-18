/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsDate, IsUrl} from 'class-validator';
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
 
 @IsUrl()
 @IsNotEmpty()
 readonly webpage: string;
}