'use strict';

/* Controllers */

var app = angular.module('ngdemoApp.controllers', []);


// Clear browser cache (in development mode)
//
// http://stackoverflow.com/questions/14718826/angularjs-disable-partial-caching-on-dev-machine
app.run(function ($rootScope, $templateCache) {
  $rootScope.$on('$viewContentLoaded', function () {
    $templateCache.removeAll();
  });
});

app.controller('HomeCtrl', ['HomeFactory', '$scope','$rootScope', function (HomeFactory,$scope,$rootScope) {  

        $scope.user = null;
        
        

        (function initController() {

            loadCurrentUser();
        })();


        function loadCurrentUser() {
            HomeFactory.query({username: $rootScope.globals.currentUser.username}).$promise.then(function (user) {   
                   $scope.user = user;
            });
        }

}]);

app.controller('CommonCtrl', ['HomeFactory', '$scope', function (HomeFactory,$scope) {  
//add actions for common pages
}]);

app.controller('MapCtrl', ['MapFactory', '$scope','NgMap','FlashService', function (MapFactory,$scope,NgMap, FlashService) {  
//add actions for MAP

  NgMap.getMap().then(function(map) {
    console.log('map', map);
    $scope.map = map;
  });

  $scope.search = "Search Doctors";

  /*$scope.shops = [
    {id:'foo', name: 'FOO SHOP', position:[41,-87]},
    {id:'bar', name: 'BAR SHOP', position:[42,-86]}
  ];*/
  $scope.searchDoctors = function(){
    GetDoctorLocations();
  }

  
  function GetDoctorLocations() {
    $scope.search = "Please wait...searching Doctors";

            MapFactory.query({address: $scope.address}).$promise.then(function (response) { 
              $scope.search = "Search Doctors"; 

                if (!response.success) {
                    FlashService.Error(response.message);
                } else {
                  $scope.shops = response.json;
                  $scope.shop = $scope.shops[0];
                }
            });
  }

}]);

app.controller('UserListCtrl', ['$scope', 'UsersFactory', 'UserFactory', '$location','FlashService',
  function ($scope, UsersFactory, UserFactory, $location, FlashService) {

    /* callback for ng-click 'editUser': */
    $scope.editUser = function (userId) {
      $location.path('/user-detail/' + userId);
    };

    /* callback for ng-click 'deleteUser': */
    $scope.deleteUser = function (userId) {
      UserFactory.delete({ id: userId }).$promise.then(function(promise){
        loadUsers();
      });
    }

    /* callback for ng-click 'createUser': */
    $scope.createNewUser = function () {
      $location.path('/user-creation');
    };

    (function initController() {

            GetUsers();
    })();

    function GetUsers() {
          UsersFactory.loadUsers(function(response){
            $scope.dataLoading = true;
              if (!response.success) {
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                } else {
                  $scope.users = response.result;
                    $scope.dataLoading = false;
                }
      });
    };


   
  }]);

app.controller('UserDetailCtrl', ['$scope', '$routeParams', 'UserFactory', '$location',
  function ($scope, $routeParams, UserFactory, $location) {

    /* callback for ng-click 'updateUser': */
    $scope.updateUser = function () {
        UserFactory.update($scope.user).$promise.then(function(promise) {
        $location.path('/user-list');
      });
    }

    /* callback for ng-click 'cancel': */
    $scope.cancel = function () {
      $location.path('/user-list');
    };

    $scope.user = UserFactory.show({id: $routeParams.id});
  }]);

app.controller('UserCreationCtrl', ['$scope', 'UsersFactory', '$location',
  function ($scope, UsersFactory, $location) {
    $scope.registrationStatus='';

    /* callback for ng-click 'createNewUser': */
    $scope.createNewUser = function () {
      $scope.dataLoading = true;

          UsersFactory.create($scope.user).$promise.then(function(promise) {
             $scope.registrationStatus='success';
             $scope.dataLoading = false;
      });
    }
  }]);

/*app.controller('LoginCtrl', ['$scope', 'LoginFactory', '$location', 
  function ($scope, LoginFactory, $location) {

     /* callback for ng-click 'Login': *
      $scope.checkLogin = function () {
        $scope.dataLoading = true;

      LoginFactory.create($scope.user).$promise.then(function(promise) {
        $scope.message = promise;
         if($scope.message.status == "success")
               $location.path('/user-list');
             
             $scope.dataLoading = false;
      });

     }

  }]);
*/
app.controller('LoginCtrl', ['$scope','$location', 'AuthenticationService', 'FlashService', 
  function ($scope, $location, AuthenticationService, FlashService) {

        $scope.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
          
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.user.email, $scope.user.pwd, function (response) {
                if (response.success) {
                    $scope.user.email = response.username;
                    AuthenticationService.SetCredentials($scope.user.email, $scope.user.pwd);
                    $location.path('/welcome');
                } else {
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                }
            });
        };


  }]);


        
    
