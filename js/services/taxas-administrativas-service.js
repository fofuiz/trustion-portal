angular.module('trustionPortal').factory('TaxasAdministrativasService', function($http, EnvironmentService){
	
	var _getTaxasAdministrativas = function(filtro) {
		return $http.post(EnvironmentService.getEnvironment() + "taxaadministrativa/cadastro", filtro);
    };

    var _getTaxasAdministrativasCriterios = function(filtro, pagina, registrosPorPagina) {

        
        if((pagina != null) && (registrosPorPagina != null)) {
            return $http.post(EnvironmentService.getEnvironment() + "taxaadministrativa/criterios/page?page=" + pagina + "&size=" + registrosPorPagina , filtro);
        }

        return $http.post(EnvironmentService.getEnvironment() + "taxaadministrativa/criterios" , filtro);
    }

    
    var _taxaAdministrativaSalvar = function(taxasAdministrativas) {
        return $http.post(EnvironmentService.getEnvironment() + "taxaadministrativa/salvar", taxasAdministrativas);
    }



	return {
        getTaxasAdministrativas: _getTaxasAdministrativas,
        getTaxasAdministrativasCriterios: _getTaxasAdministrativasCriterios,
        taxaAdministrativaSalvar: _taxaAdministrativaSalvar
	};
});