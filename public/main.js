var departureMonitor = angular.module('departureMonitor', [])

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
    $scope.departures = [];

    socket.on('departures', function(data) {
	$scope.stopname = data.info.stopname;
	$scope.timestamp = data.info.timestamp;
	$scope.departures = data.departures.splice(0,5);

	for (var i = 0; $scope.departures.length; i++) {
	    if ($scope.departures[i].realtime == "1") {
		if ($scope.departures[i].delay > 0) {
		    $scope.departures[i].countdown = " (+" + $scope.departures[i].delay + ")" + $scope.departures[i].countdown;
		}
	    }
	    if ($scope.departures[i].countdown > 25) {
		$scope.departures[i].countdown = $scope.departures[i].timetable;
	    }
	}
    });
});
