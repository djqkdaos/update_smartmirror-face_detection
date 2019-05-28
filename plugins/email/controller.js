function Email($scope, $http, $interval, emailService) {

	var getEmail = function(){
		emailService.getEvents().then(function () {
			$scope.email = emailService.getEvents();
		}, function (error) {
			console.log(error);
		});
	}

	getEmail();
	$interval(getEmail, config.calendar.refreshInterval * 60000 || 1800000)
}

angular.module('SmartMirror')
    .controller('Email', Email);
