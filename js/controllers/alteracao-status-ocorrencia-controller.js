angular.module('trustionPortal').controller('AlteracaoStatusOcorrenciaController', 
	function($scope, $state, $uibModalInstance, ocorrencia, TipoStatusOcorrenciaService, OcorrenciaService, UTF8) {

		$scope.listaTipoStatusOcorrencia = [];
		$scope.ocorrencia = {};
		$scope.ocorrencia.idOcorrencia = ocorrencia.idOcorrencia;


		loadPage();


		function loadPage() {

			if(!ocorrencia.concluido){
				TipoStatusOcorrenciaService.listar().then(
					function successCallback(res) {
						$scope.listaTipoStatusOcorrencia = res.data;
	
					}, function errorCallback(res) {
						if(res.data != null && res.data.hasOwnProperty('mensagem')){
							$scope.mensagemErro = res.data.mensagem;
							$scope.isExibirMensagemErro = true;
						}else{
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.';
						}
					}
				);
			}else{
				TipoStatusOcorrenciaService.listarReabertura().then(
					function successCallback(res) {
						$scope.listaTipoStatusOcorrencia = res.data;
	
					}, function errorCallback(res) {
						if(res.data != null && res.data.hasOwnProperty('mensagem')){
							$scope.mensagemErro = res.data.mensagem;
							$scope.isExibirMensagemErro = true;
						}else{
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.';
						}
					}
				);
			}
		}


		$scope.salvar = function() {

			console.log('--> AlteracaoStatusOcorrenciaController.salvar');
			
			if($scope.ocorrencia.idTipoStatusOcorrencia == undefined || $scope.ocorrencia.idTipoStatusOcorrencia == '') {
				$scope.mensagemErro = 'Favor, escolher o tipo do status';
				$scope.isExibirMensagemErro = true;
				return;
			}

			if($scope.ocorrencia.observacao == undefined || $scope.ocorrencia.observacao == '') {
				$scope.mensagemErro = 'Favor, preencher a ' + UTF8.observacao;
				$scope.isExibirMensagemErro = true;
				return;
			}

			OcorrenciaService.alterarStatus($scope.ocorrencia).then(
				function successCallback(res) {

					console.log('<-- AlteracaoStatusOcorrenciaController.salvar.sucesso');
					$uibModalInstance.close();

				}, function errorCallback(res) {

					console.log('<-- AlteracaoStatusOcorrenciaController.salvar.erro');
					$scope.mensagemErro = res.data.mensagem;
					$scope.isExibirMensagemErro = true;
				}
			);
		}


		$scope.cancelar = function() {
			$uibModalInstance.dismiss();
		}

	}
);