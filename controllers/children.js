const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Children = require('../models/children');

const WithPagination = (req, res) => {
  const itemPerPage = parseInt(req.query.itemPerPage);
  const page = Math.max(0, req.params.page);

  return Children
    .find({})
    .limit(itemPerPage)
    .skip(itemPerPage * (page-1))
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

module.exports = {
  'WithPagination': WithPagination
};
