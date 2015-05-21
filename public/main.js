var departureMonitor = angular.module('departureMonitor', ['ngAnimate'])

// http://justinklemm.com/angularjs-filter-ordering-objects-ngrepeat/
.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
	var filtered = [];
	    angular.forEach(items, function(item) {
		filtered.push(item);
	    });
	    filtered.sort(function(a, b) {
		return (a[field] > b[field] ? 1 : -1);
	    });
	if (reverse)
	    filtered.reverse();

	return filtered;
    };
})

// http://www.interaktionsdesigner.de/2013/die-killerapplikation-mit-node.js-socket.io-und-angularjs/
.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
	on: function(eventName, callback) {
	    socket.on(eventName, function() {
		var args = arguments;
		$rootScope.$apply(function() {
		    callback.apply(socket, args);
		});
	    });
	},
	emit: function(eventName, data, callback) {
	    if(typeof data == 'function') {
		callback = data;
		data = {};
	    }
	    socket.emit(eventName, data, function() {
		var args = arguments;
		$rootScope.$apply(function() {
		    if(callback) {
			callback.apply(socket, args);
		    }
		});
	    });
	},
	emitAndListen: function(eventName, data, callback) {
	    this.emit(eventName, data, callback);
	    this.on(eventName, callback);
	}
    };
})

.controller('DepartureMonitorController', function ($scope, socket) {
    $scope.stopname = 'departureMonitor';
    $scope.disruptionFeed = '';
    $scope.departures = {};

    socket.on('departures', function(data) {
	$scope.stopname = data.info.stopname;
	$scope.timestamp = data.info.timestamp;

	data.departures.splice(0,5).forEach(function(departure) {
	    var hash = departure.key;

	    // strip additional direction information
	    departure.direction = departure.direction.replace(/ \(.*\)/, '');

	    // create departure entry if it doesn't exist yet
	    if (!$scope.departures[hash])
		$scope.departures[hash] = departure;

	    $scope.departures[hash].countdown = parseInt(departure.countdown);
	    $scope.departures[hash].updated = true;

	    // update departure information
	    if (departure.realtime == "1" && departure.delay > 0) {
		$scope.departures[hash].minutes = departure.countdown;
		$scope.departures[hash].hour = '(+' + departure.delay + ')';
	    } else if (departure.countdown > 25) {
		$scope.departures[hash].minutes = departure.timetable.substr(3);
		$scope.departures[hash].hour = departure.timetable.substr(0, 3);
	    } else {
		$scope.departures[hash].minutes = departure.countdown;
		$scope.departures[hash].hour = '';
	    }
	});

	angular.forEach($scope.departures, function(departure, hash) {
	    if (!departure.updated)
		delete $scope.departures[hash];
	    else
		departure.updated = false;
	});
    });

    socket.on('disruption', function(notice) {
	$scope.disruptionFeed = notice;
    });
});
