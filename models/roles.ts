import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';
import { RoleDto } from 'src/responseData/RoleDto';

@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Roles extends Model<Roles, RoleDto> {
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
