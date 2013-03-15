'use strict';

/* Controllers */

function IssueListCtrl($scope, Issue) {
  $scope.issues = Issue.query();
}

function IssueDetailCtrl($scope, $route, Issue) {
  var issueUri = $route.current.params.uri;
  $scope.issue = Issue.get(issueUri);
}


function LoginController($scope, $http, $rootScope, $route) {
    $http.get(cloudfier.apiBase)
        .success(function (data) {
	        $scope.session = {};
	        $scope.session.loggedIn = true;
	        $scope.session.username = data.currentUser.shorthand || "Guest"; 
	    })
	    .error(function () { 
	        $scope.session = {};         
	    });
	$scope.logout = function () {
	    var reload = function () {
	        $scope.login();
	    };
	    $http.get(cloudfier.apiBase + "logout").success(reload).error(reload);
	};
	$scope.login = function () {
	    var newLocation = window.location.origin + cloudfier.uiBase + 'root/source/?source=' + encodeURIComponent(window.location);
	    window.location = newLocation;
	};
}