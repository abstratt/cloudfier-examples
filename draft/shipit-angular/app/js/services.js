'use strict';

/* Services */

angular.module('shipitServices', ['ngResource']).
    factory('Issue', function($resource){
  return $resource('/services/api/demo-cloudfier-examples-shipit/instances/shipit.Issue/', {}, {
    query: {method:'GET', params:{}, isArray:true}
  });
});