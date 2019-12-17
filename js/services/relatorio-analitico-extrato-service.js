angular.module('trustionPortal').factory('RelatorioAnaliticoExtratoService', function ($http, EnvironmentService) {

  var URI_REST_API_LIST_PAGE = EnvironmentService.getEnvironment() + 'relAnaliticoExtrato';

  var service = {
    pesquisarPorCriteriosPagina: pesquisarPorCriteriosPagina,
    pesquisarPorCriteriosExport: pesquisarPorCriteriosExport
  }


  function pesquisarPorCriteriosPagina(filtroRelAnaliticoExtrato, pagina, registrosPorPagina) {
    return $http.post(URI_REST_API_LIST_PAGE + '/criterios/page?page=' + pagina + '&size=' + registrosPorPagina, filtroRelAnaliticoExtrato);
  }

  
  function pesquisarPorCriteriosExport(filtroRelAnaliticoExtrato) {
		return $http.post(URI_REST_API_LIST_PAGE + '/exportar', filtroRelAnaliticoExtrato);
  }

  return service;
});
