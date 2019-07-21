'use strict';

const models = require('../db/models');
const baseService = require('../services/base');

const getAllUser = () => {
  const rawQuery = `
    select staff_id as "staffId", 
            staff_username as "staffUserName", 
            staff_fullname as "staffFullName",
            staff_phonenumber as "staffPhoneNumber",
            staff_birthday as "staffBirthday",
            staff_position as "staffPosition",
            is_first_time_login as "isFirstTimeLogin"
    from staff;
  `;

  return baseService.selectWithRawQuery(rawQuery);
};

const createUSer = (data, transaction) => {
  return baseService.insert(models.Staff, data, transaction);
};

const getUserByUsername = (condition, attribute) => {
  return baseService.findByCondition(models.Staff, condition, attribute);
};

const updateUserbyUsername = (data, condition, transaction) => {
  return baseService.update(models.Staff, data, condition, transaction);
}

module.exports = {
  'getAllUser': getAllUser,
  'createUSer': createUSer,
  'getUserByUsername': getUserByUsername,
  'updateUserbyUsername': updateUserbyUsername
}