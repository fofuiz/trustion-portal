angular.module('trustionPortal').factory('GrupoEconomicoService', function ($http, CacheService, EnvironmentService) {
	var URI_REST_API = EnvironmentService.getEnvironment() + "grupoEconomico";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "gruposEconomicos";

	var service = {
		cadastra: cadastraGrupo,
		altera: alteraGrupo,
		lista: listaGrupo,
		listaGrupoPage: listaGrupoPage,
		listarTodos: listarTodos,
		listaPorPerfilUsuario: listaPorPerfilUsuario,
		pesquisarGrupo: pesquisarGrupo
	}

	function cadastraGrupo(grupo) {
		return $http.post(URI_REST_API, grupo);
	}

	function alteraGrupo(grupo) {
		return $http.put(URI_REST_API, grupo);
	}

	function listarTodos() {
		return $http.get(URI_REST_API_LIST);
	}

	function listaGrupo(grupo) {
		return $http.post(URI_REST_API_LIST + '/criterio', grupo);
	}

	function listaGrupoPage(grupo, pagina, registrosPorPagina) {
		return $http.post(URI_REST_API_LIST + '/criterio/page?page=' + pagina + '&size=' + registrosPorPagina, grupo);
	}

	function listaPorPerfilUsuario(idPerfil) {
		return $http.get(URI_REST_API_LIST + '/perfil/' + idPerfil);
	}

	function pesquisarGrupo(id) {
		return $http.get(URI_REST_API + '/' + id);
	}

	return service;
});