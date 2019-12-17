angular.module('trustionPortal').factory('RelatorioAnaliticoCreditosService', function ($http, EnvironmentService) {

	var URI_REST_API_LIST_PAGE = EnvironmentService.getEnvironment() + 'relAnaliticoCredito';

	var service = {
		pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
		pesquisar: pesquisar
	}

	function pesquisarPorCriteriosPagina(relAnaliticoCred, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST_PAGE + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, relAnaliticoCred);
	}

	function pesquisar(id) {
		return $http.get(URI_REST_API_LIST_PAGE + '/' + id);
	}

	return service;
});