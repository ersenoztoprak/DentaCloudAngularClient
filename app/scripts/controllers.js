'use strict';

angular.module('dentaCloudApp')


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

	$scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ 
        	template: 'views/login.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"LoginController" 
        });
    };

    $scope.logOut = function() {
    	AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

     $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

     $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])


.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe) {
        	$localStorage.storeObject('userinfo',$scope.loginData);
        }
           
        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ 
        	template: 'views/register.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"RegisterController" 
        });
    }; 
}])

.controller('HomeController', ['$scope', 'HomeFactory',  function ($scope, HomeFactory) {
    $scope.message = "Loading ...";
    

	HomeFactory.query(
        function (response) {
            $scope.schedules = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    console.log('marmar: ' + $scope.schedules);
    console.log('mesaj: ' + $scope.message);
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])


;