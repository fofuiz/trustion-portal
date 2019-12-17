angular.module('trustionPortal').factory('DetalheRelatorioService', function($http, EnvironmentService) {

	var URI_REST_API_LIST_DET_REL_FECHAMENTO = EnvironmentService.getEnvironment() + 'detalheRelatorio/fechamento/';

	var service = {
		pesquisarPorCodigoFechamento : pesquisarPorCodigoFechamento,
		pesquisarPorCriteriosPagina:pesquisarPorCriteriosPagina
	}

	function pesquisarPorCodigoFechamento(codigoFechamento) {
		return $http.get(URI_REST_API_LIST_DET_REL_FECHAMENTO + codigoFechamento);
	}
	
	function pesquisarPorCriteriosPagina(codigoFechamento, numSerie, pagina, registrosPorPagina) {
		return $http.get(URI_REST_API_LIST_DET_REL_FECHAMENTO + codigoFechamento + '/' + numSerie + '/criterios/page?page='+pagina+'&size='+registrosPorPagina);
	}


	return service;
});