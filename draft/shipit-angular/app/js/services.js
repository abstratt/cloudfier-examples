'use strict';

/* Services */

var shipIt = angular.module('shipitServices', []);

shipIt.factory('Issue', function($rootScope, $http) {
  var Issue = {};
  Issue.query = function () {
      return $http.get(cloudfier.apiBase + 'instances/shipit.Issue/').then(function (response) {
          var issues = [];
          angular.forEach(response.data, function(data){
              issues.push(data);
          });
          return issues;
      });
  };
  Issue.get = function (issueUri) {
      return $http.get(issueUri).then(function (response) {
          var issue = response.data;
          issue.loadedLinks = {};
          if (issue.values.commentCount > 0) {
	          $http.get(issue.links.comments).then(function (response) {
	              issue.loadedLinks.comments = [];
			      angular.forEach(response.data, function(data){
			          issue.loadedLinks.comments.push(data);
			      });
		      });
		  } else {
		      issue.loadedLinks.comments = [];
		  }
          return issue;
      });
  };
  return Issue;
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