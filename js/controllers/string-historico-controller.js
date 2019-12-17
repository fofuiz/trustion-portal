angular.module('trustionPortal').controller('StringHistoricoController', function ($scope, $stateParams, ListaBancoService, StringHistoricoService, CacheService, UTF8) {

    $scope.filtroStringHistorico = {};
    $scope.novoStringHistorico = {};
    $scope.alteraStringHistorico = {};
    $scope.filtroStringHistoricoPage = {};
    $scope.listaStringHistorico = [];
    $scope.listaBanco = [];
    $scope.listaStatus = ["Ativo", "Inativo"];

    function configurarPaginacao() {
        $scope.pag_desabilitado = false;
        $scope.pag_tamanho = 5;
        $scope.pag_registrosPorPagina = 5;
        $scope.pag_totalRegistros = 0;
        $scope.pag_paginaSelecionada = 0;
    }

    function loadPage() {
        $scope.hideMessage();

        ListaBancoService.listarTodosBancos().then(function successCallback(res) {
            $scope.listaBanco = res.data;
        }, function errorCallback(res) {
            if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                $scope.showErrorMessage(res.data.mensagem);
            } else {
                $scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os bancos. Por favor, entrar em contato com o administrador do sistema.');
            }
        });

        if ($stateParams.idStringHistorico) {
            StringHistoricoService.perquisarPorId($stateParams.idStringHistorico).then(function successCallback(res) {
                $scope.alteraStringHistorico.idStringHistorico = res.data.idStringHistorico;
                $scope.alteraStringHistorico.idListaBanco = res.data.idListaBanco;
                $scope.alteraStringHistorico.texto = res.data.texto;
                $scope.alteraStringHistorico.status = res.data.status;

            }, function errorCallback(res) {
                if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                    $scope.showErrorMessage(res.data.mensagem);
                } else {
                    $scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Por favor, entrar em contato com o administrador do sistema.');
                }
            });
        }
    }

    configurarPaginacao();
    loadPage();

    $scope.pesquisarPorCriterios = function() {
        $scope.hideMessage();

        $scope.filtroStringHistoricoPage = angular.copy($scope.filtroStringHistorico);
        $scope.pag_paginaSelecionada = 1;
        $scope.pesquisarPorCriteriosPorPagina($scope.filtroStringHistoricoPage);
    };

    $scope.pesquisarPorCriteriosPorPagina = function (filtro) {
        $scope.hideMessage();

        StringHistoricoService.pesquisarPorPage(filtro, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(
            function successCallback(res) {
                if (res.data.content == '') {
                    $scope.showErrorMessage('Nenhum registro encontrado.');
                    $scope.listaStringHistorico = []
                    $scope.pag_totalRegistros = 0;
                }

                $scope.listaStringHistorico = res.data.content;
                $scope.pag_totalRegistros = res.data.totalElements;
                $scope.paginacao = true;
            },
            function errorCallback(res) {
                if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                    $scope.showErrorMessage(res.data.mensagem);
                } else {
                    $scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Por favor, entrar em contato com o administrador do sistema.');
                }
                $scope.listaStringHistorico = []
                $scope.pag_totalRegistros = 0;
            }
        );
    }

    $scope.cadastraStringHistorico = function() {
        $scope.hideMessage();

        if ($scope.formStringHistorico.$valid) {
            if ($scope.novoStringHistorico.texto.length > 25) {
                $scope.showErrorMessage('A String ' + UTF8.nao + ' deve possuir mais de 25 caracteres.');
                return;
            }

            StringHistoricoService.criar($scope.novoStringHistorico).then(function successCallback(res) {
                if (res.data) {
                    $scope.showSuccessMessage('String do ' + UTF8.historico + ' cadastrado com sucesso!');
                    $scope.novoStringHistorico = {};
                }
            }, function errorCallback(res) {
                if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                    $scope.showErrorMessage(res.data.mensagem);
                } else {
                    $scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar o cadastro. Por favor, entrar em contato com o administrador do sistema.');
                }
            });

        } else {
            if ($scope.novoStringHistorico.idListaBanco == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + '  informar o Banco. Por favor, selecione uma ' + UTF8.opcao + '.');
                return;
            }

            if ($scope.novoStringHistorico.texto == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + ' informar a String do ' + UTF8.Historico + '. Por favor, verifique os dados digitados.');
                return;
            }

            if ($scope.novoStringHistorico.status == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + '  informar o Status. Por favor, selecione uma ' + UTF8.opcao + '.');
                return;
            }
        }
    }

    $scope.alterarStringHistorico = function() {
        $scope.hideMessage();

        if ($scope.formStringHistorico.$valid) {
            if ($scope.alteraStringHistorico.texto.length > 25) {
                $scope.showErrorMessage('A String ' + UTF8.nao + ' deve possuir mais de 25 caracteres.');
                return;
            }

            StringHistoricoService.alterar($scope.alteraStringHistorico).then(function successCallback(res) {
                if (res.data) {
                    $scope.showSuccessMessage('String do ' + UTF8.historico + ' alterado com sucesso!');
                }
            }, function errorCallback(res) {
                if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                    $scope.showErrorMessage(res.data.mensagem);
                } else {
                    $scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a ' + UTF8.alteracao + '. Por favor, entrar em contato com o administrador do sistema.');
                }
            });
        } else {
            if ($scope.alteraStringHistorico.idListaBanco == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + ' informar o Banco. Por favor, selecione uma ' + UTF8.opcao + '.');
                return;
            }

            if ($scope.alteraStringHistorico.texto == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + ' informar a String do ' + UTF8.Historico + '. Por favor, verifique os dados digitados.');
                return;
            }

            if ($scope.alteraStringHistorico.status == undefined) {
                $scope.showErrorMessage(UTF8.EAgudo + ' ' + UTF8.necessario + '  informar o Status. Por favor, selecione uma ' + UTF8.opcao + '.');
                return;
            }
        }
    }
});