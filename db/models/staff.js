'use strict';

module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    'staffUserName': {
      'field': 'staff_username',
      'primaryKey': true,
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffPassword': {
      'field': 'staff_password',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffFullName': {
      'field': 'staff_fullname',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffPhoneNumber': {
      'field': 'staff_phonenumber',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffBirthday': {
      'field': 'staff_birthday',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffHolyBirthday': {
      'field': 'staff_holy_birthday',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'staffPosition': {
      'field': 'staff_position',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'isFirstTimeLogin': {
      'field': 'is_first_time_login',
      'type': DataTypes.BOOLEAN,
      'defaultValue': true
    }
  }, {
    'tableName': 'staff',
    'charset': 'utf8',
    'collate': 'utf8_general_ci'
});
  Staff.associate = function(models) {
    // associations can be defined here
  };
  return Staff;
};