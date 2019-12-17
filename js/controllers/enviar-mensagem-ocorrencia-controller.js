angular.module('trustionPortal').controller('EnviarMensagemOcorrenciaController', function($scope, $uibModalInstance, ocorrencia, AtividadeService, UTF8){
	
	$scope.atividade = {};
	$scope.atividade.idOcorrencia = ocorrencia.idOcorrencia;
	$scope.atividade.tipoAtividade = 'M';
	
	$scope.salvar = function(){
		
		if($scope.atividade.atividade == undefined || $scope.atividade.atividade == ''){
			$scope.isExibirMensagemErro = true;
			$scope.mensagemErro = 'Favor, preencher o campo de mensagem.';
			return;
		}
		
		AtividadeService.criar($scope.atividade).then(function successCallback(res){
			$uibModalInstance.close();
		}, function errorCallback(res){
			$scope.isExibirMensagemErro = true;
			$scope.mensagemErro = res.data.mensagem;
		});
	};
	
	$scope.cancelar = function(){
		$uibModalInstance.dismiss();
	}
});