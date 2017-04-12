'use strict';

module.exports = function(items, exlist, key, done) {
  const exclusions = exlist.map((obj) => {
    if (obj[key]) {
      return obj[key];
    }
    return null;
  });

  const filteredList = [];
  items.forEach((item) => {
    if (item[key] && exclusions.indexOf(item[key]) !== -1) {
      return;
    }

    filteredList.push(item);
  });
  done(null, filteredList);
};
