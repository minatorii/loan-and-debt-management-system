(function () {
  'use strict';

  angular
    .module('kitties')
    .controller('KittiesListController', KittiesListController);

  KittiesListController.$inject = ['KittiesService'];

  function KittiesListController(KittiesService) {
    var vm = this;

    vm.kitties = KittiesService.query();
  }
}());
