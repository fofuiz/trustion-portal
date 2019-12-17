angular.module('trustionPortal').factory('OcorrenciaD1Service', function($http, EnvironmentService){
	
	const URI_REST_API = EnvironmentService.getEnvironment() + 'ocorrencia/d1';
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "ocorrencias/d1";
	
	
	var service = {
			criar:criar,
			pesquisar:pesquisar,
			alterarStatus: alterarStatus,
			pesquisarPorCriteriosPagina : pesquisarPorCriteriosPagina,
			pesquisarPorCriterioExportar : pesquisarPorCriterioExportar

	}
	
	function criar(ocorrencia){
		return $http.post(URI_REST_API, ocorrencia);
	}
	
	function pesquisar(idOcorrencia){
		return $http.get(URI_REST_API + '/' + idOcorrencia);
	}

	function alterarStatus(ocorrencia){
		return $http.put(URI_REST_API + '/status', ocorrencia);
	}

	function pesquisarPorCriteriosPagina(filtro, pagina, registrosPorPagina){
		return $http.post(URI_REST_API_LIST + '/criterios/page?page='+pagina+'&size='+registrosPorPagina, filtro);
	}

	function pesquisarPorCriterioExportar(filtro){
		return $http.post(URI_REST_API_LIST + '/criterios/exportar', filtro);
	}
	
	return service;
});