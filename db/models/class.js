'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    'classId': {
      'field': 'class_id',
      'primaryKey': true,
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'className': {
      'field': 'class_name',
      'type': DataTypes.STRING,
      'allowNull': false
    }
  }, {
    'tableName': 'class',
    'charset': 'utf8',
    'collate': 'utf8_general_ci'
});
Class.associate = function(models) {
    // associations can be defined here
  };
  return Class;
};