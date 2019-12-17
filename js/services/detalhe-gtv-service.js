angular.module('trustionPortal').factory('DetalheGTVService', function($http, EnvironmentService) {

	var URI_REST_API_GTV = EnvironmentService.getEnvironment() + 'detalheGTV';

	var service = {
		pesquisarPorCriterios:pesquisarPorCriterios,
		pesquisarPorCriteriosPagina:pesquisarPorCriteriosPagina
	}

	function pesquisarPorCriterios(gtv) {
		return $http.post(URI_REST_API_GTV + '/criterios', gtv);
	}
	
	function pesquisarPorCriteriosPagina(gtv, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_GTV + '/criterios/page?page='+pagina+'&size='+registrosPorPagina,gtv);
	}

	return service;
});