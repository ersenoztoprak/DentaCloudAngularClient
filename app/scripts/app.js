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

            // route for the aboutus page
            .state('app.customer', {
                url:'customers',
                views: {
                    'content@': {
                        templateUrl : 'views/customer.html',
                        controller  : 'CustomerController'                  
                    }
                }
            });
        
           
    
        $urlRouterProvider.otherwise('/');
    })
;
