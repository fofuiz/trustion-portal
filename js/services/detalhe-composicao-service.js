angular.module('trustionPortal').factory('DetalheComposicaoService', function ($http, EnvironmentService) {

	var URI_REST_API_CONF = EnvironmentService.getEnvironment() + 'detalheComposicao';

	var service = {
		pesquisarPorCriterios: pesquisarPorCriterios,
		pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina
	}

	function pesquisarPorCriterios(detalheConferencia) {
		return $http.post(URI_REST_API_CONF + '/criterios', detalheConferencia);
	}

	function pesquisarPorCriteriosPagina(detalheConferencia, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_CONF + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, detalheConferencia);
	}

	return service;
});