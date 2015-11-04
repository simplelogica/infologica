'use strict';

var mongoose = require('mongoose'),
    NetworkData  = mongoose.model('NetworkData');

//GET - Return all the NetworkData available in the DB
exports.index = function(req, res) {
  // Read possible variables from
  var limit = parseInt(req.query.limit),
      last = req.query.last;

  var searchParams = {};

  // If there is a last id, filter the results
  if (last !== undefined) {
    searchParams._id = {$gt : last};
  }

  // Perform the search
  var q = NetworkData.find(searchParams).sort({'createdAt': -1});

  // Apply limit (if received)
  if (limit > 0) {
    q = q.limit(limit);
  }

  // Execute the query
  q.exec(function(err, users) {
    if(err) { res.send(500, err.message); }
    res.status(200).jsonp(users);
  });
};

//GET - Return a specific NetworkData from the DB
exports.show = function(req, res) {
  NetworkData.findById(req.params.id, function(err, user) {
    if(err) { return res.send(500, err.message); }
    res.status(200).jsonp(user);
  });
};
