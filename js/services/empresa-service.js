angular.module('trustionPortal').factory('EmpresaService', function($http, CacheService, EnvironmentService){
	var URI_REST_API = EnvironmentService.getEnvironment() + "empresa";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "empresas";

	var service = {
			valida: validaEmpresa,
			cadastra: cadastraEmpresa,
			altera: alteraEmpresa,
			pesquisarPorId: pesquisarPorId,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			pesquisarPorCriterios: pesquisarPorCriterios,
			pesquisarPorGrpEcon: pesquisarPorGrpEcon,
			pesquisarPorGrpEconD1: pesquisarPorGrpEconD1,
			pesquisarPorGrpEconD0: pesquisarPorGrpEconD0,
			listarEmpresasCNPJs: listarEmpresasCNPJs,
			pequisarPorModelosNegocio: pequisarPorModelosNegocio,
			listarSegmentosMercado: listarSegmentosMercado,
			getTemplateCsv: getTemplateCsv,
			uploadCsv: uploadCsv
	}

	function validaEmpresa(empresa){
		return $http.post(URI_REST_API + '/validar', empresa);
	}

	function cadastraEmpresa(empresa){
		return $http.post(URI_REST_API, empresa);
	}

	function alteraEmpresa(empresa){
		return $http.put(URI_REST_API, empresa);
	}

	function pesquisarPorCriteriosPagina(empresa, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, empresa);
	}

	function pesquisarPorCriterios(empresa) {
		return $http.post(URI_REST_API_LIST + '/criterios', empresa);
	}

	function pequisarPorModelosNegocio(idsModeloNegocio) {
		return $http.post(URI_REST_API_LIST + '/modelos', idsModeloNegocio);
	}

	function pesquisarPorId(idEmpresa){
		return $http.get(URI_REST_API + '/' + idEmpresa);
	}

	function pesquisarPorGrpEcon(listaGrpEcon) {
		return $http.post(URI_REST_API_LIST + '/grpEcon', listaGrpEcon);
	}

	function pesquisarPorGrpEconD1(lista){
		return $http.post(URI_REST_API_LIST + '/grpEcon/d1', lista);
	}

	function pesquisarPorGrpEconD0(lista){
		return $http.post(URI_REST_API_LIST + '/grpEcon/d0', lista);
	}

	function listarEmpresasCNPJs() {
        return $http.get(URI_REST_API_LIST + '/cnpj');
	}

	function listarSegmentosMercado(){
		return $http.get(URI_REST_API + '/segmentos');
	}

	function getTemplateCsv() {
		return $http.get(URI_REST_API_LIST + '/download');
	}

	function uploadCsv(formData) {
		return $http.post(URI_REST_API_LIST + '/upload', formData, {
			withCredentials: true,
			headers: {'Content-Type': undefined },
			transformRequest: angular.identity
		});
	}

	return service;
});
