angular.module('trustionPortal').controller('RedefinicaoSenhaPrimeiroAcessoController', 
	function($scope, $rootScope, $state, $stateParams, UsuarioService, CacheService, $http) {

		//retira a imagem da tela de login
		$rootScope.imageback = '';

		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';

		$scope.redefinicaoSenha = {};

		$scope.redefinirSenha = function(){

			console.log('--> RedefinicaoSenhaPrimeiroAcessoController.redefinirSenha');

			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';

			if($scope.formRedefinicaoSenha.$valid) {

				console.log('--> RedefinicaoSenhaPrimeiroAcessoController.formRedefinicaoSenha.valido');

				UsuarioService.redefinirSenha($scope.redefinicaoSenha).then(
					function successCallback(retorno) {
						delete $http.defaults.headers.common['Authorization'];
						CacheService.usuario = undefined;
						//console.log($http.defaults.headers.common['Authorization']);
						//console.log(CacheService.usuario);
						$state.go('login');

					}, function errorCallback(retorno) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = retorno.data.mensagem;
						console.log('--> RedefinicaoSenhaPrimeiroAcessoController.redefinirSenha.errorCallback');
					}
				);

			} else {
				console.log('--> RedefinicaoSenhaPrimeiroAcessoController.formRedefinicaoSenha.invalido');
				$scope.isExibirMensagemErro = true;

				if($scope.redefinicaoSenha.senhaAtual == undefined || $scope.redefinicaoSenha.senhaAtual == ''){
					$scope.mensagemErro = 'Favor, informe a senha atual.';
					return;
				}

				if($scope.redefinicaoSenha.novaSenha == undefined || $scope.redefinicaoSenha.novaSenha == ''){
					$scope.mensagemErro = 'Favor, informe a nova senha.';
					return;
				}

				if($scope.redefinicaoSenha.confirmaNovaSenha == undefined || $scope.redefinicaoSenha.confirmaNovaSenha == ''){
					$scope.mensagemErro = 'Favor, confirme a nova senha.';
					return;
				}
			}
		}

	}
);