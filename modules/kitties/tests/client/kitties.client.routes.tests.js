(function () {
  'use strict';

  describe('Kitties Route Tests', function () {
    // Initialize global variables
    var $scope,
      KittiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KittiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KittiesService = _KittiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('kitties');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/kitties');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          KittiesController,
          mockKitty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('kitties.view');
          $templateCache.put('modules/kitties/client/views/view-kitty.client.view.html', '');

          // create mock Kitty
          mockKitty = new KittiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kitty Name'
          });

          // Initialize Controller
          KittiesController = $controller('KittiesController as vm', {
            $scope: $scope,
            kittyResolve: mockKitty
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:kittyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.kittyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            kittyId: 1
          })).toEqual('/kitties/1');
        }));

        it('should attach an Kitty to the controller scope', function () {
          expect($scope.vm.kitty._id).toBe(mockKitty._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/kitties/client/views/view-kitty.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KittiesController,
          mockKitty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('kitties.create');
          $templateCache.put('modules/kitties/client/views/form-kitty.client.view.html', '');

          // create mock Kitty
          mockKitty = new KittiesService();

          // Initialize Controller
          KittiesController = $controller('KittiesController as vm', {
            $scope: $scope,
            kittyResolve: mockKitty
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.kittyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/kitties/create');
        }));

        it('should attach an Kitty to the controller scope', function () {
          expect($scope.vm.kitty._id).toBe(mockKitty._id);
          expect($scope.vm.kitty._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/kitties/client/views/form-kitty.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KittiesController,
          mockKitty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('kitties.edit');
          $templateCache.put('modules/kitties/client/views/form-kitty.client.view.html', '');

          // create mock Kitty
          mockKitty = new KittiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kitty Name'
          });

          // Initialize Controller
          KittiesController = $controller('KittiesController as vm', {
            $scope: $scope,
            kittyResolve: mockKitty
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:kittyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.kittyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            kittyId: 1
          })).toEqual('/kitties/1/edit');
        }));

        it('should attach an Kitty to the controller scope', function () {
          expect($scope.vm.kitty._id).toBe(mockKitty._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/kitties/client/views/form-kitty.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
