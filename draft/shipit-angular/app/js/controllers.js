'use strict';

/* Controllers */

function IssueListCtrl($scope, Issue) {
  $scope.issues = Issue.query();
}

function IssueDetailCtrl($scope, $routeParams, Issue) {
  $scope.issue = Issue.get($routeParams.issueId, function(issue) {
    //$scope.mainImageUrl = phone.images[0];
  });

}
