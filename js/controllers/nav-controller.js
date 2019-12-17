angular.module('trustionPortal').controller('NavController', function($scope, CacheService, $state, $http){
	if(CacheService.usuario != null){		
		var name = CacheService.usuario.data.principal.nome;
		if(name != undefined || name != null){
			var arrays = name.split(" ");;
			$scope.nome = arrays[0];
		}
	}

    $scope.logout = function(){
        delete $http.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('routeChange');
        CacheService.usuario = undefined;
        //console.log($http.defaults.headers.common['Authorization']);
        //console.log(CacheService.usuario);
        $state.go('login');
    }
});