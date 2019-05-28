(function () {
	'use strict';

	function emailService($window, $http, $q) {
		var service = {};

		service.events = [];




		}






		service.getEvents = function () {
			return service.events;
		}




		return service;
	}

	angular.module('SmartMirror')
    .factory('emailService', emailService);
} ());
