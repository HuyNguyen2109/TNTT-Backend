const fs = require('fs');
const csv = require('csv-parser');
const log = require('log4js').getLogger();

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
      // eslint-disable-next-line arrow-body-style
      const values = records.map(o => Object.values(o).join(';')).join('\n');
      csv += headers + '\n' + values;
      res.setHeader('Content-Type', 'text/csv');
      res.sendSuccess(resultDto.success(messageCodes.I001, csv));
    })
    .catch((err) => {
      res.sendError(err);
      log.error('Problem when retreiving data: ', err);
    });
};

const restoreData = (req, res) => {
  const restoredFile = req.files[0];
  const filePath = restoredFile.path;
  let results = [];
  fs.createReadStream(filePath)
    .pipe(csv({ 'separator': ';' }))
    // eslint-disable-next-line arrow-body-style
    .on('data', (data) => results.push(data))
    .on('end', () => {
      Children
        .deleteMany({})
        .then(o => {
          log.info(o);
        })
        .then(() => {
          Children.
            insertMany(results);
        })
        .then(result => {
          log.info(result);
          res.sendSuccess(resultDto.success(messageCodes.I001));
        })
        .then(() => {
          fs.unlinkSync(filePath);
        })
        .catch(err => {
          log.error(err);
          res.sendError(err);
        });
    });
};

const deleteByNames = (req, res) => {
  const childrenNames = req.query.names;

  return Children
    .deleteMany({ 'name': { '$in': childrenNames } })
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getByName = (req, res) => {
  const childredNames = req.params.name;

  return Children
    .find({ 'name': childredNames })
    .then(o => {
      res.sendSuccess(resultDto.success(messageCodes.I001, o));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const updateByName = (req, res) => {
  const childredNames = req.params.name;
  const updatedData = {
    'name': req.body.name,
    'father_name': req.body.father_name,
    'mother_name': req.body.mother_name,
    'diocese': req.body.diocese,
    'male': req.body.male,
    'female': req.body.female,
    'class': req.body.class,
    'birthday': req.body.birthday,
    'day_of_baptism': req.body.day_of_baptism,
    'day_of_eucharist': req.body.day_of_eucharist,
    'day_of_confirmation': req.body.day_of_confirmation,
    'address': req.body.address,
    'contact': req.body.contact
  };

  return Children
    .findOneAndUpdate({ 'name': childredNames }, { '$set': updatedData })
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const createNew = (req, res) => {
  const newData = {
    'name': req.body.name,
    'father_name': req.body.father_name,
    'mother_name': req.body.mother_name,
    'diocese': req.body.diocese,
    'male': req.body.male,
    'female': req.body.female,
    'class': req.body.class,
    'birthday': req.body.birthday,
    'day_of_baptism': req.body.day_of_baptism,
    'day_of_eucharist': req.body.day_of_eucharist,
    'day_of_confirmation': req.body.day_of_confirmation,
    'address': req.body.address,
    'contact': req.body.contact
  };

  return Children
    .create(newData)
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getGradeByName = (req, res) => {
  const childredNames = req.params.name;

  return Children
    .find({ 'name': childredNames })
    .then(o => {
      const grades = o[0].grades;
      res.sendSuccess(resultDto.success(messageCodes.I001, grades));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const addGradeByName = (req, res) => {
  const childredNames = req.params.name;
  const gradeData = {
    'key': req.body.key,
    'title': req.body.title,
    'point': req.body.point,
    'type': req.body.type
  };

  return Children
    .updateOne({ 'name': childredNames }, {
      '$push': {
        'grades': gradeData
      }
    })
    .then((o) => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const updateGradeByName = (req, res) => {
  const childredNames = req.params.name;
  const gradeData = {
    'key': req.body.key,
    'title': req.body.title,
    'point': req.body.point,
    'type': req.body.type
  };

  return Children
    .updateOne({ 'name': childredNames, 'grades.key': gradeData.key }, {
      '$set': { 'grades.$' : gradeData }
    })
    .then((o) => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const deleteGradeByName = (req, res) => {
  const childredNames = req.params.name;
  const gradeData = {
    'key': req.body.key,
    'title': req.body.title,
    'point': req.body.point,
    'type': req.body.type
  };
  console.log(gradeData);

  return Children
    .updateOne({ 'name': childredNames}, {
      '$pull': {
        'grades': gradeData
      }
    })
    .then((o) => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

module.exports = {
  'WithPagination': WithPagination,
  'countDocument': countDocument,
  'exportData': exportData,
  'restoreData': restoreData,
  'deleteByNames': deleteByNames,
  'getByName': getByName,
  'updateByName': updateByName,
  'createNew': createNew,
  'getGradeByName': getGradeByName,
  'addGradeByName': addGradeByName,
  'updateGradeByName': updateGradeByName,
  'deleteGradeByName': deleteGradeByName
};
