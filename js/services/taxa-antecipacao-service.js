angular.module("trustionPortal").factory("taxaAntecipacaoService", function($http, EnvironmentService, $filter) {

	var _buscarTaxaAntecipacao = function(dataInicial, dataFinal, empId) {

		var data = {
			"idsEmp": empId,
			"dataInicial": dataInicial,
			"dataFinal": dataFinal
		};

		return $http.post(EnvironmentService.getEnvironment() + "taxaantecipacao/criterios/", data);
	};


	return {
		buscarTaxaAntecipacao : _buscarTaxaAntecipacao
	};

});