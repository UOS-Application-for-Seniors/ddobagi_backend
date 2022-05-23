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
  field5: number;

  @Column()
  field6: number;

  @Column()
  CIST: number;

  @Column()
  PastCIST: number;

  @OneToOne(() => UserEntity, { primary: true, eager: true })
  @JoinColumn({ name: 'UserID' })
  user: UserEntity;

  constructor(partial: Partial<UserDataEntity>) {
    Object.assign(this, partial);
  }
}
