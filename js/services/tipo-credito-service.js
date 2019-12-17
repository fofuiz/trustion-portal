angular.module('trustionPortal').factory('TipoCreditoService', function($http, EnvironmentService){
	
	var REST_URI_LIST = EnvironmentService.getEnvironment() + 'tiposCreditos';
	
	var service = {
			listaTodos: listaTodos
	};
	
	function listaTodos(){
		return $http.get(REST_URI_LIST);
	}
	
	return service;
});