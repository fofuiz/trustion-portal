angular.module('trustionPortal').factory('ListaBancoService', function($http, EnvironmentService){

    var URI_REST_API_LIST = EnvironmentService.getEnvironment() + 'listaBancos';
    
    var service = {
        listarTodosBancos: listarTodosBancos
    };

    function listarTodosBancos(){
        return $http.get(URI_REST_API_LIST);
    }

    return service;

});