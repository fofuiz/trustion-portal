angular.module('trustionPortal').factory('PeriodoResumoNumerariosService', function ($http, EnvironmentService) {

    URL_BASE = EnvironmentService.getEnvironment() + 'periodo/numerario';

    function consultar() {
        return $http.get(URL_BASE);
    }

    function alterar(entidade) {
        return $http.put(URL_BASE, entidade);
    }

    return {
        consultar: consultar,
        alterar: alterar
    }
});