var express = require('express');
var router = express.Router();

//var collab = require('./collab.js');

/* GET home page. */
router.get('/', function(req, res) {
  message = 'Welcome to Collaborative Editor';
      statusCode = '@ cl.dedd.ca';
      description = 'Ignite your idea - ';
      res.render('index', { message: message, "error": {"status": statusCode}, "description": description});
});

router.get('/getroom', function(req, res) {
  res.render('getroom');
});

router.get('/display', function(req, res) {
  res.sendfile('./displayroom.html');
});

router.get('/index(\w+)?', function(req, res, next) {
  //res.render('index', { title: 'Collaborative Editor' });
  res.sendfile('./index.html');
});

router.get('/:roomid', function(req, res) {
  	req.params.roomid = req.params.roomid.match(/[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]/);
  	if (req.params.roomid == 'index')
  	{
  		res.sendfile('./index.html');
  	}
  	else if (String(req.params.roomid).length!=5)
    {
    	message = 'Invalid Room ID';
      statusCode = '400 Bad Request (Client Error)';
      description = 'We cant find a room id from the url.';
      res.render('error', { message: message, "error": {"status": statusCode}, "description": description});
    }
  	else
   	{
      dname = req.params.roomid;
      req.params.roomid = "'" + req.params.roomid + "'";
   		res.render('room', { roomname: req.params.roomid, displayname: dname});
    }
});

router.use(function(err, req, res, next) {
	if (err instanceof URIError) {
		err.message = 'Invalid Room ID';
        err.status = err.statusCode = '400 Bad Request (Client Error)';
        err.description = 'We cant find a room id from the url, it probably contained invalid character(s).';
		res.render('error', { message: err.message, "error": {"status": err.statusCode}, "description": err.description});
    }
});


module.exports = router;