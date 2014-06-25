var departureMonitor = angular.module('departureMonitor', [])

.controller('DepartureMonitorController', function ($scope, $timeout, $http) {
	$scope.stopname = 'departureMonitor';
	$scope.departures = [];

	$scope.onTimeout = function() {
		$scope.date = new Date();

		$http.get('http://127.0.0.1:9000').then(function(res) {
			$scope.stopname = res.data.info.stopname;
			$scope.departures = res.data.departures;
		});

		$timeout($scope.onTimeout, 60 * 1000);
	}
	$scope.onTimeout();
});
