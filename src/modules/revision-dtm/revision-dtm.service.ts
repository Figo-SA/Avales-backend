import { Injectable } from '@nestjs/common';
import { CreateRevisionDtmDto } from './dto/create-revision-dtm.dto';
import { UpdateRevisionDtmDto } from './dto/update-revision-dtm.dto';

@Injectable()
export class RevisionDtmService {
  create(createRevisionDtmDto: CreateRevisionDtmDto) {
    return 'This action adds a new revisionDtm';
  }

  findAll() {
    return `This action returns all revisionDtm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} revisionDtm`;
  }

  update(id: number, updateRevisionDtmDto: UpdateRevisionDtmDto) {
    return `This action updates a #${id} revisionDtm`;
  }

  remove(id: number) {
    return `This action removes a #${id} revisionDtm`;
  }
}
