angular.module('trustionPortal').factory('DetalheConferenciaService', function($http, EnvironmentService) {

	var URI_REST_API_CONF = EnvironmentService.getEnvironment() + 'detalheConferencia';

	var service = {
		pesquisarPorCriterios: pesquisarPorCriterios,
		pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina
	}

	function pesquisarPorCriterios(relatorio) {
		return $http.post(URI_REST_API_CONF + '/criterios', relatorio);
	}

	function pesquisarPorCriteriosPagina(relatorio, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_CONF + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, relatorio);
	}

	return service;
});