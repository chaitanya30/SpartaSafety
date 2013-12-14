	var newUser= require('../model/user');
	var safety= require('../model/safety');

exports.register=function(req,res){

		console.log((req.body.details));
		docs=JSON.parse(req.body.details);
		
		newUser.insert(docs, function(err, inserted) {
        if(err) throw err;
        res.json({result:true});

        console.dir("Successfully inserted: " + JSON.stringify(inserted));
	});
};
