(function () {
  'use strict';

  angular
    .module('kitties')
    .run(menuConfig);


  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Kitties',
      state: 'kitties',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'kitties', {
      title: 'List Kitties',
      state: 'kitties.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'kitties', {
      title: 'Create Kitty',
      state: 'kitties.create',
      roles: ['user']
    });
  }
}());
