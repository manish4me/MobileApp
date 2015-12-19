'use strict';

angular.module('ngdemoApp', ['ngRoute','ngCookies','ngMap','ngdemoApp.services', 'ngdemoApp.controllers'])
.config(config)
.run(run);

config.$inject = ['$routeProvider', '$httpProvider'];
function config($routeProvider, $httpProvider) 
{
  $routeProvider.when('/', {templateUrl: 'views/home.html', controller: 'CommonCtrl'});
  $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: 'CommonCtrl'});
  $routeProvider.when('/locatedoctor', {templateUrl: 'views/locatedoctors.html', controller: 'MapCtrl'});
  $routeProvider.when('/welcome', {templateUrl: 'views/welcome.html', controller: 'HomeCtrl'});
  $routeProvider.when('/services', {templateUrl: 'views/services.html', controller: 'CommonCtrl'});
  $routeProvider.when('/team', {templateUrl: 'views/team.html', controller: 'CommonCtrl'});
  $routeProvider.when('/contact', {templateUrl: 'views/contact.html', controller: 'CommonCtrl'});
  $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/user-list', {templateUrl: 'views/user-list.html', controller: 'UserListCtrl'});
  $routeProvider.when('/user-detail/:id', {templateUrl: 'views/user-detail.html', controller: 'UserDetailCtrl'});
  $routeProvider.when('/user-creation', {templateUrl: 'views/user-creation.html', controller: 'UserCreationCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});

  /* CORS... */
  /* http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api */
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http){

        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];

        $location.path('/home');



        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login','/home','/user-creation','/user-list', '/about','/services','/team','/contact']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            $rootScope.loggedIn = loggedIn != null;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
 }




