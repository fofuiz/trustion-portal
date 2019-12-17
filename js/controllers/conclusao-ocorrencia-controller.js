angular.module('trustionPortal').controller('ConclusaoOcorrenciaController', function ($scope, $state, $uibModalInstance, ocorrencia, atividade, TipoStatusOcorrenciaService, OcorrenciaService, GrupoEconomicoService, AtividadeService, TipoMotivoOcorrenciaService, UTF8) {
	 
	$scope.ocorrencia = {};
	$scope.ocorrencia = ocorrencia;
	$scope.atividade = {};
	$scope.atividade = atividade;
	$scope.listaGrupoEconomico = [];

	$scope.aprovar = function () {

		$scope.atividade.idOcorrencia = $scope.ocorrencia.idOcorrencia;

		AtividadeService.aprovar($scope.atividade).then(
			function successCallback(res) {
				$scope.listaGrupoEconomico = res.data;
				
				$scope.mensagemSucesso = 'O status da ' + UTF8.ocorrencia + ' foi alterado para concluido.';
				$scope.isExibirMensagemSucesso = true;
				$scope.isExibirMensagemErro = false;
				document.getElementById("btnAprovar").disabled = true;
				document.getElementById("btnRejeitar").disabled = true;

			}, function errorCallback(res) {
				if (res.data != null && res.data.hasOwnProperty('mensagem')) {
					$scope.mensagemErro = UTF8.Nao +' foi '+UTF8.possivel +' aprovar, o '+UTF8.usuario+ ' '+UTF8.eAgudo+' o mesmo que solicitou' ;
					$scope.isExibirMensagemErro = true;
					$scope.isExibirMensagemSucesso = false;
				} 
			}
		);
	}

	$scope.rejeitar = function(){
		  
		$scope.atividade.idOcorrencia = $scope.ocorrencia.idOcorrencia;

		AtividadeService.rejeitar($scope.atividade).then(
			function successCallback(res) {
				$scope.listaGrupoEconomico = res.data;
				
				$scope.mensagemSucesso = 'O status da ' + UTF8.ocorrencia + ' foi alterado para '+ UTF8.Nao+' aprovado.';
				$scope.isExibirMensagemSucesso = true;
				$scope.isExibirMensagemErro = false;
				document.getElementById("btnRejeitar").disabled = true;
				document.getElementById("btnAprovar").disabled = true;

			}, function errorCallback(res) {
				if (res.data != null && res.data.hasOwnProperty('mensagem')) {
					$scope.mensagemErro = UTF8.Nao +' foi '+UTF8.possivel +' rejeitar, o '+UTF8.usuario+ ' '+UTF8.eAgudo+' o mesmo que solicitou.' ;
					$scope.isExibirMensagemErro = true;
					$scope.isExibirMensagemSucesso = false;
				} 
			}
		);
	}

	$scope.cancelar = function () {
		$uibModalInstance.dismiss();
	}

});