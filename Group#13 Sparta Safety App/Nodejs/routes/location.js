var safety= require('../model/safety');

exports.groupByLocation=function(req,res){
		  safety.aggregate([{$group: {_id:"$Location",lat:{$max:"$loc.lat"},lon:{$max:"$loc.lon"},count:{$sum:1}}}] , function(err,doc) {
		
			if (err) throw err;
			var uname=req.params.username;
			console.log(uname);
			data = {result:true, loc:doc};
      res.json(data);
		});
	};

exports.categories=function(req,res){
              safety.distinct("Threat" ,function(err,doc){
                     data={result:true, categories: doc};
                     //console.log(d);
                     //res.writeHead(200,{'Content-Type': 'application/json'});
                     res.json(data);
              });
       };

exports.incidentsByCategory=function(req,res){

              var category_name=req.params.categoryname;
            
              var query = { "Threat" : { $regex: category_name, $options: 'i' } };
              safety.find(query,function(err,doc){
                    console.log(doc)
                    res.json({result:true,incidents:doc}); 
              });         
};

exports.groupByCategory=function(req,res){

   var category_name=req.params.categoryname;
   safety.aggregate([{$match:{Threat:{$regex: category_name, $options: 'i'}}},{$group: {_id:"$Location",lat:{$max:"$loc.lat"},lon:{$max:"$loc.lon"},count:{$sum:1}}}] , function(err,doc) {
    data = {result:true, loc:doc};
      res.json(data);
   });
};

exports.incidentsByLocation=function(req,res){
     
    var location_name=(req.params.locationname).toString();
    console.log(location_name);
    safety.find({"Location" : {$regex : location_name, $options :'i'}}, function(err,docs){    
        console.log(docs);
        res.json({result:true,incidents:docs});         
    }); 
};

exports.incidentbylatlon=function(req,res){
      
    var Tlat= Number(req.params.lat);
    var Tlog = Number(req.params.lon);

    var currentTime= new Date().getHours();
    //var currentTime=5;
    var maxTime=Number(currentTime)+2;
    var minTime= Number(currentTime)-2;
    console.log(currentTime);        
   //  var maxlog=Tlog-0.0015289;
   //  var minlog=Tlog+0.0015289;
   // //For negative value
   //  var minlat=Tlat+0.0015289;
   //  var maxlat=Tlat-0.0015289;
   //  var googleloc = [37.335583,-121.885675];
    var sumSeverity=0;
    var sumCount=0;
    
   //Zone1: 8 am to 3 pm
   //zone 2: 3pm to 10 pm
   //zone 3: 10 pm tp 8 am
   //db.incidents.find( { loc: { $geoWithin: { $centerSphere: [ [ googleloc[1] , googleloc[0] ] , 0.1 / 3959 ] } } } ).pretty();
  
  safety.aggregate([{$match: { loc: { $geoWithin: { $centerSphere: [ [ Tlat,Tlog ] , 0.1 / 3959 ] }} , Hour :{$gte: minTime, $lte: maxTime }} },
    { $group:{ _id: '$Location',lat:{$avg:"$loc.lat"},lon:{$avg:"$loc.lon"},Severity:{$sum:'$Severity'}, count : { $sum : 1}}}], function(err,doc){
    //var currentTime=19;
        for(var i=0;i<doc.length;i++)
        {
        sumSeverity+=doc[i].Severity; 
        sumCount+=doc[i].count;

        }
        var denom=sumCount*5;
        //console.log(denom);
        var percent=(sumSeverity/denom)*100;
        //console.log(percent);

        if(currentTime>8 && currentTime<15)
        {
          console.log("Zone1");
          if(percent<20)
          {percent=25}
        }
        else if(currentTime>15 && currentTime<22)
        {
          console.log("Zone2");
          if(percent<40)
          {percent=35}
        }
        else if(currentTime>22 && currentTime<8)
        {
          console.log("Zone3");
          if(percent<50)
          {percent=55}
        }        
        console.log(sumSeverity+ " "+sumCount);        
        console.log("Percentage : "+ percent);

        res.json({result:"true", percent:percent, data:doc});         
    }); 
};

exports.help=function(req,res){
     
   // var location_name=req.params.location;
    var date= new Date('3,3,2012').toISOString();
    //var date= date(2013,4,1);
    var dt= new Date('4,4,2013').toISOString();
    //var tp= Date.now();
    //tp.setDate('3,3,2012')
    //console.log(date);

   // var timeNow=(new Date()).getHours();
    //console.log(date.get());
    var query = { 'Date' : { '$gte': date, '$lte':dt} };
    safety.aggregate([{$match:{Hour:{$gte:20}, Hour:{$lte:8}}},{$group: {_id:"$Location",count:{$sum:1}}}] , function(err,doc) {
       console.log(doc)
       //var month=doc[3].Date.getMonth() +1;
       //var year= doc[3].Date.getYear();
       res.json(doc);         
       //console.log("YEAR: "+year)
    });
       
    //}); 
};

