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

.controller('AppoitmnetController', ['$state', '$scope', 'ngDialog', 'StaffService', 'ServicesService', 'CustomerService', 'AppoitmnetFactory', function($state, $scope, ngDialog, StaffService, ServicesService, CustomerService, AppoitmnetFactory) {

	$scope.now = new Date();

	StaffService.list().then(
        function (response) {
            $scope.staffs = response.data;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

	ServicesService.list().then(
        function (response) {
            $scope.services = response.data;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


    CustomerService.list().then(function(response) {
            $scope.customers = response.data;
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

.controller('CustomerController', ['$scope', 'ngDialog', 'CustomerService', function($scope, ngDialog, CustomerService) {
	  
	$scope.customers = [];

    $scope.reloadCustomers = function() {
        CustomerService.list().then(function(response) {
            $scope.customers = response.data;
        });
    };

    $scope.deleteCustomer = function(customer) {

        CustomerService.delete(customer._id).then(function() {
            $scope.reloadCustomers();
        });
    };

    $scope.updateCustomer = function(customer) {

        $scope.customer = customer;
        $scope.openCustomerDialog();
    };

    $scope.openCustomerDialog = function () {
        ngDialog.open({ 
            template: 'views/customerDetail.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller:"CustomerDetailController" 
        });
    };

    $scope.reloadCustomers();
	
}])

.controller('CustomerDetailController', ['$state', '$scope', 'ngDialog', 'CustomerDetailService', function($state, $scope, ngDialog, CustomerDetailService) {
      
    $scope.saveCustomer = function() {
        CustomerDetailService.save($scope.customer);
        ngDialog.close();
        $scope.reloadCustomers();
    };
    
}])

.controller('ServiceController', ['$scope', 'ngDialog', 'ServicesService', function($scope, ngDialog, ServicesService) {
      
    $scope.services = [];

    $scope.reloadServices = function() {
        ServicesService.list().then(function(response) {
            $scope.services = response.data;
        });
    };

    $scope.deleteService = function(service) {

        ServicesService.delete(service._id).then(function() {
            $scope.reloadServices();
        });
    };

    $scope.updateService = function(service) {

        $scope.service = service;
        $scope.openServiceDialog();
    };

    $scope.openServiceDialog = function () {
        ngDialog.open({ 
            template: 'views/serviceDetail.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller:"ServiceDetailController" 
        });
    };

    $scope.reloadServices();
    
}])

.controller('ServiceDetailController', ['$state', '$scope', 'ngDialog', 'ServiceDetailService', function($state, $scope, ngDialog, ServiceDetailService) {
      
    $scope.saveService = function() {
        ServiceDetailService.save($scope.service);
        ngDialog.close();
        $scope.reloadServices();
    };
    
}])

.controller('StaffController', ['$scope', 'ngDialog', 'StaffService', function($scope, ngDialog, StaffService) {
      
    $scope.staffs = [];

    $scope.reloadStaffs = function() {
        StaffService.list().then(function(response) {
            $scope.staffs = response.data;
        });
    };

    $scope.deleteStaff = function(staff) {

        StaffService.delete(staff._id).then(function() {
            $scope.reloadStaffs();
        });
    };

    $scope.updateStaff = function(staff) {

        $scope.staff = staff;
        $scope.openStaffDialog();
    };

    $scope.openStaffDialog = function () {
        ngDialog.open({ 
            template: 'views/staffDetail.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller:"StaffDetailController" 
        });
    };

    $scope.reloadStaffs();
    
}])

.controller('StaffDetailController', ['$state', '$scope', 'ngDialog', 'StaffDetailService', function($state, $scope, ngDialog, StaffDetailService) {
      
    $scope.saveStaff = function() {
        StaffDetailService.save($scope.staff);
        ngDialog.close();
        $scope.reloadStaffs();
    };
    
}])

;