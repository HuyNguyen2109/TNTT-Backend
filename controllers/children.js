const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Children = require('../models/children');

const WithPagination = (req, res) => {
  const itemPerPage = parseInt(req.query.itemPerPage);
  const page = Math.max(0, parseInt(req.params.page));
  const classes = req.query.class;

  return Children
    .find((classes === 'all')? {} : {'class': classes})
    .limit(itemPerPage)
    .skip(itemPerPage * (page))
    .lean()
    .then((records) => {
      if(!records) {
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
    .countDocuments((condition === 'all')? {}: {'class': condition})
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      res.sendError(err)
      log.error(err);
    })
}

module.exports = {
  'WithPagination': WithPagination,
  'countDocument': countDocument
};
