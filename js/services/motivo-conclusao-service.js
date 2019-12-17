angular.module('trustionPortal').factory('MotivoConclusaoService', function ($http, EnvironmentService) {
    var URI_REST_API = EnvironmentService.getEnvironment() + "tiposMotivoConclusao";

	var service = {
        listar: listar,
        pesquisarPorId: pesquisarPorId,
        criar: criar,
        alterar: alterar
    };
    
    function listar(payload) {
        return $http.get(URI_REST_API, {
            params: payload
        });
    }

    function pesquisarPorId(idMotivoConclusao) {
        return $http.get(URI_REST_API + '/' + idMotivoConclusao);
    }

    function criar(motivoConclusao) {
        return $http.post(URI_REST_API, motivoConclusao);
    }

    function alterar(motivoConclusao){
        return $http.put(URI_REST_API, motivoConclusao);
    }

	return service;
});