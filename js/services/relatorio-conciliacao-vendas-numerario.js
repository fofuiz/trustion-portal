angular.module('trustionPortal').factory('RelatorioConciliacaoVendasNumerarioService', function ($http, EnvironmentService) {

	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + 'relConciliacaoVendasNumerario';

	var service = {
		pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina
	}

	function pesquisarPorCriteriosPagina(filtro, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/page?page=' + pagina + '&size=' + registrosPorPagina, filtro);
	}

	return service;
});