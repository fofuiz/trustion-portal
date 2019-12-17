angular.module('trustionPortal').factory('LoginService', 
	function($http, EnvironmentService,CacheService){

		var REST_URI_USER = EnvironmentService.getEnvironment() + 'user';

		var service = {
			autentica: autenticaUsuario
		}
		
		function autenticaUsuario(code) {
		    localStorage.setItem("token",code);
			var retorno = $http.post(REST_URI_USER,{}, {
				headers:{'Authorization': 'Basic ' + code}
			});

			return retorno;
		}
		
		return service;
	}
);