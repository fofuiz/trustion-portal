angular.module("trustionPortal").factory("domicilioBancarioService", function($http, EnvironmentService) {

	var _getDadosDomicilioBancario = function(empId) {
		return $http.get(EnvironmentService.getEnvironment() + "domicilios/bancarios/detalhe/?empID="+empId);
	};

	var _filtrarDadosDomicilioBancario = function(codigoBancoStr, empId) {
		return $http.get(EnvironmentService.getEnvironment() + "domicilios/bancarios/detalhe/?empID="+empId+"&codigoBancoStr="+codigoBancoStr);
	};

	return {
		getDadosDomicilioBancario : _getDadosDomicilioBancario,
		filtrarDadosDomicilioBancario: _filtrarDadosDomicilioBancario
	};

});