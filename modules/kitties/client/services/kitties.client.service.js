// Kitties service used to communicate Kitties REST endpoints
(function () {
  'use strict';

  angular
    .module('kitties')
    .factory('KittiesService', KittiesService);

  KittiesService.$inject = ['$resource'];

  function KittiesService($resource) {
    return $resource('api/kitties/:kittyId', {
      kittyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
