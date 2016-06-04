'use strict';


angular.module('dentaCloudApp')
.constant("baseURL", "http://162.243.76.225:3000/")
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  } 

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username !== undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
  
    authFac.login = function(loginData) {
        
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
    	$resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '<div class="ngdialog-message">' +
                '<div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])

.factory('HomeFactory', ['$resource', 'baseURL', function($resource, baseURL) {

	return $resource(baseURL + "appoitments", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('CustomerFactory', ['$resource', 'baseURL', function($resource, baseURL) {

	return $resource(baseURL + "customers", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('ServiceFactory', ['$resource', 'baseURL', function($resource, baseURL) {

	return $resource(baseURL + "services", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('StaffFactory', ['$resource', 'baseURL', function($resource, baseURL) {

	return $resource(baseURL + "staffs", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('AppoitmnetFactory', ['$resource', 'ngDialog', 'baseURL', function($resource, ngDialog, baseURL) {

	var appFac = {};

	appFac.book = function(appoitmentData) {

        $resource(baseURL + "appoitments")
        .save(appoitmentData,
           function(response) {
           	 console.log('Appoitment created!');
           },
           function(response){
            
              var message = '<div class="ngdialog-message">' +
                '<div><h3>Booking Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };

    return appFac;

}])

.service('CustomerDetailService', ['$http', 'ngDialog', 'baseURL', function($http, ngDialog, baseURL) {

    return {
        save: function (customerData) {
          if (customerData._id) {
            return $http.put(baseURL + 'customers/' + customerData._id, customerData);
          }
          else {
            return $http.post(baseURL + 'customers', customerData);
          }
        }
    };

}])

.service('CustomerService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'customers');
        },
        delete: function(id) {
          console.log("service", id);
            return $http.delete(baseURL + 'customers/' + id);
        }
    };
}])

.service('ServiceDetailService', ['$http', 'ngDialog', 'baseURL', function($http, ngDialog, baseURL) {

    return {
        save: function (serviceData) {
          if (serviceData._id) {
            return $http.put(baseURL + 'services/' + serviceData._id, serviceData);
          }
          else {
            return $http.post(baseURL + 'services', serviceData);
          }
        }
    };

}])

.service('ServicesService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'services');
        },
        delete: function(id) {
            return $http.delete(baseURL + 'services/' + id);
        }
    };
}])

.service('StaffDetailService', ['$http', 'ngDialog', 'baseURL', function($http, ngDialog, baseURL) {

    return {
        save: function (staffData) {
          if (staffData._id) {
            return $http.put(baseURL + 'staffs/' + staffData._id, staffData);
          }
          else {
            return $http.post(baseURL + 'staffs', staffData);
          }
        }
    };

}])

.service('StaffService', [ '$http', 'baseURL', function($http, baseURL) {

    return {
        list: function() {
            return $http.get(baseURL + 'staffs');
        },
        delete: function(id) {
            return $http.delete(baseURL + 'staffs/' + id);
        }
    };
}])

;
