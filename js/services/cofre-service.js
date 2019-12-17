angular.module('trustionPortal').factory('CofreService', function($http, CacheService, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + "cofre";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "cofres";

	var service = {
			cadastra: cadastraCofre,
			alterar: alteraCofre,
			pesquisarPorId: pesquisarPorId,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			pesquisarPorCriterios: pesquisarPorCriterios,
			pesquisarPorEmpresas: pesquisarPorEmpresas
	}
	
	function cadastraCofre(cofre){	
		return $http.post(URI_REST_API, cofre);
	}
	
	function alteraCofre(cofre){
		return $http.put(URI_REST_API, cofre);
	}
	
	function pesquisarPorCriterios(cofre) {
		return $http.post(URI_REST_API_LIST + '/criterios', cofre);
	}	
	
	function pesquisarPorId(idCofre){
		return $http.get(URI_REST_API + '/' + idCofre);
	}
	
	function pesquisarPorCriteriosPagina(cofre, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, cofre);
	}

	function pesquisarPorEmpresas(listaEmpresa) {
		return $http.post(URI_REST_API_LIST + '/empresas', listaEmpresa);
	}

	return service;
});