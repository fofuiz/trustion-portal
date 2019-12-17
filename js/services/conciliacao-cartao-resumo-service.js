angular.module("trustionPortal").factory("conciliacaoCartaoResumoService", function($http, $window, EnvironmentService) {

	var _filtrarDadosConciliacaoResumoCartao = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/pesquisarResumo", data);
	};




	return {
		filtrarDadosConciliacaoResumoCartao: _filtrarDadosConciliacaoResumoCartao,

	};

});
