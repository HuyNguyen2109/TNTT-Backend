const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Children = require('../models/children');

const capitalizeWord = (text) => {
  var splitStr = text.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

const WithPagination = (req, res) => {
  const itemPerPage = parseInt(req.query.itemPerPage);
  const page = Math.max(0, parseInt(req.params.page));
  const classes = req.query.class;

  return Children
    .find((classes === 'all') ? {} : { 'class': classes })
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

const findAll = (req, res) => {
  const classes = req.query.class;

  return Children
    .find((classes === 'all') ? {} : { 'class': classes })
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      res.sendError(err);
      log.error(err);
    });
}

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

const search = (req, res) => {
  const searchQueryUpperCase = req.query.search.toUpperCase();
  const searchQueryLowerCase = req.query.search.toLowerCase();
  const searchQueryCapitalize = capitalizeWord(req.query.search);
  return Children
    .find({
      $and: [
        {
          $or: [
            { name: { $regex: searchQueryUpperCase } },
            { name: { $regex: searchQueryLowerCase } },
            { name: { $regex: searchQueryCapitalize } },
          ]
        }
      ]
    })
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      res.sendError(err);
      log.error(err);
    });
}

module.exports = {
  'WithPagination': WithPagination,
  'countDocument': countDocument,
  'search': search,
  'findAll': findAll
};
