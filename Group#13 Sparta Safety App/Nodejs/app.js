
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var location = require('./routes/location');
var reg = require('./routes/register');
var time=require('./routes/time.js');
var http = require('http');
var path = require('path');
var model= require('./model/safety.js');
var server= http.createServer();
var MongoClient = require('mongodb').MongoClient;

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/register',function(req,res){
	var value=JSON.parse(req.body.details);
	console.log(value);
	MongoClient.connect('mongodb://localhost:27017/272', function(err, db) {
    if(err) throw err;
	    db.collection('user').insert(value,function(err, docs) {
    	if(err) throw err;
		console.log("Inserted");
		res.json({result:true});        
}); }); });

app.get('/:username/help',location.help);

app.get('/:username/daterange',time.dateRange);
app.get('/:username/categories',location.categories);

app.get('/:username/groupByLocation', location.groupByLocation);
app.get('/:username/groupByTime/:time',time.groupByTime);
app.get('/:username/groupByMonth/:month/:year',time.groupByMonth);
app.get('/:username/groupByCategory/:categoryname',location.groupByCategory);

app.get('/:username/incidentsByCategory/:categoryname',location.incidentsByCategory);
app.get('/:username/incidentsByMonth/:month/:year',time.incidentsByMonth);
app.get('/:username/incidentsByTime/:time',time.incidentsByTime);
app.get('/:username/incidentsByLocation/:locationname',location.incidentsByLocation);

app.get('/:username/checkin/:lon/:lat',location.incidentbylatlon);
app.post('/:username/report',time.report);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
