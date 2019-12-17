angular.module('trustionPortal').factory('TipoNotificacaoService', function($http, CacheService, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + "tipoNotificacao";

	var service = {
			pesquisarPorCriterios: pesquisarPorCriterios
	}
	
	
	function pesquisarPorCriterios() {
		return $http.get(URI_REST_API);
	}	
	

	
	return service;
});