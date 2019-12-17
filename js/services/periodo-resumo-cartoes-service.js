angular.module('trustionPortal').factory('PeriodoResumoCartoesService', function ($http, EnvironmentService) {

    BASE_URL = EnvironmentService.getEnvironment() + 'periodo/cartao';

    function consultar(){
        return $http.get(BASE_URL);
    }

    function alterar(entidade) {
        return $http.put(BASE_URL, entidade);
    }

    return {
        consultar: consultar,
        alterar: alterar
    };

});