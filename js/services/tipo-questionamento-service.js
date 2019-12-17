angular.module('trustionPortal').factory('TipoQuestionamentoService', function($http, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + 'tiposQuestionamentos';
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "tiposQuestionamentos";
	
	var service = {
		listar: listar,
		listarPorId: listarPorId,
		atualizar: atualizar,
		criar: criar
	};
	
	function listar(payload) {
		return $http.get(URI_REST_API_LIST, {
			params: payload
		});
	}

	function listarPorId(id) {
		return $http.get(URI_REST_API_LIST + '/' + id);
	}

	function criar(payload) {
		return $http.post(URI_REST_API, payload);
	}

	function atualizar(payload) {
		return $http.put(URI_REST_API, payload);
	}
	
	return service;
});