'use strict';

const models = require('../db/models');
const baseService = require('../services/base');

const getAllUser = () => {
  return baseService.findAll(models.Staff, ['staffUserName', 'staffFullName', 'staffPhoneNumber', 'staffBirthday', 'staffHolyBirthday', 'staffPosition', 'isFirstTimeLogin']);
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

const deleteUser = (condition, transaction) => {
  return baseService.deleteByConditions(models.Staff, condition, transaction);
}

module.exports = {
  'getAllUser': getAllUser,
  'createUSer': createUSer,
  'getUserByUsername': getUserByUsername,
  'updateUserbyUsername': updateUserbyUsername,
  'deleteUser': deleteUser
}