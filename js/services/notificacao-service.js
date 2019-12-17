angular.module('trustionPortal').factory('NotificacaoService', function($http, CacheService, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + "notificacao";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "notificacoes";

	var service = {
			cadastra: cadastraNotificacao,
			alteraNotificacao: alteraNotificacao,
			pesquisarPorId: pesquisarPorId,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			pesquisarPorCriterios: pesquisarPorCriterios,
			listarNotificacoes: listarNotificacoes
	}
	
	function cadastraNotificacao(notificacao){	
		return $http.post(URI_REST_API, notificacao);
	}
	
	function alteraNotificacao(notificacao){
		return $http.put(URI_REST_API, notificacao);
	}
	
	function pesquisarPorCriterios(notificacao) {
		return $http.post(URI_REST_API_LIST + '/criterios', notificacao);
	}	
	
	function pesquisarPorId(idNotificacao){
		return $http.get(URI_REST_API + '/' + idNotificacao);
	}
	
	function pesquisarPorCriteriosPagina(notificacao, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, notificacao);
	}
	
	function listarNotificacoes() {
		return $http.get(EnvironmentService.getEnvironment() + 'tipoNotificacao');
	}
	
	return service;
});