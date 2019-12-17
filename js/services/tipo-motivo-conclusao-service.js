angular.module('trustionPortal').factory('TipoMotivoOcorrenciaService',
	function ($http, EnvironmentService) {

		var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "tiposMotivoConclusao";

		var service = {
			listar: listar
		};

		function listar() {
			return $http.get(URI_REST_API_LIST);
		}

		return service;
	}
);