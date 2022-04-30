import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('NOK')
export class NOKEntity {
  @PrimaryColumn()
  NOKID: string;

  @Column({ length: 30 })
  NOKName: string;

  @Column({ length: 30 })
  NOKPhoneNumber: string;

  @Column()
  NOKNotificationDays: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'UserID' })
  user: UserEntity;

  constructor(partial: Partial<NOKEntity>) {
    Object.assign(this, partial);
  }
}
