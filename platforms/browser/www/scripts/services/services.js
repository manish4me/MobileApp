'use strict';

var services = angular.module('ngdemoApp.services', ['ngResource']);

//Local
//var baseUrl = 'http://localhost:3000';
//Production
var baseUrl = 'http://pvservices.azurewebsites.net';

services.factory('HomeFactory', function ($resource) {
    return $resource(baseUrl + '/pv/web/user/getbyusername/:username', {}, {
        query: { method: 'GET',params:{username: '@username'}}
    })
});

services.factory('MapFactory', function ($resource) {
    return $resource(baseUrl + '/pv/web/location/:address', {}, {
        query: { method: 'GET',params:{address: '@address'}}
    })
});

services.factory('UsersFactory', function ($resource) {
    return $resource(baseUrl + '/pv/web/users', {}, {
        loadUsers: { method:'GET' },
        create: { method: 'POST' }
    })
});

services.factory('UserFactory', function ($resource) {
    return $resource(baseUrl + '/pv/web/users/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    })
});


