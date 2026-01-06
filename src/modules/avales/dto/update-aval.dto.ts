import { PartialType } from '@nestjs/swagger';
import { AvalBaseDto } from './aval-base.dto';

export class UpdateAvalDto extends PartialType(AvalBaseDto) {}
