import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import { User } from "./user";

export class Message extends Model {
  declare id: number;
  declare senderId: number;
  declare messageType: "TEXT" | "FILE";
  declare content: string | null;
  declare fileName: string | null;
  declare mimeType: string | null;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM("TEXT", "FILE"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    fileName: {
      type: DataTypes.STRING,
    },
    mimeType: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    timestamps: true,
    underscored: true,
  }
);

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
User.hasMany(Message, { foreignKey: "senderId", as: "messages" });
