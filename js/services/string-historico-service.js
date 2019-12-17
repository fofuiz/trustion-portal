angular.module('trustionPortal').factory('StringHistoricoService', function($http, EnvironmentService){

    var URI_REST_API = EnvironmentService.getEnvironment() + "stringHistorico";
    var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "stringHistoricos";

    var service = {
        criar: criar,
        alterar: alterar,
        perquisarPorId: perquisarPorId,
        pesquisarPorPage: pesquisarPorPage
    };

    function criar(stringHistorico){
        return $http.post(URI_REST_API, stringHistorico);
    }

    function alterar(stringHistorico){
        return $http.put(URI_REST_API, stringHistorico);
    }

    function perquisarPorId(idStringHistorico){
        return $http.get(URI_REST_API + '/' + idStringHistorico);
    }

    function pesquisarPorPage(filtro, pagina, registroPorPagina){
        return $http.post(URI_REST_API_LIST + '/criterio?page=' + pagina + '&size=' + registroPorPagina, filtro);
    }

    return service;

});