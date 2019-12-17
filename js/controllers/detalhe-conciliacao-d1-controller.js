angular.module('trustionPortal').controller('DetalheConciliacaoD1Controller', function($scope, $uibModalInstance, relatorio, ExtratoElegivelService){

    $scope.relatorio = relatorio;
    $scope.listaExtratoElegivel = [];


    function exibirMensagemErro(mensagem){
        $scope.mensagemErro = mensagem;
        $scope.isExibirMensagemErro = true;
    }

    function ocultarMensagemErro(){
        $scope.mensagemErro = '';
        $scope.isExibirMensagemErro = false;
    }

    function loadPage(){
        ocultarMensagemErro();
        ExtratoElegivelService.listarPorIdRelatorioAnalitico($scope.relatorio.idRelatorioAnalitico).then(function successCallback(res){
            if(res.data == ''){
                exibirMensagemErro('Nenhum registro de extrato encontrado.');
                return;
            }

            $scope.listaExtratoElegivel = res.data;

        }, function errorCallback(res){
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
				exibirMensagemErro(res.data.mensagem);
			}else{
				exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os extratos. Favor, entrar em contato com o administrador do sistema.');
			}
        });
    }

    loadPage();

    $scope.desconciliar = function(){

        ExtratoElegivelService.desconciliar($scope.relatorio.idConciliacao).then(function successCallback(res){
            $uibModalInstance.close('sucesso');
        }, function errorCallback(res){
            exibirMensagemErro(res.data.mensagem);
        });
    }

    $scope.voltar = function(){
        $uibModalInstance.close();
    }

});