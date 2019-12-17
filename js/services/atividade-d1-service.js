angular.module('trustionPortal').factory('AtividadeD1Service', function($http, EnvironmentService){

    var URI_REST_API = EnvironmentService.getEnvironment() + "atividade/d1";
    var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "atividades/d1";

    var service = {
        criar:criar,
        pesquisarPorIdOcor: pesquisarPorIdOcor,
        criarPorAcao: criarPorAcao,
        aprovar: aprovar,
        rejeitar:rejeitar
    };

    function criar(atividade){
        return $http.post(URI_REST_API, atividade);
    }

    function criarPorAcao(atividade){	
        return $http.post(URI_REST_API + '/acao', atividade);
    }

    function pesquisarPorIdOcor(idOcorrencia){
        return $http.get(URI_REST_API_LIST + '/ocorrencia/' + idOcorrencia);
    }

    function aprovar(atividade){	
        return $http.post(URI_REST_API + '/aprovar', atividade);
    }

    function rejeitar(atividade){	
        return $http.post(URI_REST_API + '/rejeitar', atividade);
    }

    return service;
});