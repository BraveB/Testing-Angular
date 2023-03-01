describe('Testing Angular Test Suite', function () {
  beforeEach(module('testingAngularApp'));
  describe('testing angular controller', function () {
    let scope, ctrl, httpBackend;
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      ctrl = $controller('testingAngularController', { $scope: scope });
      httpBackend = $httpBackend;
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
      scope.getWeather(scope.destination);
      httpBackend.flush();
      expect(scope.destination.weather.main).toBe('Rain');
      expect(scope.destination.weather.temp).toBe(15);
    });
  });
});
