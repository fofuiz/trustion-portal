angular.module('trustionPortal').factory('OcorrenciaService', 
	function($http, EnvironmentService) {
	
		var URI_REST_API = EnvironmentService.getEnvironment() + "ocorrencia";
		var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "ocorrencias";

		var service = {
			criar : criar,
			pesquisar : pesquisar,
			alterarStatus : alterarStatus,
			pesquisarPorCriteriosPagina : pesquisarPorCriteriosPagina,
			pesquisarPorCriterioExportar : pesquisarPorCriterioExportar
		}

		function criar(ocorrencia){
			return $http.post(URI_REST_API, ocorrencia);
		}
		
		function alterarStatus(ocorrencia){
			return $http.put(URI_REST_API + '/status', ocorrencia);
		}
		
		function pesquisar(idOcorrencia){
			return $http.get(URI_REST_API + '/' + idOcorrencia);
		}

		function pesquisarPorCriteriosPagina(filtro, pagina, registrosPorPagina){
			return $http.post(URI_REST_API_LIST + '/criterios/page?page='+pagina+'&size='+registrosPorPagina, filtro);
		}

		function pesquisarPorCriterioExportar(filtro){
			return $http.post(URI_REST_API_LIST + '/criterios/exportar', filtro);
		}

		return service;
	}
);
