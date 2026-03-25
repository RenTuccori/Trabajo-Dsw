import { DataTypes } from 'sequelize';

export const defineStudy = (sequelize) => {
  return sequelize.define('Study', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    performanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'performedDate',
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'studies',
    timestamps: false,
  });
};
