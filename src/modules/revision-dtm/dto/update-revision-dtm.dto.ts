import { PartialType } from '@nestjs/swagger';
import { CreateRevisionDtmDto } from './create-revision-dtm.dto';

export class UpdateRevisionDtmDto extends PartialType(CreateRevisionDtmDto) {}
