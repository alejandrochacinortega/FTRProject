'use strict';

var app = angular
  .module('TaskRabbit', [
    'firebase',
    'ui.router',
    'ngAnimate',
    'ngResource',
    'toaster',
    'angularMoment'
  ])
  .constant('FURL', 'https://tr-project.firebaseio.com/')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('/', {
        url: "/",
        templateUrl: "views/browse.html",
        controller: "BrowseController"
      })
      .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'AuthController as authCtrl'
      })
      .state('register', {
        url: "/register",
        templateUrl: "views/register.html",
        controller: 'AuthController as authCtrl'
      })
      .state('browse', {
        url: "/browse/:taskId",
        templateUrl: "views/browse.html",
        controller: "BrowseController",
        /*controller: 'TaskController as taskCtrl',*/
        params: {
          taskId: null
        }
      })
  });
