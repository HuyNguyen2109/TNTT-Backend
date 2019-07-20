'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Staffs', {
      'staffId': {
        'field': 'staff_id',
        'primaryKey': true,
        'type': DataTypes.STRING,
        'allowNull': false
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Staffs');
  }
};