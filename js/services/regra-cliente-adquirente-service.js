angular.module("trustionPortal").factory("regraClienteAdquirenteService", function($http, EnvironmentService) {

	var _getRegraClienteAdquirente = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "regraClienteAdquirente/pesquisarRegraClienteAdquirente", data);
	};


	var _filtrarRegraClienteAdquirente = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "regraClienteAdquirente/pesquisarRegraClienteAdquirente", data);
	};
	

	return {
		getRegraClienteAdquirente : _getRegraClienteAdquirente,
		filtrarRegraClienteAdquirente: _filtrarRegraClienteAdquirente
	};

});
