import { PartialType } from '@nestjs/swagger';
import { CreateDeckDTO } from './create-deck.dto';

export class UpdateDeckDTO extends PartialType(CreateDeckDTO) { }
