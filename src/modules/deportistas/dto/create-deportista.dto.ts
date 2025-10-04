import { DeportistaEditableDto } from './deportista-editable.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(DeportistaEditableDto)
export class CreateDeportistaDto extends DeportistaEditableDto {}
