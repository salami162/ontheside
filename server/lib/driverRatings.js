var util = require('util');
var querystring = require('querystring');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var readline = require('readline');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));


function Driver (id) {
  this.id = id;
  this.fiveStarsRatings = [];
  this.nonFiveStarsRatings = [];

  this.ratingStats = {
    fiveStarsCount : 0,
    nonFiveStarsCount : 0,
    nonFiveStarsScore : 0,
    nonFiveStarsRatingAvg : 0,
    nonFiveStarsPercentage : 0,
    totalRatingAvg : 0
  };
  return this;
}

Driver.prototype.addRating = function (rating) {
  // for 5 stars
  if (rating.star === 5) {
    this.fiveStarsRatings.push(rating);
    // calculate stats
    this.ratingStats.fiveStarsCount += 1;
  }
  // for non-5 stars
  else {
    this.nonFiveStarsRatings.push(rating);
    // calculate stats
    this.ratingStats.nonFiveStarsCount += 1;
    this.ratingStats.nonFiveStarsScore += rating.star;
    this.ratingStats.nonFiveStarsRatingAvg = this.ratingStats.nonFiveStarsScore / this.ratingStats.nonFiveStarsCount;
  }
  var totalScore = this.ratingStats.nonFiveStarsScore + (this.ratingStats.fiveStarsCount * 5);
  var totalCount = this.ratingStats.nonFiveStarsCount + this.ratingStats.fiveStarsCount;
  this.ratingStats.totalRatingAvg = totalScore / totalCount;
  this.ratingStats.nonFiveStarsPercentage = this.ratingStats.nonFiveStarsCount / totalCount;
  return this;
};

function DriverRating (csvData) {
  if (_(csvData).isEmpty()) {
    return null;
  }
  var arrayData = csvData.split(',');
  var length = arrayData.length;

  this.driverId = parseInt(arrayData[0], 10);
  this.rideNum = parseFloat(arrayData[1], 10);
  this.star = parseInt(arrayData[2], 10);
  
  this.reviews = arrayData.slice(3, length-4).join(',');

  // Boolean value
  this.safety = arrayData[length-4].toLowerCase() == 'true';
  this.navigation = arrayData[length-3].toLowerCase() == 'true';
  this.friendliness = arrayData[length-2].toLowerCase() == 'true';
  this.cleanliness = arrayData[length-1].toLowerCase() == 'true';
}


function DriverRatings () {
  this.headers = {
    'Content-Type' : 'application/json'
  };

  // for local json data file
  this.dataDir = __dirname + '/../data/';
  this.dataFile = this.dataDir + 'driver-ratings.csv';
}

// build a path to the local JSON file
DriverRatings.prototype.getData = function (filters) {
  var requestDfd = _.Deferred();
  var drivers = {};

  fs.readFile(this.dataFile, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    var dataArray = data.replace(/\r\n?/g, '\n').split('\n');
    
    for (i = 1; i < dataArray.length; i ++) {
      var rating = new DriverRating(dataArray[i]);
      if (!null && rating.driverId) {
        var driver = drivers[rating.driverId] || new Driver(rating.driverId);
        driver.addRating(rating);
        drivers[rating.driverId] = driver;
      }
    }

    if (filters) {
      drivers = _(drivers).filter(function (driver) {
        var shallReturn = true;
        if (filters.exists) {
          shallReturn = shallReturn && driver.ratingStats.nonFiveStarsCount > 0;
        }
        if (filters.min) {
          shallReturn = shallReturn && (driver.ratingStats.nonFiveStarsRatingAvg <= filters.min);
        }
        if (shallReturn) {
          return driver;
        }
      });
    }

    requestDfd.resolve( drivers );
  });
  return requestDfd;
};



module.exports = function () {
  return new DriverRatings();
};
