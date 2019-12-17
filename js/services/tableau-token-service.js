angular.module('trustionPortal').factory('TableauTokenService', function ($http, EnvironmentService) {

    var URL_BASE_TOKEN = EnvironmentService.getEnvironment() + 'tableau/token';

    var service = {
        getToken: getToken
    };

    function getToken() {
        return $http.get(URL_BASE_TOKEN);
    }

    return service;
});