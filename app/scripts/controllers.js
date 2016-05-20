'use strict';

angular.module('dentaCloudApp')


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', function ($scope, $state, $rootScope, ngDialog) {

    $scope.openLogin = function () {
        ngDialog.open({ 
        	template: 'views/login.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"LoginController" 
        });
    };
    
}])


.controller('LoginController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    
    
            
   
    
}])


;