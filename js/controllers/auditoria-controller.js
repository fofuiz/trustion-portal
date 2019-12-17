angular.module('trustionPortal').controller('AuditoriaController', function ($scope, $state, $filter, AuditoriaService, CacheService, UTF8) {

    var registros = [];
    $scope.separadorCampo = ';';
    var filtroAuditoriaPage = {};
    $scope.paginacao = false;

    function configurarPaginacao() {

        $scope.pag_desabilitado = false;
        $scope.pag_tamanho = 5;
        $scope.pag_registrosPorPagina = 5;
        $scope.pag_totalRegistros = 0;
        $scope.pag_paginaSelecionada = 0;
    }
    configurarPaginacao();


    $scope.pesquisaAuditoria = function () {
        $scope.isDadosInvalidos = false;
        $scope.mensagem = '';
        if ($scope.frmListaAuditoria.$valid) {

            if ($scope.dataInicial == undefined) {
                $scope.isDadosInvalidos = true;
                $scope.mensagem = 'Favor, preencher a data inicial';
                return;
            }
            if ($scope.dataFinal == undefined) {
                $scope.isDadosInvalidos = true;
                $scope.mensagem = 'Favor, preencher a data final';
                return;
            }
            var dataInicialEnvio = new Date($scope.dataInicial);
            var dataFinalEnvio = new Date($scope.dataFinal);
            dataInicialEnvio.setHours(0, 0, 0);
            dataFinalEnvio.setHours(23, 59, 59);
            if (dataInicialEnvio.getTime() >= dataFinalEnvio.getTime()) {
                $scope.isDadosInvalidos = true;
                $scope.mensagem = 'Intervalo de datas ' + UTF8.invalido + '!';
                return;
            }

            var auditoria = {};
            auditoria.grupoEconomico = $scope.grupo;
            auditoria.usuario = $scope.usuario;
            auditoria.empresa = $scope.empresa;
            auditoria.dataInicial = dataInicialEnvio.getTime();
            auditoria.dataFinal = dataFinalEnvio.getTime();
            auditoria.idUsuarioConsulta = CacheService.usuario.data.principal.idUsuario;
            auditoria.nroOcorrencia = $scope.nroOcorrencia;
            $scope.pag_paginaSelecionada = 1;
            filtroAuditoriaPage = angular.copy(auditoria);

            $scope.carregarAuditoriasPorPagina();

        } else {
            $scope.isDadosInvalidos = true;
            $scope.mensagem = 'Os campos de data ' + UTF8.sao + ' ' + UTF8.necessarios;
        }
    }

    $scope.carregarAuditoriasPorPagina = function () {

        AuditoriaService.listaAuditoriaPage(filtroAuditoriaPage, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(function successCallback(res) {
            if (res.data.content == '') {
                $scope.paginacao = false;
                $scope.isDadosInvalidos = true;
                $scope.mensagem = 'Nenhum registro encontrado.';
                $scope.acoes = null;
            } else {
                registros = [];
                for (i = 0; i < res.data.content.length; i++) {
                    registros[i] = {};
                    registros[i].grupoEconomico = res.data.content[i].grupoEconomico;
                    registros[i].empresa = res.data.content[i].empresa;
                    registros[i].usuario = res.data.content[i].usuario;
                    registros[i].dataInicial = $filter('date')(res.data.content[i].dataInicial, 'dd/MM/yyyy HH:mm:ss');
                    registros[i].acao = res.data.content[i].acao;
                    registros[i].nroOcorrencia = res.data.content[i].nroOcorrencia;
                }
                $scope.pag_totalRegistros = res.data.totalElements;
                $scope.acoes = registros;
                $scope.paginacao = true;
            }
        }, function errorCallback(res) {
            $scope.paginacao = false;
            $scope.mensagem = res.data.mensagem;
            $scope.isDadosInvalidos = true;
        });
    }

    $scope.exportar = function () {
        $scope.isDadosInvalidos = false;
        var separadorLinha = '\n';
        var registrosExport = '';
        if (filtroAuditoriaPage.idUsuarioConsulta != undefined) {
            AuditoriaService.lista(filtroAuditoriaPage).then(function successCallback(res) {
                registrosExport =
                        'Grupo ' + $scope.separadorCampo
                        + 'Empresa' + $scope.separadorCampo
                        + UTF8.Usuario + $scope.separadorCampo
                        + 'Data e ' + UTF8.horario + ' da ' + UTF8.acao + $scope.separadorCampo
                        + UTF8.Acao + ' executada' + $scope.separadorCampo
                        + 'Nº de ' + UTF8.ocorrencia + separadorLinha;

                for (i = 0; i < res.data.length; i++) {
                    registrosExport += res.data[i].grupoEconomico != null ? res.data[i].grupoEconomico : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += res.data[i].empresa != null ? res.data[i].empresa : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += res.data[i].usuario != null ? res.data[i].usuario : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += res.data[i].dataInicial != null ? $filter('date')(res.data[i].dataInicial, 'dd/MM/yyyy HH:mm:ss') : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += res.data[i].acao != null ? res.data[i].acao : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += res.data[i].nroOcorrencia != null ? res.data[i].nroOcorrencia : ' ';
                    registrosExport += separadorLinha;
                }

                //windows-1252
                var csvContent = registrosExport,
                        textEncoder = new CustomTextEncoder('ISO-8859-1', {NONSTANDARD_allowLegacyEncoding: true}),
                        fileName = 'auditoria-consulta-' + new Date().toLocaleDateString("pt-BR") + '.csv';

                //windows-1252
                var csvContentEncoded = textEncoder.encode([csvContent]);
                var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=ISO-8859-1;'});
                saveAs(blob, fileName);
            }, function errorCallback(res) {
                $scope.mensagem = UTF8.Nao + ' foi ' + UTF8.possivel + ' exportar os registros de auditoria. Contate o Administrador';
                $scope.isDadosInvalidos = true;
            });
        } else {
            //windows-1252
            var csvContent = registrosExport,
                    textEncoder = new CustomTextEncoder('ISO-8859-1', {NONSTANDARD_allowLegacyEncoding: true}),
                    fileName = 'auditoria-consulta-' + new Date().toLocaleDateString("pt-BR") + '.csv';

            //windows-1252
            var csvContentEncoded = textEncoder.encode([csvContent]);
            var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=ISO-8859-1;'});
            saveAs(blob, fileName);
        }

    }
});