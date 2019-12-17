angular.module('trustionPortal').factory('LogApiService', function ($http, EnvironmentService) {

	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "logsApi";

	var service = {
		listaCriteriosPage: listaCriteriosPage
	};

	function listaCriteriosPage(log, paginaSelecionada, tamanhoPagina) {
		return $http.post(URI_REST_API_LIST + '/criterio/page?page=' + paginaSelecionada + '&size=' + tamanhoPagina, log);
	}

	return service;
});