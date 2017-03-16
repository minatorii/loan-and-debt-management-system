(function () {
  'use strict';

  angular
    .module('kitties')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('kitties', {
        abstract: true,
        url: '/kitties',
        template: '<ui-view/>'
      })
      .state('kitties.list', {
        url: '',
        templateUrl: 'modules/kitties/client/views/list-kitties.client.view.html',
        controller: 'KittiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Kitties List'
        }
      })
      .state('kitties.create', {
        url: '/create',
        templateUrl: 'modules/kitties/client/views/form-kitty.client.view.html',
        controller: 'KittiesController',
        controllerAs: 'vm',
        resolve: {
          kittyResolve: newKitty
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Kitties Create'
        }
      })
      .state('kitties.edit', {
        url: '/:kittyId/edit',
        templateUrl: 'modules/kitties/client/views/form-kitty.client.view.html',
        controller: 'KittiesController',
        controllerAs: 'vm',
        resolve: {
          kittyResolve: getKitty
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Kitty {{ kittyResolve.name }}'
        }
      })
      .state('kitties.view', {
        url: '/:kittyId',
        templateUrl: 'modules/kitties/client/views/view-kitty.client.view.html',
        controller: 'KittiesController',
        controllerAs: 'vm',
        resolve: {
          kittyResolve: getKitty
        },
        data: {
          pageTitle: 'Kitty {{ kittyResolve.name }}'
        }
      });
  }

  getKitty.$inject = ['$stateParams', 'KittiesService'];

  function getKitty($stateParams, KittiesService) {
    return KittiesService.get({
      kittyId: $stateParams.kittyId
    }).$promise;
  }

  newKitty.$inject = ['KittiesService'];

  function newKitty(KittiesService) {
    return new KittiesService();
  }
}());
