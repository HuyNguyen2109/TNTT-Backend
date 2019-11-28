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
      records.forEach(o => {
        o.contact = o.contact.replace('&#10;', '-');
      });
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
      records.forEach(o => {
        delete o._id;
        o.contact = o.contact.replace('&#10;', '-');
        o.address = '"' + o.address + '"';
        o.contact = '"' + o.contact + '"';
      });
      let csv = '';
      const headers = Object.keys(records[0]).join(';');
      const values = records.map(o => {
        Object.values(o).join(';');
      }).join('\n');
      csv += headers + '\n' + values;
      res.setHeader('Content-Type', 'text/csv');
      res.sendSuccess(resultDto.success(messageCodes.I001, csv));
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
