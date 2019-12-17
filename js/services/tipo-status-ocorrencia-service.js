angular.module('trustionPortal').factory('TipoStatusOcorrenciaService', 
	function($http, EnvironmentService) {

		var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "tiposStatusOcorrencias";

		var URI_REST_API_LIST_REABERTURA = EnvironmentService.getEnvironment() + "tiposStatusOcorrenciasReabertura";

		var service = {
			listar : listar,
			listarReabertura: listarReabertura
		};

		function listar() {
			return $http.get(URI_REST_API_LIST);
		}

		function listarReabertura() {
			return $http.get(URI_REST_API_LIST_REABERTURA);
		}

		return service;
	}
);