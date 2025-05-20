import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { UserDto } from 'src/responseData/UserDto';

@Table({ tableName: 'couches', timestamps: false })
export class Coach extends Model<Coach, UserDto> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: 'int', allowNull: false })
  kind_of_sport_id: number;

  @Column({ type: 'varchar', allowNull: false })
  name: string;

  @Column({ type: 'varchar', allowNull: false })
  phone_number: string;

  @Column({ type: 'timestamp', allowNull: false })
  date_of_birth: string;

  @Column({ type: 'int', allowNull: true })
  role: number;

  @Column({ type: 'varchar', allowNull: true })
  password: string;

  @Column({ type: 'varchar', allowNull: true })
  gender: string;

  @Column({ type: 'int', allowNull: true })
  salary_id: number;

  @Column({ type: 'varchar', allowNull: true })
  qualify: string;
}
