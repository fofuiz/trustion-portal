angular.module('trustionPortal').controller('LoginController', 
	function($scope, $state, $rootScope, $http, CacheService, LoginService, UsuarioService, UTF8) {

		//carrega da imagem do plano de fundo
		$rootScope.imageback = 'imagemfundo';

		$scope.login = function() {

			if($scope.frmLogin.$valid) {

				$scope.isDadosInvalidos = false;
				$scope.mensagem = '';
				var code64Credential = btoa($scope.usuario + ':' + $scope.senha);

				LoginService.autentica(code64Credential).then(
	
					function successCallback(res) {
						$scope.senha = null;

						if (res.data.authenticated) {

							$http.defaults.headers.common['Authorization'] = 'Basic ' + code64Credential;
							CacheService.usuario = res;
							$rootScope.$broadcast('LoginSuccessful');

							UsuarioService.pesquisarPorId(res.data.principal.idUsuario).then(
								function successCallback(retorno) {

									if (retorno.data.primeiroAcesso) {
										$state.go('redefinirSenha');
									} else {
										$state.go('home');
									}

								}, function errorCallback(retorno) {
									$scope.isExibirMensagemErro = true;
									$scope.mensagemErro = retorno.data.mensagem;
								}
							);

						} else {
							$scope.mensagem = 'Sistema '+UTF8.indisponivel+'.';
						}
					},

					function errorCallback(res) {
						$scope.mensagem = UTF8.Usuario+' ou senha '+UTF8.invalido+'!';
						$scope.isDadosInvalidos = true;
					}
				);

			} else {
				$scope.mensagem = 'Favor, informe o '+UTF8.usuario+' e senha.';
				$scope.isDadosInvalidos = true;
			}
		}
		function LoginFunction() {
			$scope.isDadosInvalidos = false;
            $scope.mensagem = '';
            var code64Credential = "";
            if (localStorage.getItem("token")) {
                code64Credential = localStorage.getItem("token");
                if(code64Credential === "" || code64Credential === undefined)
                    return;
                $("div.div-box")[0].style.display = "none";
			}
			
			LoginService.autentica(code64Credential).then(
    
				function successCallback(res) {

					$scope.senha = null;
					if (res.data.authenticated) {
						$http.defaults.headers.common['Authorization'] = 'Basic ' + code64Credential;
						CacheService.usuario = res;
						UsuarioService.pesquisarPorId(res.data.principal.idUsuario).then(
							function successCallback(retorno) {
								if(localStorage.getItem("routeChange"))
								{
									$state.transitionTo(localStorage.getItem("routeChange"), {
										location: true,
										inherit: true,
										relative: $state.$current,
										notify: false
									});
							}
							else
							{
								$state.go('home');
							}
								
							}, function errorCallback(retorno) {
								
							}
						);
					} else {
						
					}
				},
				function errorCallback(res) {
				}
			);
		}
		LoginFunction();
	}
		
);