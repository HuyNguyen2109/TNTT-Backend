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
            staff_position as "sstaffPosition",
            is_first_time_login as "isFirstTimeLogin"
    from staff;
  `;

  return baseService.selectWithRawQuery(rawQuery);
};

const createUSer = (data, transaction) => {
  return baseService.insert(models.Staff, data, transaction);
};

module.exports = {
  'getAllUser': getAllUser,
  'createUSer': createUSer
}