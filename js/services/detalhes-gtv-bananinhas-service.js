angular.module('trustionPortal').factory('DetalhesGtvBananinhasService', function($http, EnvironmentService) {

	var URI_REST_API_DETALHES_GTV = EnvironmentService.getEnvironment() + 'numerario/bananinha';

	var service = {
		listarNumerarioBananinhas : listarNumerarioBananinhas,
		listarNumerarioBananinhasExportar : listarNumerarioBananinhasExportar
	}
	
	function listarNumerarioBananinhas(pagina, registrosPorPagina, gtv) {
		return $http.get(URI_REST_API_DETALHES_GTV + '/' +gtv+ "?page="+pagina+'&size='+registrosPorPagina);
	}

	function listarNumerarioBananinhasExportar(gtv) {
		return $http.get(URI_REST_API_DETALHES_GTV + '/exportar/' +gtv);
	}

	return service;
	
});