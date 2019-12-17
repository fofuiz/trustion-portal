angular.module('trustionPortal').controller('ConciliacaoManualD1Controller', function($scope, $uibModalInstance, relatorio, ExtratoElegivelService, UTF8){
    $scope.relatorio = relatorio;
    $scope.listaExtratoElegivel = [];
    var ExtratosConciliados = [];
    
    
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
        ExtratoElegivelService.listarPorIdRelatorioAnaliticoExtratosElegiveis($scope.relatorio.idRelatorioAnalitico).then(
            function successCallback(res){
                if(res.data == ''){
                    exibirMensagemErro('Nenhum registro de extrato encontrado.');
                    return;
                }
                $scope.listaExtratoElegivel = res.data;
            },
            function errorCallback(res){
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os extratos. Favor, entrar em contato com o administrador do sistema.');
                }
            });
    }

    loadPage();

    var getTodosSelecionados = function () {
        var itensSelecionados = $scope.listaExtratoElegivel.filter(function (item) {
            return item.selecionado;
        });
        
        return itensSelecionados.length === $scope.listaExtratoElegivel.length;
    }
    
    var setTodosSelecionados = function (value) {
        angular.forEach($scope.listaExtratoElegivel, function (item) {
            item.selecionado = value;
        });
    }

    $scope.selecionarTodos = function (value) {
        if (value !== undefined) {
            return setTodosSelecionados(value);
        } else {
            return getTodosSelecionados();
        }
    }

    $scope.conciliar = function(){
        ocultarMensagemErro();
        for(i = 0; i<$scope.listaExtratoElegivel.length; i++){
            if($scope.listaExtratoElegivel[i].hasOwnProperty('selecionado') && $scope.listaExtratoElegivel[i].selecionado){
                var extrato = {};
                extrato.idExtElegivel = $scope.listaExtratoElegivel[i].idExtElegivel;
                ExtratosConciliados.push(extrato);
            }
        }
        //console.log(JSON.stringify(ExtratosConciliados));
        if(ExtratosConciliados && ExtratosConciliados.length){   

            ExtratoElegivelService.conciliar($scope.relatorio.idRelatorioAnalitico, ExtratosConciliados).then(function sucessCallback(res){
                $uibModalInstance.close('sucesso');
            }, function errorCallback(res){
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' conciliar. Favor, entrar em contato com o administrador do sistema.');
            });
            
         } else {
            exibirMensagemErro('Selecione pelo menos um registro de extrato.');
            return;
         }

    }

    $scope.voltar = function(){
        $uibModalInstance.close();
    }
});