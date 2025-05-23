import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Roles } from './roles';
import { UserDto } from 'src/responseData/UserDto';

@Table({ tableName: 'clients', timestamps: false })
export class Users extends Model<Users, UserDto> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: 'varchar', allowNull: false })
  name: string;

  @Column({ type: 'varchar', allowNull: false })
  phone_number: string;

  @Column({ type: 'timestamp', allowNull: false })
  date_of_birth: string;

  @Column({ type: 'varchar', allowNull: false })
  size: string;

  @ForeignKey(() => Roles)
  @Column({ type: 'int', allowNull: true })
  role: number;

  @Column({ type: 'varchar', allowNull: true })
  password: string;

  @BelongsTo(() => Roles)
  roleDetails: Roles; // Связь с моделью Role
}
