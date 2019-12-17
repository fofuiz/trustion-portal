angular.module('trustionPortal').factory('RelatorioAnaliticoTotalService', function($http, EnvironmentService){

    var URL_BASE = EnvironmentService.getEnvironment() + 'relAnaliticoCredito/total';

    var service = {
        totalCreditos7Dias: totalCreditos7Dias,
        totalCreditosPeriodoUsuario: totalCreditosPeriodoUsuario
    };

    function totalCreditos7Dias(){
        return $http.get(URL_BASE + '/dias/7');
    }

    function totalCreditosPeriodoUsuario(){
        return $http.get(URL_BASE + '/dias');
    }

    return service;

});