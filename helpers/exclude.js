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
    if (item[key] && exclusions.includes(item[key])) {
      return;
    }

    filteredList.push(item);
  });

  done(null, filteredList);
};
