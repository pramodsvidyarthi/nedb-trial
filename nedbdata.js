var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var api = express();
var Datastore = require('nedb')
  , db = {};

// for sending the json results
api.use(bodyParser({ extended: false }));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({
	extended:false
}));

//file paths
api.use(express.static(path.join(__dirname)));

//creating a new database
db.tasks = new Datastore({
  filename:'db/database',
  autoload:true 
});


//mentioning the routes for http action methods (get,post,put,delete)

//get all tasks
api.get('/tasks',function (req, res) {
	db.tasks.find({},function (err, data) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(data));
		}
	})
});


//get one task with particular id.
api.get('/tasks/:id',function (req, res) {
	var num = parseInt(req.params.id);
	db.tasks.find({
		id:num
	},function (err, data) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(data));
		}
	})
});


//post data i.e tasks into the array. Can add in bulk by giving an array itself.
api.post('/tasks',function (req, res) {
	db.tasks.insert(req.body,function (err, data) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(data));
		}
	});
});

//update a task based on the id.
api.put('/tasks/:id',function (req, res) {
	var num = parseInt(req.params.id);
	var content = req.body;
	db.tasks.update({
		id:num
	},{
		$set:content
	},function (err, numreplaced) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(numreplaced)+"record replaced successfully");
		}
	})
});


// api.put('/bulkedit',function (req, res) {
// 		var ids = req.body.ids;
// 		var content = req.body.content;
// 			res.send(ids);
// });


//delete tasks based on id.(delete one item)
api.delete('/tasks/:id',function (req, res) {
	var num = parseInt(req.params.id);
	db.tasks.remove({
		id:num
	},{},function (err, numremoved) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(numremoved)+"record removed successfully");
		}
	});
});


//delete all tasks. multi:true has to be set to remove all records matching the query.
//query the first arg here says all so removes all records
api.delete('/tasks',function (req, res) {
	var num = parseInt(req.params.id);
	db.tasks.remove({},{ multi:true },function (err, numremoved) {
		if(err){
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(numremoved)+"record removed successfully");
		}
	});
});


api.listen(3005,function () {
	console.log('nedb restapi running');
});