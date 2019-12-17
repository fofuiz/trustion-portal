angular.module('trustionPortal').factory('valoresComboService', function($http, EnvironmentService){
	
	var _getAnosReferencias = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboAno");
  };
  
	var _getDomiciliosBancariosAtivos = function(empId) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboDomicilioBancario?empId="+empId);
	};

	var _getModalidades = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboModalidadeTarifa");
	};

	var _getMesReferencias = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboReferencia");
	};
	
	var _getMotivo = function(empId) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboMovivoConciliacao?empId="+empId);
	};
	
	var _getAdquirentes = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboAdquirente");
	};

	var _getLojas = function(empId) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboLoja?empId="+empId);
	}

	var _getLojasByCnpjEmpresa = function(cnpj) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboLojaPorCnpjEmpresa?cnpj=\""+ cnpj + "\"");
	}

	var _getOperadoras = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboOperadora");
	}

	var _getProdsOperadoras = function(codOperadora) {
		if(codOperadora > 0) {
			return $http.get(EnvironmentService.getEnvironment() + "carregarComboProdutoOperadora?codOperadora="+codOperadora);
		} else {
			return $http.get(EnvironmentService.getEnvironment() + "carregarComboProdutoOperadora?codOperadora=10");
		}
	}

	var _getComboPontoVenda = function(empId) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboPontoVenda?empId="+empId);
	}

	var _getComboPontoVendaPorCodLoja = function(codLoja) {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboPontoVendaPorCodLoja?codLoja="+codLoja);
	}

	var _listarVisao = function() {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/listarVisao");
	}

	var _carregarComboOpcaoExtrato = function() {
		return $http.get(EnvironmentService.getEnvironment() + "carregarComboOpcaoExtrato");
	}

	return {
		getAnosReferencias: _getAnosReferencias,
		getDomiciliosBancariosAtivos: _getDomiciliosBancariosAtivos,
		getModalidades: _getModalidades,
		getMesReferencias: _getMesReferencias,
		getMotivo: _getMotivo,
		getAdquirentes: _getAdquirentes,
		getLojas: _getLojas,
		getLojasByCnpjEmpresa: _getLojasByCnpjEmpresa,
		getOperadoras: _getOperadoras,
		getProdsOperadoras: _getProdsOperadoras,
		listarVisao: _listarVisao,
		getComboPontoVenda: _getComboPontoVenda,
		getComboPontoVendaPorCodLoja: _getComboPontoVendaPorCodLoja,
		carregarComboOpcaoExtrato: _carregarComboOpcaoExtrato
	};
});
