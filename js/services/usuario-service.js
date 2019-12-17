angular.module('trustionPortal').factory('UsuarioService', 
	function($http, EnvironmentService) {

		var URI_REST_API = EnvironmentService.getEnvironment() + "usuario";
		var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "usuarios";
		var URI_REST_API_REDEFINIR_SENHA = EnvironmentService.getEnvironment() + "redefinirSenha";
		var URI_REST_API_ESQUECEU_SENHA = EnvironmentService.getEnvironment() + "esqueceuSenha";
		var URI_REST_API_BUSCAR_EMPRESA = EnvironmentService.getEnvironment() + "user/empresaCa";

		var service = {
			pesquisar: pesquisar,
			pesquisarPorId: pesquisarPorId,
			criar: criar,
			alterar: alterar,
			pesquisarPorCriterios: pesquisarPorCriterios,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
			redefinirSenha: redefinirSenha,
			esqueceuSenha: esqueceuSenha,
			buscarEmpresa: buscarEmpresa
		}

		function pesquisar() {
			return $http.get(URI_REST_API_LIST);
		}

		function pesquisarPorId(idUsuario) {
			return $http.get(URI_REST_API + '/' + idUsuario);
		}

		function criar(usuario){
			return $http.post(URI_REST_API, usuario);
		}

		function alterar(usuario){
			return $http.put(URI_REST_API, usuario);
		}

		function pesquisarPorCriterios(usuario, pagina, registrosPorPagina) {
			return $http.post(URI_REST_API_LIST + '/criterios', usuario);
		}

		function pesquisarPorCriteriosPagina(usuario, pagina, registrosPorPagina) {
			return $http.post(URI_REST_API_LIST + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, usuario);
		}

		function redefinirSenha(redefinicaoSenha) {
			return $http.put(URI_REST_API_REDEFINIR_SENHA, redefinicaoSenha);
		}
		
		function esqueceuSenha(esqueceuSenha) {
			return $http.put(URI_REST_API_ESQUECEU_SENHA, esqueceuSenha);
		}

		function buscarEmpresa() {
			return $http.get(URI_REST_API_BUSCAR_EMPRESA);
		}

		return service;
	}
);
