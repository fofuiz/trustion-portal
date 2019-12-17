angular.module("trustionPortal").factory("gestaoVendasService", function($http, EnvironmentService) {

	var _getListaGestaoVendas = function(payload) {
		return $http.get(EnvironmentService.getEnvironment() +"gestaovendas/criterios?", {params: payload});
	};


	var _getArquivosPorData = function(dataInicial, dataFinal, empId) {
		payload = {
			"dataInicial": parseInt(dataInicial),
			"dataFinal": parseInt(dataFinal),
			"empId": empId
		} 
		return $http.post(EnvironmentService.getEnvironment() +"gestaovendas/pesquisaArquivo", payload);
	};

	var _getArquivosPorSeqNome = function (sequencial, nomeArquivo, empId) {
		payload = {
			"nomeArquivo": (nomeArquivo || ""),
			"sequencial": (sequencial || ""),
			"empId": empId
		} 

		return $http.post(EnvironmentService.getEnvironment() +"gestaovendas/pesquisaArquivo", payload);
	}

	var _getDadosSemaforo = function(payload) {
		return $http.get(EnvironmentService.getEnvironment() +"gestaovendas/semaforo?", {params: payload});
		}

	var _exportarLayout2 = function(filtro) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/exportar/layout2", {params: filtro});
	}


	var _exportarCsv = function(filtro) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/exportar/csv", {params: filtro});
	}


	var _exportarOperadora = function(filtro) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/exportar/operadora", {params: filtro});
	}



	var _exportarLoja = function(filtro) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/exportar/csv2", {params: filtro});
	}



	var _exportar = function(filtro) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/exportar", {params: filtro});
	}

	var _editar = function(payload) {
		return $http.post(EnvironmentService.getEnvironment() + "gestaovendas/editar", payload);
	}

	var _conciliar = function(payload) {
		return $http.post(EnvironmentService.getEnvironment() + "gestaovendas/conciliar", payload);
	}

	var _desconciliar = function(payload) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/desconciliar", {params: payload});
	}
	
	var _listarStatusConciliacao = function(payload) {
		return $http.get(EnvironmentService.getEnvironment() + "gestaovendas/listarStatusConciliacao", {params: payload});
	}

	var _pesquisaDetalhesHash = function(payload) {
		return $http.post(EnvironmentService.getEnvironment() + "gestaovendas/pesquisaDetalhesHash", payload);
	}

	var _excluir = function(payload) {
		return $http.post(EnvironmentService.getEnvironment() + "gestaovendas/excluir", payload);
	}

	return {
		getListaGestaoVendas : _getListaGestaoVendas,
		getArquivosPorData : _getArquivosPorData,
		getArquivosPorSeqNome : _getArquivosPorSeqNome,
		getDadosSemaforo : _getDadosSemaforo,
		editar: _editar,
		conciliar: _conciliar,
		desconciliar: _desconciliar,
		listarStatusConciliacao: _listarStatusConciliacao,
		pesquisaDetalhesHash: _pesquisaDetalhesHash,
		excluir: _excluir,
		exportarLayout2: _exportarLayout2,
		exportarCsv: _exportarCsv,
		exportarOperadora: _exportarOperadora,
		exportarLoja: _exportarLoja,
		exportar: _exportar
	};

});
