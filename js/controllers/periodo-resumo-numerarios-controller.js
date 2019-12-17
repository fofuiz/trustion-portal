angular.module('trustionPortal').controller('PeriodoResumoNumerariosController', function($scope, PeriodoResumoNumerariosService, UTF8){

    $scope.entidade = {};

    function exibirMensagemErro(mensagem){
        $scope.mensagemErro = mensagem;
        $scope.isExibirMensagemErro = true;
    }

    function ocultarMensagemErro(){
        $scope.mensagemErro = '';
        $scope.isExibirMensagemErro = false;
    }

    function exibirMensagemSucesso(mensagem){
        $scope.mensagemSucesso = mensagem;
        $scope.isExibirMensagemSucesso = true;
    }

    function ocultarMensagemSucesso(){
        $scope.mensagemSucesso = '';
        $scope.isExibirMensagemSucesso = false;
    }

    function loadPage(){
        PeriodoResumoNumerariosService.consultar().then(
            function successCallback(res) {
                console.log(res);
                $scope.entidade.periodoColeta = res.data.periodoColeta;
                $scope.entidade.periodoConferencia = res.data.periodoConferencia;
                $scope.entidade.periodoCredito = res.data.periodoCredito;
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os valores de coleta, ' + UTF8.conferencia + ' e ' + UTF8.credito + ' em conta. Favor, entrar em contato com o administrador do sistema.');
                }
            });
    }

    loadPage();


    $scope.alterarPeriodoResumo = function(isValid){
        ocultarMensagemErro();
        ocultarMensagemSucesso();
        if(isValid){

            if(validarTamanho()){
                return;
            }

            PeriodoResumoNumerariosService.alterar($scope.entidade).then(
                function successCallback(res){
                    if(res.data != null){
                        $scope.entidade.periodoColeta = res.data.periodoColeta;
                        $scope.entidade.periodoConferencia = res.data.periodoConferencia;
                        $scope.entidade.periodoCredito = res.data.periodoCredito;
                        exibirMensagemSucesso(UTF8.Periodo + ' de resumo de ' + UTF8.numerarios + ' alterado com sucesso!');
                    }
                },
                function errorCallback(res){
                    if(res.data != null && res.data.hasOwnProperty('mensagem')){
                        exibirMensagemErro(res.data.mensagem);
                    }else{
                        exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' alterar os valores de coleta, ' + UTF8.conferencia + ' e ' + UTF8.credito + ' em conta. Favor, entrar em contato com o administrador do sistema.');
                    }
                }
            );

        }else {
            if($scope.entidade.periodoColeta == undefined || $scope.entidade.periodoColeta == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' de coleta ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if($scope.entidade.periodoConferencia == undefined || $scope.entidade.periodoConferencia == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' da ' + UTF8.conferencia + ' ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if($scope.entidade.periodoCredito == undefined || $scope.entidade.periodoCredito == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' de ' + UTF8.credito + ' ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if(validarTamanho()){
                return;
            }
        }
    }

    function validarTamanho(){
        if($scope.entidade.periodoColeta < 0 || $scope.entidade.periodoColeta > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo da coleta ' + UTF8.eAgudo + ' de 60 dias.');
             return true;
        }

        if($scope.entidade.periodoConferencia < 0 || $scope.entidade.periodoConferencia > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo da ' + UTF8.conferencia + ' ' + UTF8.eAgudo + ' de 60 dias.');
            return true;
        }

        if($scope.entidade.periodoCredito < 0 || $scope.entidade.periodoCredito > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo do ' + UTF8.credito + ' em conta ' + UTF8.eAgudo + ' de 60 dias.');
            return true;
        }

        return false;
    }

});