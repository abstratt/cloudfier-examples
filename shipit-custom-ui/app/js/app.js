'use strict';

/* App Module */

var cloudfier = { 
    uiBase: '/services/ui/demo-cloudfier-examples-shipit-plus/',
    apiBase: '/services/api/demo-cloudfier-examples-shipit-plus/' 
};

angular.module('shipit', ['shipitServices'], function ($routeProvider, $locationProvider, $httpProvider) {

    var interceptor = ['$rootScope', '$q', function (scope, $q) {

        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if (status == 401) {
                var deferred = $q.defer();
                var req = {
                    config:response.config,
                    deferred:deferred
                }
                window.location = window.location.origin + cloudfier.uiBase + 'root/source/?source=' + encodeURIComponent(window.location);
            }
            // otherwise
            return $q.reject(response);

        }

        return function (promise) {
            return promise.then(success, error);
        }

    }];
    $httpProvider.responseInterceptors.push(interceptor);
}).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.
	      when('/issues', {templateUrl: 'partials/issue-list.html',   controller: IssueListCtrl}).
	      when('/issue', {templateUrl: 'partials/issue-detail.html', controller: IssueDetailCtrl}).
	      when('/new-issue', {templateUrl: 'partials/new-issue.html', controller: NewIssueController}).
	      otherwise({redirectTo: '/issues'});
}]);