angular.module('trustionPortal').factory('ModeloNegocioService', function($http, EnvironmentService){
	
	var URI_REST_API = EnvironmentService.getEnvironment() + "modeloNegocio";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "modelosNegocios";

	var service = {
		criar:criar,
		listaPorCriterios: listaPorCriterios,
		listaPorCriteriosPage: listaPorCriteriosPage,
		pesquisar:pesquisar,
		alterar:alterar,
		listarPorEmpresa: listarPorEmpresa,
		listarPorEmpresaD0: listarPorEmpresaD0,
		listarPorEmpresaDn: listarPorEmpresaDn,
		listarPorGrupo:listarPorGrupo
	};
	
	function criar(modelo){
		return $http.post(URI_REST_API, modelo);
	}
	
	function pesquisar(idModelo){
		return $http.get(URI_REST_API + '/' + idModelo);
	}
	
	function listaPorCriterios(modelo){
		return $http.post(URI_REST_API_LIST + '/criterios', modelo);
	}
	
	function listaPorCriteriosPage(modelo, pagina, registrosPorPagina){
		return $http.post(URI_REST_API_LIST + '/criterios/page?page='+pagina+'&size='+registrosPorPagina, modelo);
	}
	
	function alterar(modelo){		
		return $http.put(URI_REST_API, modelo);
	}

	function listarPorEmpresa(idEmpresa){
		return $http.get(URI_REST_API_LIST + '/idEmpresa/' + idEmpresa);
	}

	function listarPorEmpresaD0(){
		return $http.get(URI_REST_API_LIST);
	}

	function listarPorEmpresaDn(idEmpresa){
		return $http.get(URI_REST_API_LIST + '?idEmpresa=' + idEmpresa + '&tipoCredito=2');
	}
	
	function listarPorGrupo(idGrupo) {
		return $http.get(URI_REST_API_LIST + '/grupo/' + idGrupo);
	}

	return service;
});