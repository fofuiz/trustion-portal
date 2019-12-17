angular.module('trustionPortal').controller('AcaoOcorrenciaD1Controller',
    function ($scope, $state, $uibModalInstance, ocorrencia, TipoStatusOcorrenciaService, OcorrenciaService, GrupoEconomicoService, AtividadeD1Service, TipoMotivoOcorrenciaService, UTF8) {

        $scope.listaTipoStatusOcorrencia = [];
        $scope.ocorrencia = {};
        $scope.ocorrencia.idOcorrencia = ocorrencia.idOcorrencia;
        $scope.ocorrencia.idEmpresa = ocorrencia.idEmpresa;
        $scope.ocorrencia.empresa = ocorrencia.empresa;
        $scope.ocorrencia.grupoEconomico = ocorrencia.grupoEconomico;
        $scope.listaGrupoEconomico = [];
        $scope.listatipoMotivoConclusao = [];

        loadPage();
        loadMotivos();

        function loadPage() {

            TipoStatusOcorrenciaService.listar().then(
                function successCallback(res) {

                    if(res.data) {
                        $scope.listaTipoStatusOcorrencia = formatarListaTipoStatusOcorrencia(res.data);
                    }

                }, function errorCallback(res) {
                    if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                        $scope.mensagemErro = res.data.mensagem;
                        $scope.isExibirMensagemErro = true;
                    } else {
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de status da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.';
                    }
                }
            );
        }
        

        function loadMotivos() {

            TipoMotivoOcorrenciaService.listar().then(
                function successCallback(res) {
                    $scope.listatipoMotivoConclusao = res.data;
                }, function errorCallback(res) {
                    if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                        $scope.mensagemErro = res.data.mensagem;
                        $scope.isExibirMensagemErro = true;
                    } else {
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' listar os tipos de Motivo. Favor, entrar em contato com o administrador do sistema.';
                    }
                }
            );
        }


        $scope.salvar = function () {

            if (!$scope.atividade.statusOcorrencia) {
                $scope.mensagemErro = 'Favor, escolher o status';
                $scope.isExibirMensagemErro = true;
                return;
            }

            if (!$scope.atividade.responsavel && $scope.atividade.statusOcorrencia != 4) {
                $scope.mensagemErro = 'Favor, escolher o ' + UTF8.responsavel;
                $scope.isExibirMensagemErro = true;
                return;
            }

            if ($scope.atividade.statusOcorrencia == 4 && !$scope.atividade.idMotivo) {
                $scope.mensagemErro = 'Favor, escolher o motivo';
                $scope.isExibirMensagemErro = true;
                return;
            }

            if (!$scope.atividade.atividade) {
                $scope.mensagemErro = 'Favor, preencher o campo Mensagem.';
                $scope.isExibirMensagemErro = true;
                return;
            }

            $scope.atividade.idOcorrencia = $scope.ocorrencia.idOcorrencia;

            AtividadeD1Service.criarPorAcao($scope.atividade).then(
                function successCallback(res) {
                    $scope.listaGrupoEconomico = res.data;
                    $uibModalInstance.close();

                }, function errorCallback(res) {
                    if (res.data != null && res.data.hasOwnProperty('mensagem')) {
                        $uibModalInstance.close();
                    } else {
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' gerar a atividade da ' + UTF8.ocorrencia + '. Favor, entrar em contato com o administrador do sistema.';
                    }
                }
            );
        }

        /**
         * Formata a lista de tipoStatusOcorrencia.
         * Operacoes realizadas:
         * - remove o item "3 - Aguardando Aprovação"
         * - concatena um numero sequencial no comeco da opcao para nao ficar falatando o numero 3.
         * 
         * @param {Array} listaTipoStatusOcorrencia
         * @returns listaTipoStatusOcorrencia formatada.
         */
        function formatarListaTipoStatusOcorrencia(listaTipoStatusOcorrencia) {
            var  listaTipoStatusOcorrencia = listaTipoStatusOcorrencia;

            // remove a opcao '3 - Aguardando Aprovação'
            listaTipoStatusOcorrencia = listaTipoStatusOcorrencia.filter((tipoOcorrencia) => {
                return tipoOcorrencia.descricao != '3 - Aguardando Aprovação';
            });

            // concatena o numero sequencial no comeco da descricao de cada status
            listaTipoStatusOcorrencia = listaTipoStatusOcorrencia.map((tipoOcorrencia, index) => {
                    tipoOcorrencia.descricao = (index + 1) + tipoOcorrencia.descricao.replace(/\d*/, '');
                    return tipoOcorrencia;
            });
            
            return listaTipoStatusOcorrencia;
        }

        $scope.cancelar = function () {
            $uibModalInstance.dismiss();
        }

    }
);