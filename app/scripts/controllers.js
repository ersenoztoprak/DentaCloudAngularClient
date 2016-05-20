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

     $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
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
    
            
   
    
}])


;