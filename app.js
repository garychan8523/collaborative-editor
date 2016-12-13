var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

//var app = express();

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server)
var fs = require('fs');

server.listen(3000);
console.log('server listen on 3000.');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// collab

app.use(function(req, res) {
	fs.readFile(__dirname + '/' + roomid ,
  //fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('500: Error loading document');
    }
    res.writeHead(200);
    res.end(data);
  });
});

var rooms = [];
var content = [];

io.sockets.on('connection', function (socket) {
	//socket.emit('refresh', {body: content[0]})
	socket.on('getroom', function (){
		do{
		var ranroom = "";
    	var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    	for( var i=0; i < 5; i++ ){
        	ranroom += possible.charAt(Math.floor(Math.random() * possible.length));}
    }while(rooms.indexOf(ranroom)>=0);

    roomid = ranroom;
    socket.join(roomid);
		socket.room = roomid;
		rooms.push(roomid);

    message = "you are in room '" + roomid + "' now";
    message += '\n\nstart editing with your friends by this url';
    message += '\ncl.dedd.ca/' + roomid;
    content[rooms.indexOf(roomid)] = message;

    socket.emit('updateroomname', {roomname: roomid});
    io.to(socket.room).emit('refresh', {body: content[rooms.indexOf(roomid)]});
	});

	socket.on('joinroom', function (roomid) {
		socket.join(roomid);
		socket.room = roomid;
		if(rooms.indexOf(roomid) < 0)
		{
			//console.log('rooms.indexOf(roomid): ' + rooms.indexOf(roomid));
			//console.log('rooms array: ' + rooms);
			//console.log('content array: ' + content);
			//console.log('room ' + roomid + ' not found, initialize content...');
    		rooms.push(roomid);
    		message = "you are in room '" + roomid + "' now";
    		message += '\n\nstart editing with your friends by this url';
    		message += '\ncl.dedd.ca/' + roomid;
    		//message += '\nroom index ' + rooms.indexOf(roomid);
    		content[rooms.indexOf(roomid)] = message;
    		//console.log('roomid: ' + roomid + ' emitting to content[' + rooms.indexOf(roomid) + ']');
    		io.to(socket.room).emit('refresh', {body: content[rooms.indexOf(roomid)]});
    	}
    	else
    	{
    		//console.log('rooms.indexOf(roomid): ' + rooms.indexOf(roomid));
    		//console.log('rooms array: ' + rooms);
			//console.log('content array: ' + content);
    		//console.log('room ' + roomid + ' found with index ' + rooms.indexOf(roomid) + ', updating content...');
    		//console.log('room content is: ' + content[rooms.indexOf(roomid)]);
    		socket.emit('refresh', {body: content[rooms.indexOf(roomid)]});
    	}
	});
	//...

	socket.on('displayroom', function () {
		// roomid = 'adminview';
		// socket.join(roomid);
		// socket.room = roomid;
		var message = '';
		if(rooms.length){
			message = 'There are total of ' + rooms.length + ' room(s).' + '\n\n';
		}else{
			message = 'There are no room.';
		}

		for (var i = 0, len = rooms.length; i < len; i++) {
			socket.join(rooms[i]);
			message += 'id: ' + i + '\n';
  			message += 'rooms[' + i + ']: ' + rooms[i] + '\n';
  			message += 'content[' + i + ']: ' + content[i] + '\n';
  			message += '\n\n';
		}
		socket.emit('refresh', {body: message});
	});

	socket.on('refresh', function (roomid, body_) {
		//console.log('new body');
		//content[rooms.indexOf(roomid)] = body_;
		//content[rooms.indexOf(roomid)] = body_;
		content[rooms.indexOf(roomid)] = body_;
		//body = body_;
	});
  
	socket.on('change', function (op) {
		//console.log(op);
		if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
        	socket.to(socket.room).emit('change', op);
        	//socket.broadcast.emit('change', op);
    	};
	});
});

module.exports = app;
