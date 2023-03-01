let testingAngularApp = angular.module('testingAngularApp', []);
testingAngularApp.controller(
  'testingAngularController',
  function ($rootScope, $scope, $http) {
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
            }
            destination.weather = {};
            destination.weather.main = response.data.weather[0].main;
            destination.weather.temp = $scope.convertKelvinToCelsius(
              response.data.main.temp
            );

            console.log(destination.weather);
          },
          function errorCallback(error) {
            console.log(error);
          }
        );
    };
    $scope.convertKelvinToCelsius = function (temp) {
      return Math.round(temp - 273);
    };
  }
);
