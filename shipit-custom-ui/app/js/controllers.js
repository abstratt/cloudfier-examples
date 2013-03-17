'use strict';

/* Controllers */

function IssueListCtrl($scope, Issue) {
  $scope.issues = Issue.query();
}

function IssueDetailCtrl($scope, $route, Issue) {
  var issueUri = $route.current.params.uri;
  $scope.issue = Issue.get(issueUri);
  $scope.startWatching = function (issue) {
      Issue.addWatcher(issue, $scope.session.currentUser.uri);
  };
  $scope.stopWatching = function (issue) {
      Issue.removeWatcher(issue, $scope.session.currentUser.uri);      
  };  
}

function NewIssueController($scope, Issue, $location) {
  $scope.newIssue = function (summary, comment) {
      Issue.reportIssue(summary, comment).then(function () {
          $location.path('/issues');
      }, function () {
          $scope.error = "An error has occurred, issue not reported";
      });
  };
}

function CommentController($scope, Issue) {
  $scope.addComment = function (issue, comment) {
      Issue.addComment(issue, comment).then(function () {
          $scope.commentText = '';
      }, function () {
          $scope.commentError = "An error has occurred, comment not recorded";
      });
  };
}

function LoginController($scope, $http, $rootScope, $route) {
    $http.get(cloudfier.apiBase)
        .success(function (data) {
	        $rootScope.session = {};
	        $rootScope.session.loggedIn = true;
	        $rootScope.session.currentUser = data.currentUser; 
	    })
	    .error(function () { 
	        $rootScope.session = {};         
	    });
	$rootScope.logout = function () {
	    var reload = function () {
	        $rootScope.login();
	    };
	    $http.get(cloudfier.apiBase + "logout").success(reload).error(reload);
	};
	$rootScope.login = function () {
	    var newLocation = window.location.origin + cloudfier.uiBase + 'root/source/?source=' + encodeURIComponent(window.location);
	    window.location = newLocation;
	};
}