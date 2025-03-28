import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';
import { UserDto } from 'src/responseData/UserDto';

@Table({ tableName: 'users' })
export class Users extends Model<Users, UserDto> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  guid!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  login!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  last_name!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  photo!: string;

  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  role!: number;

  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  updated_password!: number;
}
