angular.module('trustionPortal').factory('AuditoriaService', function($http, EnvironmentService){
	var REST_URI = EnvironmentService.getEnvironment() + 'auditorias/criterio';
	
	
	var service = {
			lista:listaAuditoria,
			listaAuditoriaPage: listaAuditoriaPage
	}
	
	function listaAuditoria(auditoria){
		return $http.post(REST_URI, auditoria);
	}
	
	function listaAuditoriaPage(auditoria, pagina, registrosPorPagina){
		return $http.post(REST_URI + '/page?page='+pagina+'&size='+registrosPorPagina, auditoria);
	}
	
	return service;
});