/* eslint-disable camelcase */
const fs = require('fs');

let data = fs.readFileSync('rawData.json');
let records = JSON.parse(data);

const convertDiosece = (diocese) => {
  switch (diocese) {
    case 'GS': return 'Giuse';
    case 'AN': return 'Anna';
    case 'PR': return 'Phêrô';
    case 'NV': return 'Nữ Vương Mân Côi';
    default: return diocese;
  }
};

const formatDate = (dateString) => {
  if (dateString.indexOf('-') > -1) {
    let dateArr = dateString.split('-');

    return dateArr[2] + '-' +
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
  } else if (dateString.indexOf('/') > -1) {
    let dateArr = dateString.split('/');

    return dateArr[2] + '-' +
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
  } else if (dateString.indexOf('.') > -1) {
    let dateArr = dateString.split('.');

    return dateArr[2] + '-' +
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
  }

  return dateString;
};

records.forEach(row => {
  row.diocese = convertDiosece(row.diocese);
  row.birthday = formatDate(row.birthday);
  row.day_of_baptism = formatDate(row.day_of_baptism);
  row.day_of_eucharist = formatDate(row.day_of_eucharist);
  row.day_of_confirmation = formatDate(row.day_of_confirmation);
  row.grades = [];
  row.absents = [];
});

let json = JSON.stringify(records);
fs.writeFileSync('originalData.json', json);
