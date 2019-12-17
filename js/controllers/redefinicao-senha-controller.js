angular.module('trustionPortal').controller('RedefinicaoSenhaController', 
	function($scope, $state, $stateParams, UsuarioService, CacheService) {

		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';

		$scope.redefinicaoSenha = {};

		$scope.redefinirSenha = function(){

			console.log('--> RedefinicaoSenhaController.redefinirSenha');

			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';

			if($scope.formRedefinicaoSenha.$valid) {

				console.log('--> RedefinicaoSenhaController.formRedefinicaoSenha.valido');

				UsuarioService.redefinirSenha($scope.redefinicaoSenha).then(
					function successCallback(retorno) {

						$state.go('login');

					}, function errorCallback(retorno) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = retorno.data.mensagem;
						console.log('--> RedefinicaoSenhaController.redefinirSenha.errorCallback');
					}
				);

			} else {
				console.log('--> RedefinicaoSenhaController.formRedefinicaoSenha.invalido');
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