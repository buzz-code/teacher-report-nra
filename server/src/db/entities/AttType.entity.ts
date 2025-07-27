import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User.entity';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength, IsNumber } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';

@Entity('att_types')
@Index('att_types_user_id_idx', ['userId'], {})
@Index('att_types_name_idx', ['name'], {})
@Index('att_types_key_idx', ['key'], {})
export class AttType implements IHasUserId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @IsNumber({}, { always: true })
  @Column('int')
  key: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
