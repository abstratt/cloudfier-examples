'use strict';

/* App Module */

var cloudfier = { 
    uiBase: '/services/ui/demo-cloudfier-examples-shipit/',
    apiBase: '/services/api/demo-cloudfier-examples-shipit/' 
};

angular.module('shipit', ['shipitServices']).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.
	      when('/issues', {templateUrl: 'partials/issue-list.html',   controller: IssueListCtrl}).
	      when('/issues/:issueId', {templateUrl: 'partials/issue-detail.html', controller: IssueDetailCtrl}).
	      otherwise({redirectTo: '/issues'});
}]);