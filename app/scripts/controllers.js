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

.controller('HomeController', ['$scope', 'ngDialog' ,'HomeFactory',  function ($scope, ngDialog, HomeFactory) {
    $scope.message = "Loading ...";
    

	HomeFactory.query(
        function (response) {
            $scope.schedules = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.openAppoitment = function () {
        ngDialog.open({ 
        	template: 'views/appoitment.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"AppoitmnetController" 
        });
    }; 
    
}])

.controller('AppoitmnetController', ['$state', '$scope', 'ngDialog', 'StaffFactory', 'ServiceFactory', 'CustomerFactory', 'AppoitmnetFactory', function($state, $scope, ngDialog, StaffFactory, ServiceFactory, CustomerFactory, AppoitmnetFactory) {

	$scope.now = new Date();

	StaffFactory.query(
        function (response) {
            $scope.staffs = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

	ServiceFactory.query(
        function (response) {
            $scope.services = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

	CustomerFactory.query(
        function (response) {
            $scope.customers = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


	$scope.bookAppoitment = function() {
		$scope.appoitment.date = Math.round(new Date($scope.appoitment.date).getTime()/1000);
		AppoitmnetFactory.book($scope.appoitment);
		ngDialog.close();
		$state.reload();
	};
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