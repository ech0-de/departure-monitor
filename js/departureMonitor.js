var departureMonitor = angular.module('departureMonitor', [])

.controller('DepartureMonitorController', function ($scope, $timeout, $http) {
	$scope.stopname = 'departureMonitor';
	$scope.departures = [];

	// reload page every hour (auto update)
	$timeout(function() {
		location.reload();
	}, 60 * 60 * 1000);

	$scope.onTimeout = function() {
		$http.get('http://127.0.0.1:9000').then(function(res) {
			$scope.stopname = res.data.info.stopname;
			$scope.timestamp = res.data.info.timestamp;
			$scope.departures = res.data.departures.splice(0,5);

			for (var i = 0; $scope.departures.length; i++) {
				if ($scope.departures[i].realtime == "1") {
					$scope.departures[i].icon = false;
					if ($scope.departures[i].delay > 0) {
						$scope.departures[i].countdown = " (+" + $scope.departures[i].delay + ")" + $scope.departures[i].countdown;
					}
				} else {
					$scope.departures[i].icon = "schedule";
				}
			}

			while ($scope.departures.length < 6) {
				$scope.departures.unshift({
					countdown: "",
					direction: "",
					icon: false,
					line: "",
				});
			}
		});

		$timeout($scope.onTimeout, 16 * 1000);
	}
	$scope.onTimeout();
});
