// server.js

var	$ = require('jquery');

$(function(){

	var	express = require('express'),
		routes = require('./routes'),
		mongo = require('mongoose');

	mongo.connect('mongodb://localhost/SampleApp');

	var	app = module.exports = express(),
		chat = new mongo.Schema({
			text: {type: String},
			created: {type: Date, default: Date.now}
		});

		mongo.model("chat", chat);
		chat = mongo.model("chat");


	app.configure(function(){
		app.set('port', process.env.PORT || 3001);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.use(express.logger());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function(){
		app.use(express.errorHandler());
	});

	app.get('/', routes.index);

	var	server = app.listen(app.get("port"), function(){
		console.log("Express server listening on port " + app.get("port"));
	});

	var	io = require('socket.io').listen(server);
	io.sockets.on('connection', function(socket){

		socket.on('connect', function(msg){
			socket.broadcast.emit("message", msg);

			chat.find({}, function(err, data){
				for(var i=0; i<data.length; i++){
					socket.emit("message", data[i].text);
				}
			});
		});

		socket.on('message', function(message){
			new chat({text: message}).save();
			socket.emit("message", message);
			socket.broadcast.emit("message", message);
		});

		socket.on('disconnect', function(msg){
			socket.broadcast.emit("message", msg);
		});

	});

});

