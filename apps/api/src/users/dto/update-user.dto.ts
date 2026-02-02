import { PartialType } from '@nestjs/mapped-types';
import { CreateRegularUserDto } from './create-regular-user.dto';

export class UpdateUserDto extends PartialType(CreateRegularUserDto) {}
