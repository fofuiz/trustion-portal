angular.module('trustionPortal').factory('RelatorioAnaliticoCreditosD1Service', function($http, EnvironmentService){
	
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + 'relAnaliticoCreditoD1';
	
	var service = {
			pesquisarPorCriteriosPagina:pesquisarPorCriteriosPagina,
			pesquisar:pesquisar
	}
	
	function pesquisarPorCriteriosPagina(filtro, pagina, registrosPorPagina){
		return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, filtro);
	}
	
	function pesquisar(id){
		return $http.get(URI_REST_API_LIST + '/' + id);
	}
	
	return service;
});