import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { RoleDto } from 'src/responseData/RoleDto';

@Table({
  tableName: 'roles',
  timestamps: false,
})
export class Roles extends Model<Roles, RoleDto> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  })
  tags!: string[];
}
