angular.module('trustionPortal').factory('TransportadoraService', 
	function($http, EnvironmentService) {

		var URI_REST_API = EnvironmentService.getEnvironment() + "transportadora";
		var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "transportadoras";

		var service = {
			pesquisar: pesquisar,
			pesquisarPorId: pesquisarPorId,
			criar: criar,
			alterar: alterar,
			pesquisarPorCriterios: pesquisarPorCriterios,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			listarTodos: listarTodos,
			listarPorPerfilETipoCredito : listarPorPerfilETipoCredito
		}

		function pesquisar() {
			return $http.get(URI_REST_API_LIST);
		}

		function pesquisarPorId(idTransportadora) {
			return $http.get(URI_REST_API + '/' + idTransportadora);
		}

		function criar(transportadora){
			return $http.post(URI_REST_API, transportadora);
		}

		function alterar(transportadora){
			return $http.put(URI_REST_API, transportadora);
		}

		function pesquisarPorCriterios(transportadora) {
			return $http.post(URI_REST_API_LIST + '/criterios', transportadora);
		}

		function pesquisarPorCriteriosPagina(transportadora, pagina, registrosPorPagina) {
			return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, transportadora);
		}

		function listarTodos() {
			return $http.get(URI_REST_API_LIST);
		}

		function listarPorPerfilETipoCredito(idPerfil, idTipoCredito) {
			return $http.get(URI_REST_API_LIST + '/perfil/' + idPerfil + '?tipoCredito=' + idTipoCredito);
		}

		return service;
	}
);
