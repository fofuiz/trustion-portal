angular.module('trustionPortal').controller('EnviarMensagemOcorrenciaD1Controller', function($scope, $uibModalInstance, ocorrencia, AtividadeD1Service, UTF8){
    $scope.atividade = {};
	$scope.atividade.idOcorrencia = ocorrencia.idOcorrencia;
    $scope.atividade.tipoAtividade = 'M';

    function exibirMensagemErro(mensagem){
		$scope.isExibirMensagemErro = true;
		$scope.mensagemErro = mensagem;
	}
	
	function ocultarMensagemErro(){
		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
	} 
    
    $scope.salvar = function(){
		
		if($scope.atividade.atividade == undefined || $scope.atividade.atividade == ''){
			exibirMensagemErro('Favor, preencher o campo de mensagem.');
			return;
		}
		
		AtividadeD1Service.criar($scope.atividade).then(function successCallback(res){
			$uibModalInstance.close();
		}, function errorCallback(res){
			if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UT8.possivel + ' inserir a mensagem. Favor, entrar em contato com o administrador do sistema.');
            }
		});
	};
	
	$scope.cancelar = function(){
		$uibModalInstance.dismiss();
	}
});