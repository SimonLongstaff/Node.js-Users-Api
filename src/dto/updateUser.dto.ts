import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
