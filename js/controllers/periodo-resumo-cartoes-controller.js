angular.module('trustionPortal').controller('PeriodoResumoCartoesController', function($scope, PeriodoResumoCartoesService, UTF8){

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


    function  loadPage() {
        ocultarMensagemErro();
        PeriodoResumoCartoesService.consultar().then(
            function successCallback(res) {
                if(res.data.length <= 0){
                    exibirMensagemErro('Nenhum registro encontrado');
                    return;
                }

                $scope.entidade.periodoVenda = res.data.periodoVenda;
                $scope.entidade.periodoRecebimento = res.data.periodoRecebimento;
                $scope.entidade.periodoRecebimentoFuturo = res.data.periodoRecebimentoFuturo;

            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os valores de vendas, recebimentos e recebimentos futuros. Favor, entrar em contato com o administrador do sistema.');
                }
            })
    }

    loadPage();
    
    
    $scope.alterarPeriodoResumo = function (isValid) {
        ocultarMensagemErro();
        ocultarMensagemSucesso();

        if(isValid){

            if(validarTamanho()){
                return;
            }

            PeriodoResumoCartoesService.alterar($scope.entidade).then(
                function successCallback(res) {
                    if(res.data != null){
                        $scope.entidade.periodoVenda = res.data.periodoVenda;
                        $scope.entidade.periodoRecebimento = res.data.periodoRecebimento;
                        $scope.entidade.periodoRecebimentoFuturo = res.data.periodoRecebimentoFuturo;
                        exibirMensagemSucesso(UTF8.Periodo + ' de resumo de ' + UTF8.cartoes + ' alterado com sucesso!');
                    }
                },
                function errorCallback(res) {
                    if(res.data != null && res.data.hasOwnProperty('mensagem')){
                        exibirMensagemErro(res.data.mensagem);
                    }else{
                        exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' alterar os valores de vendas, recebimentos e recebimentos futuros. Favor, entrar em contato com o administrador do sistema.');
                    }
                });

        }else {
            console.log($scope.periodoVenda);

            if($scope.entidade.periodoVenda == undefined || $scope.entidade.periodoVenda == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' de venda ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if($scope.entidade.periodoRecebimento == undefined || $scope.entidade.periodoRecebimentoFuturo == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' de recebimento ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if($scope.entidade.periodoRecebimentoFuturo == undefined || $scope.entidade.periodoRecebimentoFuturo == ''){
                exibirMensagemErro('O campo ' + UTF8.periodo + ' de recebimento futuro ' + UTF8.eAgudo + ' ' + UTF8.obrigatorio);
                return;
            }

            if(validarTamanho()){
                return;
            }
        }

    }

    function validarTamanho(){
        if($scope.entidade.periodoVenda < 0 || $scope.entidade.periodoVenda > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo de vendas ' + UTF8.eAgudo + ' de 60 dias.');
            return true;
        }

        if($scope.entidade.periodoRecebimento < 0 || $scope.entidade.periodoRecebimento > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo de recebimentos ' + UTF8.eAgudo + ' de 60 dias.');
            return true;
        }

        if($scope.entidade.periodoRecebimentoFuturo < 0 || $scope.entidade.periodoRecebimentoFuturo > 60){
            exibirMensagemErro('O ' + UTF8.numero + ' ' + UTF8.maximo + ' de dias para o resumo de recebimentos futuros ' + UTF8.eAgudo + ' de 60 dias.');
            return true;
        }

        return false;
    }
});