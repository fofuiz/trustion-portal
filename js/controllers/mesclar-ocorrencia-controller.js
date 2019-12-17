angular.module('trustionPortal').controller('MesclarOcorrenciaController',
    function ($scope, ocorrencia, $stateParams, $uibModal, $uibModalInstance, $http, $window, $filter, OcorrenciaService, MesclarOcorrenciaService, AtividadeService, RelatorioAnaliticoCreditosService, EnvironmentService, UTF8) {
        $scope.ocorrenciasParaMescla = [];
        $scope.ocorrenciasAprovacao = [];
        $scope.ocorrencia = ocorrencia;
        $scope.totalDiferenca = 0;
        if(ocorrencia.isOcorrenciaD1) {
            $scope.saldo = (ocorrencia.valorCreditadoConta - ocorrencia.valorColeta) + ocorrencia.valorAjuste;
            $scope.saldoAprovacao = (ocorrencia.valorCreditadoConta - ocorrencia.valorColeta)  ;
        } else {
            $scope.saldo = (ocorrencia.valorCreditadoConta - ocorrencia.valorRegistradoCofre) + ocorrencia.valorAjuste;
            $scope.saldoAprovacao = (ocorrencia.valorCreditadoConta - ocorrencia.valorRegistradoCofre)  ;
        }
        $scope.totalDiferencaAprovacao = 0;

        
        $scope.messagemErroMescla = '';
        $scope.messagemSucessoMescla = '';
        $scope.isExibirMensagemErro = false;
        $scope.isExibirMensagemSucesso = false;
        $scope.atividade = {};
        $scope.listaOcorrenciasMescladas = [];
        $scope.listaOcorrencias = [];
        
        $scope.isOcorrenciaD1 = ocorrencia.isOcorrenciaD1;
        // funcao com callback
        load();

        function calcSaldoAndDiferenca() {
            $scope.listaOcorrenciasMescladas.forEach(ocorrencia => {
                $scope.totalDiferencaAprovacao += ocorrencia.valorAjuste;
                $scope.saldoAprovacao -= ocorrencia.valorAjuste;
            });
            $scope.totalDiferenca = $scope.totalDiferencaAprovacao;

        }

        function calcSaldoAndDiferencaM() {
            $scope.listaOcorrencias.forEach(ocorrencia => {
                $scope.totalDiferenca += ocorrencia.valorAjuste;
                $scope.saldo -= ocorrencia.valorAjuste;
            });
        }

        function load() {
            MesclarOcorrenciaService.pesquisar(ocorrencia).then(
                function successCallback(res) {
                    $scope.listaOcorrencias = res.data;
                    //calcSaldoAndDiferencaM();
                    if(!$scope.listaOcorrencias || $scope.listaOcorrencias.length <= 0) {
                        document.getElementById("btnSalvar").disabled = true;
                    }
                }, function errorCallback(res) {
                    $scope.messagemErroMescla = 'Erro ao carregar ';
                    $scope.isExibirMensagemErro = true;
                }
            );

            MesclarOcorrenciaService.pesquisarMesclados(ocorrencia).then(
                function successCallback(res) {
                    $scope.listaOcorrenciasMescladas = res.data;
                    calcSaldoAndDiferenca();
                }, function errorCallback(res) {
                    $scope.messagemErroMescla = 'Erro ao carregar ';
                    $scope.isExibirMensagemErro = true;
                }
            )
        }

        function loadMock() {
            var res = MesclarOcorrenciaService.pesquisarMock();
            $scope.ocorrenciasParaMescla = res.data;
        }

        //listagem de mock para a tela de aprovacao
        function loadMockAprovacao() {
            var res = MesclarOcorrenciaService.pesquisarMockAprovacao();
            $scope.ocorrenciasAprovacao = res.data;
            $scope.observacao = res.obs;
            $scope.saldoAprovacao = 0.00;
            $scope.saldoDiferenca = 830.00;
        }

        $scope.cancelar = function () {
            $uibModalInstance.dismiss();
        };

        $scope.selecionarTodasOcorrencias = function () {
            calcularDiferenca();
        }

        function verificaSaldo(index) {
            if ($scope.saldo == 0.00) { $scope.listaOcorrencias[index].isOcorrenciaSelected = false; return $scope.totalDiferenca; }
        }

        $scope.calcularDiferenca = function (index) {

            if ($scope.listaOcorrencias[index].isOcorrenciaSelected && $scope.saldo > 0) {

                if($scope.isOcorrenciaD1) {
                    $scope.listaOcorrencias[index].valorAjuste = - ($scope.listaOcorrencias[index].valorCreditadoConta - $scope.listaOcorrencias[index].valorColeta);
                } else {
                    $scope.listaOcorrencias[index].valorAjuste = - ($scope.listaOcorrencias[index].valorCreditadoConta - $scope.listaOcorrencias[index].valorRegistradoCofre);
                }

                if (($scope.saldo - $scope.listaOcorrencias[index].valorAjuste) >= 0.00) {
                       
                    $scope.saldo = $scope.saldo - $scope.listaOcorrencias[index].valorAjuste;
                    $scope.totalDiferenca = $scope.totalDiferenca + $scope.listaOcorrencias[index].valorAjuste;
                } else {
                    $scope.listaOcorrencias[index].valorAjuste = $scope.saldo;
                    $scope.saldo = $scope.saldo - $scope.saldo;
                    $scope.totalDiferenca = $scope.totalDiferenca + $scope.listaOcorrencias[index].valorAjuste;
                }
            } else {
                //tratar quando houver valor
                verificaSaldo(index);
                $scope.saldo = $scope.saldo + $scope.listaOcorrencias[index].valorAjuste;
                $scope.totalDiferenca = $scope.totalDiferenca - $scope.listaOcorrencias[index].valorAjuste;
                $scope.listaOcorrencias[index].valorAjuste = 0.00;
            }
            return $scope.totalDiferenca;
        }

        $scope.salvar = function () {
            $scope.isExibirMensagemErro = false;
            if($scope.observacao == undefined || $scope.observacao == ""){
                $scope.isExibirMensagemErro = true;
                $scope.messagemErroMescla = "Preencher " + UTF8.observacao;
                return;
            }
            
            $scope.ocorrencia.mesclas = preencheMesclas();
            $scope.ocorrencia.observacao = $scope.observacao ;
            $scope.ocorrencia.valorAjuste = - $scope.totalDiferenca;

            MesclarOcorrenciaService.criar($scope.ocorrencia).then(
                function successCallback(res) {
                    $scope.messagemSucessoMescla = "Mesclado com Sucesso";
                    $scope.isExibirMensagemSucesso = true;

                }, function errorCallback(res) {
                    $scope.isExibirMensagemErro = true;
                    $scope.messagemErroMescla = UTF8.Nao + " foi " + UTF8.possivel + " realizar a mescla";
                });
        }

        $scope.desmesclar = function () {

            if($scope.observacao == undefined || $scope.observacao == ""){
                $scope.isExibirMensagemErro = true;
                $scope.messagemErroMescla = "Preencher " + UTF8.observacao;
                return;
            }

            var desmesclas = {};
            desmesclas.idOcorrencia = $scope.ocorrencia.idOcorrencia;
            desmesclas.mesclas = preencheDesmesclas();
            $scope.ocorrencia.observacao = $scope.observacao;
            $scope.ocorrencia.valorAjuste = - $scope.totalDiferenca;

            MesclarOcorrenciaService.desfazer(desmesclas).then(
                function successCallback(res) {
                    $scope.messagemSucessoMescla = "Desmesclado com Sucesso";
                    $scope.isExibirMensagemSucesso = true;

                }, function errorCallback(res) {
                    $scope.isExibirMensagemErro = true;
                    $scope.messagemErroMescla = UTF8.Nao + " foi " + UTF8.possivel + " realizar a desmescla";
                });
        }

        $scope.aprovar = function () {
            MesclarOcorrenciaService.aprovar($scope.ocorrencia).then(
                function successCallback(res) {
                    $scope.messagemSucessoMescla = "Mesclado com Sucesso";
                    $scope.isExibirMensagemSucesso = true;
                    document.getElementById("btnAprovar").disabled = true;
                    document.getElementById("btnRejeitar").disabled = true; 
                }, function errorCallback(res) {
                    $scope.isExibirMensagemErro = true;
                    $scope.messagemErroMescla = UTF8.Nao + " foi " + UTF8.possivel + " aprovar a mescla, o " + UTF8.usuario + " solicitante " + UTF8.nao + " pode aprovar";
                });
        }

        $scope.rejeitar = function () {
            MesclarOcorrenciaService.rejeitar($scope.ocorrencia).then(
                function successCallback(res) {
                    $scope.messagemSucessoMescla = "Rejeitado com Sucesso";
                    $scope.isExibirMensagemSucesso = true;
                    document.getElementById("btnAprovar").disabled = true;
                    document.getElementById("btnRejeitar").disabled = true; 
                }, function errorCallback(res) {
                    $scope.isExibirMensagemErro = true;
                    $scope.messagemErroMescla = UTF8.Nao + " foi " + UTF8.possivel + " rejeitar a mescla, o " + UTF8.usuario + " solicitante não pode rejeitar";
                });
        }

        function preencheMesclas() {
            var found = false;
            $scope.listaOcorrencias.forEach(ocorrencia => {
                found = false;
                $scope.ocorrencia.mesclas.forEach(mescla => {
                    if(mescla.idOcorrencia == ocorrencia.idOcorrencia) {
                        found = true;
                        if(ocorrencia.isOcorrenciaSelected) {
                            mescla.idOcorrenciaMescla = $scope.ocorrencia.idOcorrencia;
                        } else {
                            mescla.idOcorrenciaMescla = null;
                        }
                        mescla.valorAjuste = ocorrencia.valorAjuste;
                    }
                });

                if(!found && ocorrencia.isOcorrenciaSelected) {
                    ocorrencia.idOcorrenciaMescla = $scope.ocorrencia.idOcorrencia;
                    $scope.ocorrencia.mesclas.push(ocorrencia);
                }
            });

            return $scope.ocorrencia.mesclas;
        }


        function preencheDesmesclas() {
            var lstDesmescla = [];

            $scope.listaOcorrencias.forEach(ocorrencia => {
                if (ocorrencia.isOcorrenciaSelected == false && ocorrencia.idOcorrenciaMescla != null) {
                      
                    var ocorrenciaAux = {};
                    ocorrenciaAux.idOcorrencia = ocorrencia.idOcorrencia;
                    ocorrenciaAux.valorAjuste = ocorrencia.valorAjuste;
                    lstDesmescla.push(ocorrenciaAux);
                }
            });
            return lstDesmescla;
        }

    });