angular.module("trustionPortal").factory("registrosNaoProcessadosService", function($http, EnvironmentService, $filter) {

	var _buscarRegistrosNaoProcessados = function(payload) {
		return $http.get(EnvironmentService.getEnvironment() + "transacoes/naoprocessadas", {params: payload});
	};

	return {
		buscarRegistrosNaoProcessados : _buscarRegistrosNaoProcessados
	};

});