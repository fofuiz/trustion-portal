angular.module('trustionPortal').controller('AlteracaoStatusOcorrenciaD1Controller', function($scope, $uibModalInstance, ocorrencia, TipoStatusOcorrenciaService, OcorrenciaD1Service, UTF8){

    $scope.listaTipoStatusOcorrencia = [];
    $scope.ocorrencia = {};
    $scope.ocorrencia.idOcorrencia = ocorrencia.idOcorrencia;

    function exibirMensagemErro(mensagem){
		$scope.isExibirMensagemErro = true;
		$scope.mensagemErro = mensagem;
	}
	
	function ocultarMensagemErro(){
		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
	}

    loadPage();
    
    function loadPage() {
        if(!ocorrencia.concluido){
            TipoStatusOcorrenciaService.listar().then(
                function successCallback(res) {
                    $scope.listaTipoStatusOcorrencia = res.data;
    
                }, function errorCallback(res) {
                    if(res.data != null && res.data.hasOwnProperty('mensagem')){
                        exibirMensagemErro(res.data.mensagem);
                    }else{
                        exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.');
                    }
                }
            );

        }else{

            TipoStatusOcorrenciaService.listarReabertura().then(
                function successCallback(res) {
                    $scope.listaTipoStatusOcorrencia = res.data;
    
                }, function errorCallback(res) {
                    if(res.data != null && res.data.hasOwnProperty('mensagem')){
                        exibirMensagemErro(res.data.mensagem);
                    }else{
                        exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.');
                    }
                }
            );

        }
    }

    $scope.salvar = function() {

        ocultarMensagemErro();
        
            console.log('--> AlteracaoStatusOcorrenciaD1Controller.salvar');
            
            if($scope.ocorrencia.idTipoStatusOcorrencia == undefined || $scope.ocorrencia.idTipoStatusOcorrencia == '') {
                exibirMensagemErro('Favor, escolher o tipo do status');
                return;
            }

            if($scope.ocorrencia.observacao == undefined || $scope.ocorrencia.observacao == '') {
                exibirMensagemErro('Favor, preencher a ' + UTF8.observacao);
                return;
            }

            OcorrenciaD1Service.alterarStatus($scope.ocorrencia).then(
                function successCallback(res) {

                    console.log('<-- AlteracaoStatusOcorrenciaD1Controller.salvar.sucesso');
                    $uibModalInstance.close();

                }, function errorCallback(res) {

                    console.log('<-- AlteracaoStatusOcorrenciaD1Controller.salvar.erro');
                    if(res.data != null && res.data.hasOwnProperty('mensagem')){
                        exibirMensagemErro(res.data.mensagem);
                    }else{
                        exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' alterar o status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.');
                    }
                }
            );
    }
        
        
    $scope.cancelar = function() {
        $uibModalInstance.dismiss();
    }

});