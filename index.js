var http = require('http');
//var app = require('express')(); //var io = require('socket.io')(http.Server(app));
var xml2js = require('xml2js');
var libxmljs = require('libxmljs');
var parser = new xml2js.Parser();

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
	io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
*/

// error message in case ding servers a down:
var errormsg = {
    line: '&nbsp;',
    direction: 'DING Server not reachable',
    countdown: '&nbsp;',
    timetable: '&nbsp;',
    realtime: '0'
};

var id = 1240;

var options = {
    host: 'www.ding.eu',
    path: '/ding2/XML_DM_REQUEST?laguage=de&typeInfo_dm=stopID&nameInfo_dm=900'
	+ id + '&deleteAssignedStops_dm=1&useRealtime=1&mode=direct'
};

callback = function(response) {
    var data = '';

    response.on('data', function(chunk) {
	data += chunk;
    });

    response.on('end', function() {
	var xml = libxmljs.parseXmlString(data);

	var info = {};
	info.stopid = id;
	info.stopname = xml.get('/itdRequest/itdDepartureMonitorRequest/itdOdv/itdOdvName/odvNameElem').text();
	info.stopplace = xml.get('/itdRequest/itdDepartureMonitorRequest/itdOdv/itdOdvPlace/odvPlaceElem').text();
	info.timestamp = pad(xml.get('/itdRequest/itdDepartureMonitorRequest/itdDateTime/itdTime/@hour').value())
	    + ':' + pad(xml.get('/itdRequest/itdDepartureMonitorRequest/itdDateTime/itdTime/@minute').value());

	var departures = [];

	var dep = xml.get('/itdRequest/itdDepartureMonitorRequest/itdDepartureList/itdDeparture');
	while (dep != null) {
	    var tmp = {};

	    if (dep.get('./itdRTDateTime/itdTime')) {
		tmp.timetable = pad(dep.get('./itdRTDateTime/itdTime/@hour').value())
		    + ':' + pad(dep.get('./itdRTDateTime/itdTime/@minute').value());
	    } else {
		tmp.timetable = pad(dep.get('./itdDateTime/itdTime/@hour').value())
		    + ':' + pad(dep.get('./itdDateTime/itdTime/@minute').value());
	    }

	    tmp.line = dep.get('./itdServingLine/@number').value();
	    tmp.direction = dep.get('./itdServingLine/@direction').value();
	    tmp.realtime = dep.get('./itdServingLine/@realtime').value();
	    tmp.countdown = dep.get('./@countdown').value();
	    tmp.platform = dep.get('./@platform').value();

	    if (dep.get('./itdServingLine/itdNoTrain/@delay'))
		tmp.delay = dep.get('./itdServingLine/itdNoTrain/@delay').value();

	    departures.push(tmp);
	    dep = dep.nextElement();
	}

	if (departures.length == 0) {
	    departures.push({
		line: '&nbsp;',
		direction: 'no Departures found',
		countdown: '&nbsp;',
		timetable: '&nbsp;',
		realtime: '0'
	    });
	}

	departures.sort(function(a, b) {
	    return b.countdown - b.countdown;
	});

	console.log(JSON.stringify({
	    info: info,
	    departures: departures
	}, null, 2));
    });
};

http.request(options, callback).end();

function pad(n) {
    return ('00' + n).slice(-2);
}
