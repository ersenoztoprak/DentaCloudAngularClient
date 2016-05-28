'use strict';

angular.module('dentaCloudApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                }

            })

            // route for the customer page
            .state('app.customer', {
                url:'customers',
                views: {
                    'content@': {
                        templateUrl : 'views/customer.html',
                        controller  : 'CustomerController'                  
                    }
                }
            })
        
            
            // route for the service page
            .state('app.service', {
                url:'services',
                views: {
                    'content@': {
                        templateUrl : 'views/service.html',
                        controller  : 'ServiceController'                  
                    }
                }
            });   
    
        $urlRouterProvider.otherwise('/');
    })
;
