import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import bcrypt from "bcryptjs";

export class User extends Model {
  declare id: number;
  declare login: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue("password", bcrypt.hashSync(value, bcrypt.genSaltSync(10)));
      },
    },
  },
  {
    sequelize,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);
