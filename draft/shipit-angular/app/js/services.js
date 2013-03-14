'use strict';

/* Services */

var shipIt = angular.module('shipitServices', ['ngResource']);

shipIt.factory('Issue', function($resource, $rootScope) {
  return $resource(cloudfier.apiBase + '/instances/shipit.Issue/', {}, {
    query: {method:'GET', params:{}, isArray:true}
  });
});


/*
shipIt.factory('Session', function($http) {
    var service = {};
    service.logout = function () {
	    var reload = function () {
	        service.login();
	    };
	    $http.get(cloudfier.apiBase + "logout").success(reload).error(reload);
    };
	service.login = function (username, password) {
	    return $http.post("login="+username+"&password="+password);
	};
	return service;
});
*/