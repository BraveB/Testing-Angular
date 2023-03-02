let testingAngularApp = angular
  .module('testingAngularApp', [])
  .filter('warmestDestinations', function () {
    return function (destinations, minimumTemp) {
      var warmestDestinations = [];
      angular.forEach(destinations, function (destination) {
        if (
          destination.weather &&
          destination.weather.temp &&
          destination.weather.temp >= minimumTemp
        ) {
          warmestDestinations.push(destination);
        }
      });
      return warmestDestinations;
    };
  })
  .directive('destinationDirective', function () {
    return {
      scope: {
        destination: '=',
        apiKey: '=',
        onRemove: '&',
      },
      template: `<span>{{destination.city}}, {{destination.country}}</span>
      <span ng-if="destination.weather"
        >{{destination.weather.main}}-{{destination.weather.temp}}</span
      >
      <button ng-click="onRemove()">Remove</button>
      <button ng-click="getWeather(destination)">Update Weather</button>`,
      controller: function ($http, $rootScope, $scope) {
        $scope.getWeather = function (destination) {
          $http
            .get(
              'http://api.openweathermap.org/data/2.5/weather?q=' +
                destination.city +
                '&appid=' +
                $scope.apiKey
            )
            .then(
              function successCallback(response) {
                if (response.data.weather) {
                  destination.weather = {};
                  destination.weather.main = response.data.weather[0].main;
                  destination.weather.temp = $scope.convertKelvinToCelsius(
                    response.data.main.temp
                  );
                } else {
                  $rootScope.message = 'city not found';
                }
              },
              function errorCallback(error) {
                console.log(error);
                $rootScope.message = 'server error';
              }
            );
        };
        $scope.convertKelvinToCelsius = function (temp) {
          return Math.round(temp - 273);
        };
      },
    };
  });
testingAngularApp.controller(
  'testingAngularController',
  function ($rootScope, $scope, $http, $timeout) {
    $scope.title = 'testing angularjs application';

    $scope.destinations = [];

    $scope.apiKey = 'c58d1a26f5f03aa1e76015b69f51a3f3';

    $scope.newDestination = {
      city: undefined,
      country: undefined,
    };
    $scope.addDestination = function () {
      $scope.destinations.push({
        city: $scope.newDestination.city,
        country: $scope.newDestination.country,
      });
    };
    $scope.removeDestination = function (index) {
      $scope.destinations.splice(index, 1);
    };

    $rootScope.messageWatcher = $rootScope.$watch('message', function () {
      if ($rootScope.message) {
        $timeout(function () {
          $rootScope.message = null;
        }, 3000);
      }
    });
  }
);
