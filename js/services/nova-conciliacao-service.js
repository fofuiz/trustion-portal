angular.module("trustionPortal").factory("novaConciliacaoService", function($http, EnvironmentService) {
	
	var _getConciliar = function(data) {		
		return $http.post(EnvironmentService.getEnvironment() + "cartao/nova-conciliar", data);
	};
	
	var _getDesfazerConciliacao = function(data) {		
		return $http.post(EnvironmentService.getEnvironment() + "/nova-desfazerConciliacao", data);
	};
	
	return {
		getConciliar: _getConciliar,
		getDesfazerConciliacao: _getDesfazerConciliacao
	};	
});