var departureMonitor = angular.module('departureMonitor', [])

.controller('DepartureMonitorController', function ($scope, $timeout, $http) {
	$scope.stopname = 'departureMonitor';
	$scope.departures = [];

	$scope.onTimeout = function() {
		$http.get('http://127.0.0.1:9000').then(function(res) {
			$scope.stopname = res.data.info.stopname;
			$scope.timestamp = res.data.info.timestamp;
			$scope.departures = res.data.departures;
		});

		$timeout($scope.onTimeout, 30 * 1000);
	}
	$scope.onTimeout();
});
