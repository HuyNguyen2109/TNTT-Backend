'use strict';

module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    'staffId': {
      'field': 'staff_id',
      'primaryKey': true,
      'type': DataTypes.INTEGER,
      'autoIncrement': true
    },
    'staffUserName': {
      'field': 'staff_username',
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
    'staffPosition': {
      'field': 'staff_position',
      'type': DataTypes.STRING,
      'allowNull': false
    },
    'isFirstTimeLogin': {
      'field': 'is_first_time_login',
      'type': DataTypes.BOOLEAN,
      'defaultValue': false
    }
  }, {
    'tableName': 'staff',
    'timestamps': false,
    'createAt': false,
    'updateAt': false
});
  Staff.associate = function(models) {
    // associations can be defined here
  };
  return Staff;
};