angular.module("trustionPortal").factory("conciliacaoCartaoDetalheService", function($http, EnvironmentService) {

	var _filtrarDadosConciliacaoDetalheCartao = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/pesquisarDetalhe", data);
	};

	var _obterDetalheExtrato = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/obterDetalheExtrato", data);		
	}
	
	var _obterDetalheCartao = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/obterDetalheCartao", data);		
	}

	var _filtrarDetalheRegistroNaoConciliadosExtrato = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/pesquisarDetalheExtratoNaoConciliados", data);		
	}
	
	var _filtrarDetalheRegistroNaoConciliadosCartao = function(data) {
		return $http.post(EnvironmentService.getEnvironment() + "cartao/pesquisarDetalheCartaoNaoConciliados", data);		
	}

	return {
		filtrarDadosConciliacaoDetalheCartao: _filtrarDadosConciliacaoDetalheCartao,
		obterDetalheExtrato: _obterDetalheExtrato,
		obterDetalheCartao: _obterDetalheCartao,
		filtrarDetalheRegistroNaoConciliadosExtrato: _filtrarDetalheRegistroNaoConciliadosExtrato,
		filtrarDetalheRegistroNaoConciliadosCartao: _filtrarDetalheRegistroNaoConciliadosCartao
	};

});
