const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Children = require('../models/children');

const moment = require('moment');
const csv = require('csv-express');

const capitalizeWord = (text) => {
  var splitStr = text.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  // Directly return the joined string
  return splitStr.join(' ');
};

const WithPagination = (req, res) => {
  const itemPerPage = parseInt(req.query.itemPerPage);
  const page = Math.max(0, parseInt(req.params.page));
  const search = req.query.search;
  const classes = req.query.class;

  let searchQueryUpperCase;
  let searchQueryLowerCase;
  let searchQueryCapitalize;

  if (search !== undefined) {
    searchQueryUpperCase = req.query.search.toUpperCase();
    searchQueryLowerCase = req.query.search.toLowerCase();
    searchQueryCapitalize = capitalizeWord(req.query.search);
  }


  return Children
    .find((search === undefined) ?
      ((classes === 'all') ? {} : { 'class': classes }) :
      (classes === 'all') ? {
        '$and': [
          {
            '$or': [
              { 'name': { '$regex': searchQueryUpperCase } },
              { 'name': { '$regex': searchQueryLowerCase } },
              { 'name': { '$regex': searchQueryCapitalize } }
            ]
          }
        ]
      } : {
        '$and': [
          {
            '$or': [
              { 'name': { '$regex': searchQueryUpperCase } },
              { 'name': { '$regex': searchQueryLowerCase } },
              { 'name': { '$regex': searchQueryCapitalize } }
            ]
          },
          { 'class': classes }
        ]
      })
    .limit(itemPerPage)
    .skip(itemPerPage * (page))
    .lean()
    .then((records) => {
      if (!records) {
        throw resultDto.notFound(messageCodes.E004);
      }
      res.sendSuccess(resultDto.success(messageCodes.I001, records));
    })
    .catch((err) => {
      res.sendError(err);
      log.error('Problem when retreiving data: ', err);
    });
};

const countDocument = (req, res) => {
  const condition = req.query.condition;

  return Children
    .countDocuments((condition === 'all') ? {} : { 'class': condition })
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      res.sendError(err);
      log.error(err);
    });
};

const exportData = (req, res) => {
  return Children
    .find({})
    .lean()
    .then((records) => {
      if (!records) {
        throw resultDto.notFound(messageCodes.E004);
      }
      // const fields = {
      //   'ID': 'ID',
      //   'name': 'name',
      //   'father_name': 'father_name',
      //   'mother_name': 'mother_name',
      //   'diocese': 'diocese',
      //   'male': 'male',
      //   'female': 'female',
      //   'class': 'class',
      //   'birthday': 'birthday',
      //   'day_of_baptism': 'day_of_baptism',
      //   'day_of_eucharist': 'day_of_eucharist',
      //   'day_of_confirmation': 'day_of_confirmation',
      //   'address': 'address',
      //   'contact': 'contact'
      // };
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${moment().format()}.csv`);
      res.csv(records, true);
    })
    .catch((err) => {
      res.sendError(err);
      log.error('Problem when retreiving data: ', err);
    });
};

module.exports = {
  'WithPagination': WithPagination,
  'countDocument': countDocument,
  'exportData': exportData
};
