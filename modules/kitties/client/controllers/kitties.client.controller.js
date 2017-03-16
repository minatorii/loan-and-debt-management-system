(function () {
  'use strict';

  // Kitties controller
  angular
    .module('kitties')
    .controller('KittiesController', KittiesController);

  KittiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'kittyResolve'];

  function KittiesController ($scope, $state, $window, Authentication, kitty) {
    var vm = this;

    vm.authentication = Authentication;
    vm.kitty = kitty;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Kitty
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.kitty.$remove($state.go('kitties.list'));
      }
    }

    // Save Kitty
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.kittyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.kitty._id) {
        vm.kitty.$update(successCallback, errorCallback);
      } else {
        vm.kitty.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('kitties.view', {
          kittyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
