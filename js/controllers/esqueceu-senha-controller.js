angular.module('trustionPortal').controller('EsqueceuSenhaController', 
	function($scope, $rootScope, UsuarioService, UTF8) {
		
		//tira a imagem de fundo
		$rootScope.imageback = '';

		$scope.esqueceuSenha = function(){

			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';
			
			if($scope.formEsqueceuSenha.$valid) {
				
				UsuarioService.esqueceuSenha($scope.esqueceuSenhaDTO).then(
						
						function successCallback(res) {
							$scope.isExibirMensagemSucesso = true;
							$scope.mensagemSucesso = 'A nova senha foi enviada para o endere'+UTF8.cDilha+'o de e-mail '+ res.data.email;
								
						},

						function errorCallback(res) {
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = res.data.mensagem;
						}
					);
				
			}
			
		}
	
	}
);