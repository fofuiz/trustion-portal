angular.module('trustionPortal').controller('GrupoEconomicoController', function ($scope, $state, GrupoEconomicoService, CacheService, $stateParams, UTF8) {

    $scope.hideMessage();

    var filtroGrupoEconomicoPage = {};

    if ($stateParams.grupoId) {
        GrupoEconomicoService.pesquisarGrupo($stateParams.grupoId).then(function successCallback(res) {
            var grupo = res.data;
            $scope.id = grupo.idGrupoEconomico;
            $scope.cnpj = grupo.cnpj;
            $scope.nome = grupo.nome;
        }, function errorCallback(res) {
            $scope.showErrorMessage(res.data.mensagem);
        });
    }

    function configurarPaginacao() {
        $scope.paginacao = false;

        $scope.pag_desabilitado = false;
        $scope.pag_tamanho = 5;
        $scope.pag_registrosPorPagina = 5;
        $scope.pag_totalRegistros = 0;
        $scope.pag_paginaSelecionada = 0;
    }
    configurarPaginacao();

    //cadastra o grupo
    $scope.cadastraGrupoEconomico = function () {
        if ($scope.frmCadastroGrupoEconomico.$valid) {
            $scope.hideMessage();

            var grupo = {}
            grupo.nome = $scope.nome;
            grupo.cnpj = $scope.cnpj;
            grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

            GrupoEconomicoService.cadastra(grupo).then(function successCallback(res) {
                $scope.showSuccessMessage('Grupo inserido com sucesso!');
                $scope.id = res.data.idGrupoEconomico;
                $scope.nome = res.data.nome;
                $scope.cnpj = res.data.cnpj;
            }, function errorCallback(res) {
                $scope.showErrorMessage(res.data.mensagem);
            });

        } else {
            if (!$scope.cnpj) {
                $scope.showErrorMessage('Favor preencher o CNPJ');
                return;
            }

            if (!$scope.nome) {
                $scope.showErrorMessage('Favor preencher o nome do grupo');
                return;
            }
        }
    }

    //Pesquisa o grupo
    $scope.pesquisaGrupo = function () {
        $scope.hideMessage();
        var grupo = {}
        grupo.idGrupoEconomico = $scope.id;
        grupo.nome = $scope.nome;
        grupo.cnpj = $scope.cnpj;
        grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
        $scope.pag_paginaSelecionada = 1;
        filtroGrupoEconomicoPage = angular.copy(grupo);

        $scope.carregarGrupoEconomicosPorPagina();
    }

    //alterar grupo
    $scope.alteraGrupoEconomico = function () {
        if ($scope.frmAlteraGrupoEconomico.$valid) {
            $scope.hideMessage();
            var grupo = {};
            grupo.idGrupoEconomico = $scope.id;
            grupo.cnpj = $scope.cnpj;
            grupo.nome = $scope.nome;
            grupo.idUsuarioAlteracao = CacheService.usuario.data.principal.idUsuario;
            GrupoEconomicoService.altera(grupo).then(function successCallback(res) {
                $scope.showSuccessMessage('Grupo alterado com sucesso!');
                $scope.id = res.data.idGrupoEconomico;
                $scope.cnpj = res.data.cnpj;
                $scope.nome = res.data.nome;
            }, function errorCallback(res) {
                $scope.mensagem = res.data.mensagem;
            });
        } else {
            if (!$scope.nome) {
                $scope.showErrorMessage('Favor preencher o Nome');
                return;
            }
        }
    }

    $scope.carregarGrupoEconomicosPorPagina = function () {
        GrupoEconomicoService.listaGrupoPage(
                filtroGrupoEconomicoPage, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(function successCallback(res) {
            if (res.data.content == '') {
                $scope.paginacao = false;
                $scope.showErrorMessage('Nenhum grupo encontrado.');
            } else {
                $scope.pag_totalRegistros = res.data.totalElements;
                $scope.grupos = res.data.content;
                $scope.paginacao = true;
            }
        }, function errorCallback(res) {
            $scope.showErrorMessage(res.data.mensagem);
            $scope.paginacao = false;
        });
    }
});