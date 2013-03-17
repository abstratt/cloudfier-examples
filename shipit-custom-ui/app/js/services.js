'use strict';

/* Services */

var shipIt = angular.module('shipitServices', []);

shipIt.factory('Issue', function($rootScope, $http) {
  var Issue = function (data) {
      angular.extend(this, data);
  };
  Issue.query = function () {
      return $http.get(cloudfier.apiBase + 'instances/shipit.Issue/').then(function (response) {
          var issues = [];
          angular.forEach(response.data, function(data){
              issues.push(new Issue(data));
          });
          return issues;
      });
  };
  Issue.addComment = function (issue, comment) {
      return $http.post(issue.uri + '/actions/comment', {text: comment}).then(Issue.loadCommentsCallback(issue));  
  };
  Issue.reportIssue = function (summary, description) {
      return $http.post(cloudfier.apiBase + 'actions/shipit.Issue/reportIssue', {description: description, summary: summary, severity: null}).then(function (response) { return response.data; });
  };  
  Issue.addWatcher = function (issue, watcherUri) {
      return $http.post(issue.uri + '/relationships/watchers/', {uri: watcherUri}).then(Issue.loadWatchersCallback(issue));
  };
  Issue.removeWatcher = function (issue, watcherUri) {
      var found;
      angular.forEach(issue.loadedLinks.watchers, function(watcher){
		  if(watcher.uri === watcherUri) {
		      found = watcher.relatedUri;
		  }
	  });
	  if (found) {
	      $http.delete(found).then(Issue.loadWatchersCallback(issue));
	  } else {
	      Issue.loadLinks(issue, 'watchers', Issue.watchersLoaded);
	  }
  };
  Issue.loadLinks = function (issue, linkName, callback) {
      $http.get(issue.links[linkName]).then(function (response) {
              issue.loadedLinks[linkName] = [];
		      angular.forEach(response.data, function(data){
		          issue.loadedLinks[linkName].push(data);
		      });
		      callback && callback(issue);
	      });
  };
  Issue.loadWatchers = function (issue) {
      Issue.loadLinks(issue, 'watchers', Issue.watchersLoaded);
  };
  Issue.loadWatchersCallback = function (issue) {
      return function () {
          Issue.loadWatchers(issue);
      };
  };
  Issue.loadComments = function (issue) {
      Issue.loadLinks(issue, 'comments');
  };  
  Issue.loadCommentsCallback = function (issue) {
      return function () {
          Issue.loadComments(issue);
      };
  };
  
  Issue.watchersLoaded = function (issue) {
      var result = false;
      angular.forEach(issue.loadedLinks.watchers, function(watcher){
		  if(watcher.uri === $rootScope.session.currentUser.uri) {
		      result = true;
		  }
	  });
	  issue.checks.watching = result;
  };
  Issue.get = function (issueUri) {
      return $http.get(issueUri).then(Issue.loadIssueCallback);
  };
  Issue.loadIssueCallback = function (response) {
      var issue = new Issue(response.data);
      issue.loadedLinks = {};
      issue.checks = {};
      Issue.loadComments(issue);
      Issue.loadWatchers(issue);
      return issue;
  };
  
  return Issue;
});

