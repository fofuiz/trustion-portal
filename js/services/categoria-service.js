angular.module('trustionPortal').factory('CategoriaService', 
	function($http, EnvironmentService) {

		var URI_REST_API = EnvironmentService.getEnvironment() + "categorias";
		
		var service = {
			pesquisar: pesquisar,
			pesquisarPorId: pesquisarPorId,
			criar: criar,
			alterar: alterar,
			pesquisarPorCriterios: pesquisarPorCriterios,
			pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
		}

		function pesquisar() {
			return $http.get(URI_REST_API_LIST);
		}

		function pesquisarPorId(idCategoria) {
			return $http.get(URI_REST_API + '/' + idCategoria);
		}

		function criar(categoria){
			return $http.post(URI_REST_API, categoria);
		}

		function alterar(categoria){
			return $http.put(URI_REST_API, categoria);
		}

		function pesquisarPorCriterios(categoria, pagina, registrosPorPagina) {
			return $http.post(URI_REST_API + '/criterios', categoria);
		}

		function pesquisarPorCriteriosPagina(categoria, pagina, registrosPorPagina) {
			return $http.post(URI_REST_API + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, categoria);
		}

		return service;
	}
);
