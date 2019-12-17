angular.module('trustionPortal').factory('MenuService', function($http, EnvironmentService){
	
	var URI_REST_API = EnvironmentService.getEnvironment() + 'menuRelatorio';
	
	var service = {
		menuRelatorio: menuRelatorio	
	}
	
	function menuRelatorio(){
		return $http.get(URI_REST_API);
	}
	
	return service;
});