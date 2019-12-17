angular.module('trustionPortal').factory('PerfilService', 
	function($http, EnvironmentService) {

		var API_LIST_PERFIL_CADASTRO = EnvironmentService.getEnvironment() + "perfisCadastro";
		var API_LIST_PERFIL_PESQUISA = EnvironmentService.getEnvironment() + "perfisPesquisa";

		var service = {
			listarTodosCadastro: listarTodosCadastro,
			listarTodosPesquisa: listarTodosPesquisa
		}

		function listarTodosCadastro() {
			return $http.get(API_LIST_PERFIL_CADASTRO);
		}

		function listarTodosPesquisa() {
			return $http.get(API_LIST_PERFIL_PESQUISA);
		}

		return service;
	}
);