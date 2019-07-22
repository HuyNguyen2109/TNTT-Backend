'use strict';

const models = require('../db/models');
const baseService = require('../services/base');

const getAllClasses = () => {
  return baseService.findAll(models.Class, ['classId', 'className']);
};

const createClass = (data, transaction) => {
  return baseService.insert(models.Class, data, transaction);
};

const getClassByClassId = (condition, attribute) => {
  return baseService.findByCondition(models.Class, condition, attribute);
};

const deleteClass = (condition, transaction) => {
  return baseService.deleteByConditions(models.Class, condition, transaction);
}

module.exports = {
  'getAllClasses': getAllClasses,
  'createClass': createClass,
  'getClassByClassId': getClassByClassId,
  'deleteClass': deleteClass
}