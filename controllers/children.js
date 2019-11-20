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
      res.sendError(err);
      log.error(err);
    });
};

const search = (req, res) => {
  const searchQuery = `.*${req.query.search}.*`;

  return Children
    .find({
      $and: [
        {
          $or: [
            { firstname: { $regex: searchQuery} },
            { lastname: { $regex: searchQuery} },
            { father_name: { $regex: searchQuery} },
            { mother_name: { $regex: searchQuery} },
            { diocese: { $regex: searchQuery} },
            { adress: { $regex: searchQuery} },
            { contact: { $regex: searchQuery} },
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
  'search': search
};
