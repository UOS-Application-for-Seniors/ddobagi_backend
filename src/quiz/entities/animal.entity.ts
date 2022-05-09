import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm/index';

@Entity('Animal')
export class AnimalEntity {
  @PrimaryGeneratedColumn()
  animalName: string;

  constructor(partial: Partial<AnimalEntity>) {
    Object.assign(this, partial);
  }
}
