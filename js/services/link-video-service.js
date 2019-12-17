angular.module('trustionPortal').factory('LinkVideoService', function($http, EnvironmentService) {

	var REST_URI = EnvironmentService.getEnvironment() + 'link';

	var service = {
		listarLinks : listarLinks
	}
	
	function listarLinks(gtv) {        
        return $http.get(REST_URI + "/" + gtv);
	}

	return service;
	
});