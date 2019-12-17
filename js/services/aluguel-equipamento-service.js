angular.module("trustionPortal").factory("aluguelEquipamentoService", function($http, EnvironmentService, $filter) {

	var _buscarAluguelEquipamento = function(empId, dataInicial, dataFinal) {
		return $http.get(EnvironmentService.getEnvironment() + "alugueis/equipamentos?empId="+empId+"&dataDe="+dataInicial+"&dataAte="+dataFinal);
	};

	return {
		buscarAluguelEquipamento : _buscarAluguelEquipamento
	};

});