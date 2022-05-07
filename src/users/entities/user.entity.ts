import internal from 'stream';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
