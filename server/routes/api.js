var fs = require('fs');
var path = require('path');

function loadFile (filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) === 'undefined') {
      encoding = 'utf8';
    }

		// read file synchroneously
		var contents = fs.readFileSync(filename, encoding);
		// parse contents as JSON
		return JSON.parse(contents);

	} catch (err) {
		// an error occurred
		throw err;
	}
} // loadJSONfile


exports.clientGraph = function (req, res) {
  console.log('routs find');
  res.partial('clientGraph', {title : 'new title'});
};

