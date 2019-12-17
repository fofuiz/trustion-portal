angular.module('trustionPortal').factory('RelatorioDescritivoCartoesService', function ($http, $q, EnvironmentService) {

	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + 'relConciliacaoCartoes';

	var service = {				
		getCardReport: getCardReport,
		getCardReportBlob: getCardReportBlob
	}

	function getCardReport(dataInicial, dataFinal, pagina, registrosPorPagina) {		
		var payload = { dataInicial, dataFinal };
		return $http.post(URI_REST_API_LIST + '/page?page=' + pagina + '&size=' + registrosPorPagina, payload);
	}

	function getCardReportBlob(dataInicial, dataFinal, pagina, registrosPorPagina) {		
		var payload = { dataInicial, dataFinal };		
		return $http.post(URI_REST_API_LIST + '/page?page=' + pagina + '&size=' + registrosPorPagina, payload);
	}

	return service;
});