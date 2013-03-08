'use strict';

/* App Module */

angular.module('shipit', ['shipitServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/issues', {templateUrl: 'partials/issue-list.html',   controller: IssueListCtrl}).
      when('/issues/:issueId', {templateUrl: 'partials/issue-detail.html', controller: IssueDetailCtrl}).
      otherwise({redirectTo: '/issues'});
}]);