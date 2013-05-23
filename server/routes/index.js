var _ = require('underscore');


exports.index = function (req, res) {
  var data = {
    title : 'Limin Shen'
  };
  res.render('index', data);
};


