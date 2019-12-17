angular.module('trustionPortal').factory('TipoServicoService', function($http, CacheService, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + "tipoServico";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "tipoServicos";

	var service = {
			cadastra: cadastraTipoServico,
			alterar: alteraTipoServico,
			pesquisarPorId: pesquisarPorId,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			pesquisarPorCriterios: pesquisarPorCriterios
	}
	
	function cadastraTipoServico(tipoServico){	
		return $http.post(URI_REST_API, tipoServico);
	}
	
	function alteraTipoServico(tipoServico){
		return $http.put(URI_REST_API, tipoServico);
	}
	
	function pesquisarPorCriteriosPagina(tipoServico, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, tipoServico);
	}
	
	function pesquisarPorCriterios(tipoServico) {
		return $http.post(URI_REST_API_LIST + '/criterios', tipoServico);
	}	
	
	function pesquisarPorId(idTipoServico){
		return $http.get(URI_REST_API + '/' + idTipoServico);
	}
	
	return service;
});