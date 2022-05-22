import internal from 'stream';
import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { UserRecordEntity } from './userRecord.entity';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  password: string;

  @Column()
  userEducationLevel: number;

  @Column({ type: 'date' })
  userBirthDate: string;

  @Column({ length: 60 })
  address: string;

  @Column()
  userRefreshToken: string;

  @Column()
  totalStars: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
