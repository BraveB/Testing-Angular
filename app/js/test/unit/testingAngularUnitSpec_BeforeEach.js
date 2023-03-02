describe('Testing Angular Test Suite', function () {
  beforeEach(module('testingAngularApp'));
  describe('testing angular controller', function () {
    let scope, ctrl, httpBackend, timeout, rootScope;
    beforeEach(inject(function (
      $controller,
      $rootScope,
      $httpBackend,
      $timeout
    ) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      ctrl = $controller('testingAngularController', { $scope: scope });
      httpBackend = $httpBackend;
      timeout = $timeout;
    }));
    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
    it('should initialize the title in the scope', function () {
      expect(scope.title).toBeDefined();
      expect(scope.title).toBe('testing angularjs application');
    });
    it('should add 2 destinations to the destinations list', function () {
      expect(scope.destinations).toBeDefined();
      expect(scope.destinations.length).toBe(0);
      scope.newDestination = {
        city: 'London',
        country: 'England',
      };

      scope.addDestination();

      expect(scope.destinations.length).toBe(1);
      expect(scope.destinations[0].city).toBe('London');
      expect(scope.destinations[0].country).toBe('England');

      scope.newDestination.city = 'Frankfurt';
      scope.newDestination.country = 'Germany';

      scope.addDestination();

      expect(scope.destinations.length).toBe(2);
      expect(scope.destinations[1].city).toBe('Frankfurt');
      expect(scope.destinations[1].country).toBe('Germany');
    });
    it('should remove a destination from the destination list', function () {
      scope.destinations = [
        {
          city: 'London',
          country: 'England',
        },
        {
          city: 'Paris',
          country: 'France',
        },
      ];

      expect(scope.destinations.length).toBe(2);
      expect(scope.destinations[0].city).toBe('London');

      scope.removeDestination(0);

      expect(scope.destinations.length).toBe(1);
      expect(scope.destinations[0].city).toBe('Paris');

      scope.removeDestination(0);

      expect(scope.destinations.length).toBe(0);
    });

    it('should remove error message after a fixed period of time', function () {
      rootScope.message = 'Error';
      expect(rootScope.message).toBe('Error');

      scope.$apply();
      timeout.flush();

      expect(rootScope.message).toBeNull();
    });
  });
  describe('Testing AngularJs Filter', () => {
    it('should return only warm destinations', inject(function ($filter) {
      let warmest = $filter('warmestDestinations');
      let destinations = [
        { city: 'beijing', country: 'china', weather: { temp: 21 } },
        { city: 'moscow', country: 'russia' },
        { city: 'mexico city', country: 'mexico', weather: { temp: 12 } },
        { city: 'Lima', country: 'Peru', weather: { temp: 15 } },
      ];

      expect(destinations.length).toBe(4);

      let warmestDestinations = warmest(destinations, 15);
      expect(warmestDestinations.length).toBe(2);
      expect(warmestDestinations[0].city).toBe('beijing');
      expect(warmestDestinations[1].city).toBe('Lima');
    }));
  });
  describe('testing angularjs directive', () => {
    let scope, template, isolateScope;
    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      scope.destination = { city: 'tokyo', country: 'japan' };
      scope.apiKey = 'xyz';
      let element = angular.element(
        '<div destination-directive destination="destination" api-key="apiKey" on-remove="remove()"></div>'
      );
      template = $compile(element)(scope);
      scope.$digest();
      isolateScope = element.isolateScope();
    }));
    it('should update the weather for a specific destination', function () {
      scope.destination = { city: 'Melbourne', country: 'Australia' };
      httpBackend
        .expectGET(
          'http://api.openweathermap.org/data/2.5/weather?q=' +
            scope.destination.city +
            '&appid=' +
            scope.apiKey
        )
        .respond({
          weather: [{ main: 'Rain', detail: 'light rain' }],
          main: { temp: 288 },
        });
      isolateScope.getWeather(scope.destination);
      httpBackend.flush();
      expect(scope.destination.weather.main).toBe('Rain');
      expect(scope.destination.weather.temp).toBe(15);
    });
    it('should call the parent controller remove function', () => {
      scope.removeTest = 1;
      scope.remove = () => {
        scope.removeTest++;
      };
      isolateScope.onRemove();
      expect(scope.removeTest).toBe(2);
    });
    // to run only one test add f before it
    // fit('should generae the correct HTML', () => {
    it('should generae the correct HTML', () => {
      let templateAsHTML = template.html();
      expect(templateAsHTML).toContain('tokyo, japan');

      scope.destination.city = 'London';
      scope.destination.country = 'England';
      scope.$digest();
      templateAsHTML = template.html();
      expect(templateAsHTML).toContain('London, England');
    });
  });
});
