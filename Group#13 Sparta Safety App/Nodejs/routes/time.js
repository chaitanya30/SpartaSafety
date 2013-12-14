var safety= require('../model/safety');

exports.dateRange=function(req,res){

		var maxDate, minDate;
		safety.find({},{Date:1,_id:0}).sort({"Date":-1}).limit(1).exec( function(err,doc){
			//console.log(doc);
      maxDate=doc[0].Date;			
		});
		safety.find({},{Date:1,_id:0}).sort({"Date":1}).limit(1).exec(function(err,doc){
			minDate=doc[0].Date
			data={result:true, startDate:minDate, endDate: maxDate}
			console.log(data);
			//res.writeHead(200,{'Content-Type': 'application/json'});
			res.json(data);
		});
	};



exports.groupByTime=function(req,res){
   var gtime=Number(req.params.time);
   console.log('Time: ' + gtime);
    safety.aggregate([{$match:{Hour:gtime}},{$group: {_id:"$Location",lat:{$max:"$loc.lat"},lon:{$max:"$loc.lon"},count:{$sum:1}}}] , 
    function(err,doc) {
    var data={result:true,loc:doc }
    res.json(data);
    console.log(data);
   });
};

exports.groupByMonth=function(req,res){
  var gmonth=Number(req.params.month);
  var gyear=Number(req.params.year);
  var startDate = new Date(gyear,gmonth,1);
  var endDate = new Date(gyear,gmonth,1);
  endDate.setMonth(endDate.getMonth() + 1);
  console.log("Start Date: "+ startDate);
  console.log("End Date: " + endDate);
   safety.aggregate([{$match: {Date: { $gte : startDate, $lt : endDate} }},
    { $group:{ _id: '$Location' , lat: { $max : '$loc.lat' }, lon: { $max : '$loc.lon' }, count : { $sum : 1}}}], 
  //safety.find({ 'Date' : { '$gte': startDate, '$lte':endDate} },
    function(err,doc){
   //safety.aggregate([{$match:{ 'Date' : { '$gte': startDate, '$lte':endDate}}},{$group: {_id:"$Location",lat:{$max:"$lat"},lon:{$max:"$lon"},count:{$sum:1}}}] , function(err,doc) {
    var data={result:true,loc:doc }
    res.json(data);
   });

};

exports.incidentsByMonth=function(req,res){
		
	var gmonth=Number(req.params.month);
  var gyear=Number(req.params.year);
  var startDate = new Date(gyear,gmonth,1);
  var endDate = new Date(gyear,gmonth,1);
  endDate.setMonth(endDate.getMonth() + 1);
  console.log("Start Date: "+ startDate);
  console.log("End Date: " + endDate);
  safety.find({ 'Date' : { '$gte': startDate, '$lt':endDate} },function(err,doc){
    res.json({result:true,incidents:doc}) ;
  });
};

exports.incidentsByTime=function(req,res){

    var mintime = req.params.time;
    mintime=Number(mintime);  
    safety.find({'Hour' : mintime}, function(err,docs){   
      console.log(docs);       
        res.json({result:true,incidents:docs});         
    }); 
};


exports.report=function(req,res){

	        // Get our form values. These rely on the "name" attributes
        var data = JSON.parse(req.body.details);
        //console.log(data);
        // Submit to the DB
        console.log(data.Severity);
        console.log(data.loc.lat);
        console.log(data.loc.lon);

        var templat=data.loc.lat;
        var templon=data.loc.lon;
        

safety.find({"loc.lat":templat,"loc.lon":templon},{"Location":1,_id:0},function(err,doc){
  location=doc[0].Location;

    data.Location=doc[0].Location;
})

safety.insert(data,function(err,doc){
        res.json(doc);        
});
//safety.findOne({ loc: { $near: { $geometry:{type:"Point", coordinates: [templon,templat]}}}}, function(err,doc){
//  safety.findOne( { loc :
//                          { $near :
//                             { $geometry :
//                                 { type : "Point" ,
//                                   coordinates : [ templon,templat ] } }
//                               //,$maxDistance : 200
//                       } } ,function(err,doc){
// // //var data={"Location":location,"Date":details.Date,"flag":details. }
//console.log(doc);
 //safety.insert(), function(err,doc){

   		      //res.json(doc);
              };
