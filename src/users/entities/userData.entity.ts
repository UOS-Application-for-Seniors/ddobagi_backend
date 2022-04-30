import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('UserData')
export class UserDataEntity {
  @Column()
  field1: number;

  @Column()
  field2: number;

  @Column()
  field3: number;

  @Column()
  field4: number;

  @Column()
  CIST: number;

  @OneToOne(() => UserEntity, { primary: true })
  @JoinColumn({ name: 'UserID' })
  user: UserEntity;

  constructor(partial: Partial<UserDataEntity>) {
    Object.assign(this, partial);
  }
}
