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

Driver.prototype.calculateWilsonScore = function () {
  var n = this.ratingStats.nonFiveStarsCount + this.ratingStats.fiveStarsCount;
  if (n === 0) {
    this.lowerWilsonScore = 0;
    this.upperWilsonScore = 0;
    return;
  }

  console.log("driver :", this.id , n, this.ratingStats.fiveStarsCount/n, this.ratingStats.totalRatingAvg);

  var z = 1.96, // 95%
      phat = 1.0 * (this.ratingStats.fiveStarsCount) / (n);

  var delta = z * Math.sqrt( (phat*(1-phat) + z*z/(4*n)) / n );

  this.lowerWilsonScore = (phat + z*z/(2*n) - delta) / (1 + z*z/n);
  this.upperWilsonScore = (phat + z*z/(2*n) + delta) / (1 + z*z/n);
  // this.lowerWilsonScore = (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n);

  console.log('driver :', this.id, this.lowerWilsonScore, this.upperWilsonScore);
  console.log("");
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

    _(drivers).each(function (driver) {
      driver.calculateWilsonScore();
    });

    drivers = _(drivers).sortBy(function (driver) {
      return driver.ratingStats.fiveStarsCount + driver.ratingStats.nonFiveStarsCount;
    });



    requestDfd.resolve( drivers );
  });
  return requestDfd;
};

DriverRatings.prototype.simulate = function () {
  console.log("run simulation");
};


module.exports = function () {
  return new DriverRatings();
};
