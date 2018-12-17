// for use with Node-style callbacks...
var async = require("async");
var mysql = require("mysql");

var hugeArray = [141,142,144];

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test'
});

db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
	saveSomething();
});



function saveSomething() {
	async.eachSeries(hugeArray, function iterator(item,callback) {
		
		console.log(item);
		var post  = {id: item,name:"test"+item};
		var detail  = {detail:"detail"+item};
		
		async.waterfall([
		  function (done) {
			console.log(post);
			db.query('INSERT INTO user SET ?', post, function(err,res){
				if(err){ 
					done(err,res);
				} else{ 
					done(null,res);
				}
			});
		  },
		  function (previousResult, done) {
			console.log(previousResult);
			console.log(detail);
			db.query('INSERT INTO detail SET ?', detail, function(err,res){
				if(err){ 
					done(err,res);
				} else{ 
					done(null,res);
				}
			});
		  },
		  function (previousResult, done) {
			console.log(previousResult);
			console.log(done);
			done(null);
		  }
		],callback);
		
	}, function (err) {
		if (err) {
			console.log('error happened, operation failed!');
		} else {
			console.log('No error happened in any steps, operation done!');
		}
	});
} 