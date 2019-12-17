angular.module('trustionPortal').controller('GestaoVendasController', function ($scope, TrustionHelpers, $timeout, valoresComboService, UsuarioService, gestaoVendasService) {

    var timeoutBusca;
    var empId;
    var idSegmento;

    $scope.currentPage = 1;
    $scope.itemsPerPage = 75; //estah fixo 75 no backend
    $scope.maxSize = 5; //Number of pager buttons to show
    $scope.totalItems = 0; // serah atribuido o length do response

    /**
     * Carrega o combo de lojas
     */
    var loadLojas = function () {
        valoresComboService.getLojas(empId).then(
                function (result) {
                    $scope.lojas = result.data;
                }
        );
    };

    var carregaSemaforo = function (payload) {
        gestaoVendasService.getDadosSemaforo(payload).then(function (result) {
            var arraySemaforo = result.data;
            var dadosSemaforo = {}

            for (i = 0; i < arraySemaforo.length; i++) {
                var statusAtual = arraySemaforo[i].status;

                switch (statusAtual) {
                    case 0:
                        dadosSemaforo.amarelo = {};
                        dadosSemaforo.amarelo.quantidade = arraySemaforo[i].quantidade;
                        dadosSemaforo.amarelo.valor = arraySemaforo[i].valor;
                        break;
                    case 1:
                        dadosSemaforo.verde = {};
                        dadosSemaforo.verde.quantidade = arraySemaforo[i].quantidade;
                        dadosSemaforo.verde.valor = arraySemaforo[i].valor;
                        break;
                    case 3:
                        dadosSemaforo.vermelho = {};
                        dadosSemaforo.vermelho.quantidade = arraySemaforo[i].quantidade;
                        dadosSemaforo.vermelho.valor = arraySemaforo[i].valor;
                        break;
                    default:
                        dadosSemaforo.total = {};
                        dadosSemaforo.total.quantidade = arraySemaforo[i].quantidade;
                        dadosSemaforo.total.valor = arraySemaforo[i].valor;
                }
            }
            $scope.dadosSemaforo = dadosSemaforo;
            $scope.loading = false;
        });

    }

    var loadVisoes = function () {
        valoresComboService.listarVisao().then(
                function (result) {
                    $scope.visoes = result.data;
                    $scope.visao = $scope.visoes[0].codigoVisao;
                    $scope.mudarVisao();
                }
        );
    };

    var loadStatusConciliacao = function (idVisao) {
        var payload = {};

        payload.idVisao = idVisao;

        gestaoVendasService.listarStatusConciliacao(payload).then(function success(response) {
            $scope.statuses = response.data;
            $scope.status = '5'; // 5 eh o id do status TODOS
        });
    }

    var limparFiltros = function () {
        $scope.filtroTabelaLoja = '';
        $scope.filtroTabelaOperadora = '';
        $scope.filtroTabelaProduto = '';
        $scope.filtroTabelaPlano = '';
        $scope.filtroTabelaValor = '';
        $scope.filtroTabelaNSU = '';
        $scope.filtroTabelaAutorizacao = '';
        $scope.filtroTabelaAreaCliente = '';
    }

    $scope.pesquisaGestaoVendas = function (pagina, isCarregarSemaforo = true) {
        if (!empId) {
            $scope.showErrorMessage('Selecione uma empresa.');
            return;
        }

        if($scope.dataInicial.isAfter($scope.dataFinal)) {
            $scope.showErrorMessage('A data inicial não pode ser posterior à data final.');
            return;
        }

        var payload = {};
        $scope.hideMessage();
        $scope.showTable = false;

        if (pagina) {
            $scope.currentPage = pagina;
        } else {
            // foi usado o botao pesquisar
            limparFiltros();
            $scope.todosDetalhesSelecionados = false; //desmarca o checkbox de todos selecionados
            $scope.detalhesExcluir = []; //limpa a lista de detalhes para excluir
            $scope.currentPage = 1;
        }

        // campos do formulario
        payload.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        payload.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        payload.idVisao = $scope.visao;
        payload.codLojaOuPv = $scope.codLoja;
        payload.statusConciliacao = $scope.status;
        payload.sequencial = ($scope.sequencial || '');
        payload.codArquivo = $scope.codArquivo;
        // campos do filtro da tabela de resultado pesquisa
        payload.filtroLoja = $scope.filtroTabelaLoja;
        payload.filtroOperadora = $scope.filtroTabelaOperadora;
        payload.filtroProduto = $scope.filtroTabelaProduto;
        payload.filtroPlano = $scope.filtroTabelaPlano;
        payload.filtroValor = $scope.filtroTabelaValor.replace(/[A-z]/gi, '').replace('$', '').replace(',', '.');
        payload.filtroNsu = $scope.filtroTabelaNSU;
        payload.filtroAutorizacao = $scope.filtroTabelaAutorizacao;
        payload.filtroAreaCliente = $scope.filtroTabelaAreaCliente;
        // campos da paginacao
        payload.listaEmpresas = empId;
        payload.paginacaoFirst = $scope.currentPage - 1; //(0 primeira página,1 para segunda página, etc)
        payload.paginacaoPageSize = 75; //(manter sempre fixo 1) pois o tamanho de 75 registros está definido direto na consullta
        payload.paginacaoSortField = 'id'; //(manter fixo)
        payload.paginacaoAscOrder = true; //(manter fixo)

        gestaoVendasService.getListaGestaoVendas(payload).then(function (result) {
            $scope.showTable = true;

            if (result.data.length > 0) {
                $scope.hideMessage();
                $scope.gestaoVendaResultados = result.data;
                $scope.totalItems = $scope.gestaoVendaResultados[0].totalRegistros;
                $scope.totalPaginas = $scope.gestaoVendaResultados[0].totalPaginas; // usado para as regras de ocultar ou exibir os botoes de exportar .dat, .csv e etc
                marcarLinhaComoSelecionada();

                if (isCarregarSemaforo) {
                    carregaSemaforo(payload);
                }

            } else {
                $scope.showErrorMessage('Não foram encontrados dados para esta pesquisa.');
                resetarPagina();
            }
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            $scope.showErrorMessage('Erro ao pesquisar.');
            resetarPagina();
        });
    };

    /**
     * Navegacao pelos botoes de paginacao.
     */
    $scope.getPage = function (currentPage) {
        $scope.pesquisaGestaoVendas(currentPage, false);
    }

    $scope.pesquisaArquivos = function () {
        var dataInicialArquivo = moment($scope.dataInicialArquivo).format('x');
        var dataFinalArquivo = moment($scope.dataFinalArquivo).format('x');
        gestaoVendasService.getArquivosPorData(dataInicialArquivo, dataFinalArquivo, empId).then(function (result) {
            if (result.data.length > 0) {
                $scope.hideMessage();
                $scope.pesquisaArquivosTable = result.data;
                $scope.showArquivosTable = true;
            } else {
                $scope.showErrorMessage("Não foram encontrados arquivos para esta pesquisa.");
                $scope.showArquivosTable = false;
            }
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            $scope.showErrorMessage("Erro ao pesquisar.");
            $scope.showArquivosTable = false;
        });

    }

    $scope.pesquisaArquivosSeqNome = function (event) {
        clearTimeout(timeoutBusca);
        timeoutBusca = setTimeout(function () {

            gestaoVendasService.getArquivosPorSeqNome($scope.sequencial, $scope.nomeArquivo, empId).then(function (result) {
                if (result.data.length > 0) {
                    var arquivo = result.data[0];
                    $scope.sequencial = arquivo.sequencial;
                    $scope.nomeArquivo = arquivo.nomeArquivo;
                    $scope.codArquivo = arquivo.id;
                    event.target.blur();
                } else {
                    $scope.codArquivo = "";
                }
                $scope.loading = false;
            });

        }, 500);
    }

    $scope.limparGestaoVendas = function () {
        $scope.empresa = "";
        $scope.visao = 1;
        $scope.visaoLoja = angular.copy($scope.visao);
        $scope.dataInicial = moment(moment().date(1).format("DD/MM/YYYY"), "DD/MM/YYYY");
        $scope.dataFinal = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
        $scope.codLoja = '';
        $scope.status = '5';
        $scope.sequencial = '';
        $scope.nomeArquivo = '';
        $scope.codArquivo = '';
        $scope.dataInicialArquivo = moment(moment().date(1).format("DD/MM/YYYY"), "DD/MM/YYYY");
        $scope.dataFinalArquivo = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
        $scope.gestaoVendaResultados = [];
    };

    $scope.mudarVisao = function () {
        $scope.gestaoVendaResultados = [];

        if ($scope.visao == 1) {
            $scope.visaoLoja = true;
        } else {
            $scope.visaoLoja = false;
            $scope.sequencial = '';
            $scope.nomeArquivo = '';
        }

        loadStatusConciliacao($scope.visao);
    }

    $scope.selecionaArquivo = function (sequencial, nomeArquivo, codArquivo) {
        $scope.sequencial = sequencial;
        $scope.nomeArquivo = nomeArquivo;
        $scope.codArquivo = codArquivo;
    }

    /**
     * Faz a pesquisa quando usando os campos de filtro da tabela de resultado.
     * 
     * @param {Number} pagina Numero da pagina na paginacao
     */
    $scope.filtrarTabela = function (pagina) {
        clearTimeout(timeoutBusca);

        timeoutBusca = setTimeout(function () {
            $scope.pesquisaGestaoVendas(pagina, false);
        }, 500);
    }

    $scope.getStatus = function (status) {
        switch (status) {
            case 1:
                return 'green';
                break;
            case 2:
                return 'green';
                break;
            case 0:
                return 'yellow';
                break;
            default:
                return 'red';
        }
    }

    $scope.exportarOperadora = function () {
        var filtro = new Object();

        filtro.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        filtro.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        filtro.listaEmpresas = empId;
        filtro.statusConciliacao = $scope.status;
        filtro.idVisao = $scope.visao;

        gestaoVendasService.exportarOperadora(filtro).then(function success(response) {
            var nomeArquivo = "";
            var responseHeaders = response.headers();

            nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition'])
            saveTextAsFile(response.data, nomeArquivo);

        }, function error(response) {
            msgFalhaBaixarArquivo();
        });
    }

    $scope.exportarCsv = function () {
        $scope.loading = true;
        var filtro = new Object();

        filtro.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        filtro.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        filtro.listaEmpresas = empId;
        filtro.statusConciliacao = $scope.status;
        filtro.idVisao = $scope.visao;

        gestaoVendasService.exportarCsv(filtro).then(function success(response) {
            var nomeArquivo = "";
            var responseHeaders = response.headers();

            nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition'])
            saveTextAsFile(response.data, nomeArquivo);
            $scope.loading = false;
        }, function error(response) {
            msgFalhaBaixarArquivo();
        });
    }

    $scope.exportarLoja = function () {
        var filtro = new Object();

        filtro.idVisao = $scope.visao;
        filtro.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        filtro.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        filtro.codLojaOuPv = $scope.codLoja;
        filtro.statusConciliacao = $scope.status;
        filtro.codArquivo = $scope.sequencial;
        filtro.listaEmpresas = empId;


        gestaoVendasService.exportarLoja(filtro).then(function success(response) {
            var nomeArquivo = "";
            var responseHeaders = response.headers();

            nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition'])
            saveTextAsFile(response.data, nomeArquivo);
        }, function error(response) {
            msgFalhaBaixarArquivo();
        });
    }

    /**
     * Exporta venda conciliada no formata .dat
     */
    $scope.exportarLayout2 = function () {
        var filtro = new Object();

        filtro.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        filtro.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        filtro.listaEmpresas = empId;
        filtro.statusConciliacao = $scope.status;
        filtro.idVisao = $scope.visao;

        gestaoVendasService.exportarLayout2(filtro).then(function success(response) {
            var nomeArquivo = "";
            var responseHeaders = response.headers();

            nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition'])
            saveTextAsFile(response.data, nomeArquivo);
        }, function error(response) {
            msgFalhaBaixarArquivo();
        });
    }

    /**
     * Exporta arquivo .dat
     */
    $scope.exportar = function () {
        var filtro = new Object();

        filtro.dataInicial = moment($scope.dataInicial).format('YYYY-MM-DD');
        filtro.dataFinal = moment($scope.dataFinal).format('YYYY-MM-DD');
        filtro.listaEmpresas = empId;

        gestaoVendasService.exportar(filtro).then(function success(response) {
            var nomeArquivo = "";
            var responseHeaders = response.headers();

            nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition'])
            saveTextAsFile(response.data, nomeArquivo);
        }, function error(response) {
            msgFalhaBaixarArquivo();
        });
    }

    /**
     * Editar divergencia
     */
    $scope.editar = function (divergencia) {
        var payload = {};

        payload.data = divergencia.data;
        payload.nsu = divergencia.nsu;
        payload.codAutorizacao = divergencia.codAutorizacao;
        payload.statusConciliacao = divergencia.statusConciliacao;
        payload.idDetalhe = divergencia.idDetalhe;
        payload.hashValue = divergencia.hashValue;
        payload.listaEmpresas = divergencia.listaEmpresas;

        if (divergencia.statusConciliacao == 1) {
            //carregar dialog desconciliacao
            gestaoVendasService.editar(payload).then(function success(response) {
                carregaListaDesconciliar(response);
            }, function error(response) {
                $scope.showErrorMessage("Erro ao recuperar registros.");
            });
        } else {
            //carregar dialog conciliacao
            gestaoVendasService.editar(payload).then(function success(response) {
                carregaListaConciliar(response);
            }, function error(response) {
                $scope.showErrorMessage("Erro ao recuperar registros.");
            });
        }
    }

    $scope.desconciliar = function (hashValue) {
        var payload = {};

        payload.hashValue = hashValue;

        gestaoVendasService.desconciliar(payload).then(function success(response) {
            $scope.showSuccessMessage("Operação realizada com sucesso.");
        }, function error(response) {
            $scope.showErrorMessage("Erro ao realizar operação.");
        })
    }

    $scope.fecharModalConciliar = function () {
        marcarDesmarcarLinha();
        $scope.transacaoASerConciliada = {};
        $scope.listarPossiveisTransacoes = {};
        $scope.hideMessage();
    }

    $scope.fecharModalDesconciliar = function () {
        $scope.listaTransacaoRemessa = {};
        $scope.listaTransacaoFato = {};
        $scope.hideMessage();
    }

    $scope.selecionarParaConciliar = function (possivelTransacao, index) {
        marcarDesmarcarLinha(index);
        $scope.transacaoSelecionada = possivelTransacao;
    }

    /**
     * 
     * transacaoASerConciliada eh a linha da tabela na parte de cima no modal.
     * transacaoSelecionada eh a transacao selecionada na tabela da parte de baixo no modal.
     */
    $scope.conciliar = function () {
        var payload = {};

        if (!$scope.transacaoSelecionada || !$scope.transacaoASerConciliada) {
            $scope.showErrorMessage("Selecione uma transação");
            return;
        }
        payload.codDetalhe = $scope.transacaoASerConciliada.codDetalhe;
        payload.codNsu = $scope.transacaoSelecionada.codNsu;
        payload.empId = empId;
        payload.dtaVenda = $scope.transacaoSelecionada.dtaVenda;
        payload.codOperadora = $scope.transacaoSelecionada.codOperadora;
        payload.nroPlano = $scope.transacaoSelecionada.nroPlano;
        payload.nomeProduto = $scope.transacaoSelecionada.nomeProduto;
        payload.hashValue = $scope.transacaoSelecionada.hashValue;

        gestaoVendasService.conciliar(payload).then(function success(response) {
            $scope.showSuccessMessage("Operação realizada com sucesso.");
        }, function error(response) {
            $scope.showErrorMessage(response.data.mensagem);
        });
    }

    $scope.abrirModalDetalheNsu = function (divergencia) {
        var payload = {};

        payload.nsu = divergencia.nsu;
        payload.codAutorizacao = divergencia.codAutorizacao;
        payload.dtaVendaDt = divergencia.dtaVendaDt;
        payload.dscAreaCliente = idSegmento;
        payload.statusConciliacao = divergencia.statusConciliacao;
        payload.hashValue = divergencia.hashValue;
        payload.codArquivo = divergencia.codArquivo;
        payload.listaEmpresas = divergencia.listaEmpresas;

        gestaoVendasService.pesquisaDetalhesHash(payload).then(function success(response) {
            mostrarModalDetalhesNsu(response);
        }, function error(response) {
            $scope.showErrorMessage(response.data.mensagem);
        });
    }

    /**
     * Seleciona o detalhe (checkbox da linha da tabela de resultado).
     * 
     * @param {boolean} statusSelecionado 
     * @param {number} idDetalhe 
     */
    $scope.selecionarDetalhe = function (statusSelecionado, idDetalhe) {
        var detalhe = {"idDetalhe": idDetalhe};

        if (statusSelecionado) {
            inserirDetalhesExcluir(detalhe);
        } else {
            //remove o detalhe da lista de detalhes para excluir
            $scope.detalhesExcluir = $scope.detalhesExcluir.filter((element) => element.idDetalhe != detalhe.idDetalhe);
            $scope.todosDetalhesSelecionados = false; //desmarca o checkbox de todos selecionados
        }
    }

    /**
     * Exclui todos os detalhes divergentes selecionados.
     */
    $scope.excluirDetalhes = function () {

        if (!$scope.detalhesExcluir || $scope.detalhesExcluir.length < 1) {
            return;
        }

        gestaoVendasService.excluir($scope.detalhesExcluir).then(function success(response) {
            removerDetalhesExcluidosTable();
            $scope.showSuccessMessage("Detalhes excluídos com sucesso.");
        }, function error(response) {
            $scope.showErrorMessage("Erro ao excluir detalhes.");
        });
    }

    /**
     * Seleciona todos os detalhes divergentes (em vermelho na tabela de resultado).
     * OBS: Selecina soh os que estao paginados em tela, se mudar de pagina eles continuarao selecionados.
     */
    $scope.selecionarTodosDetalhesDivergentes = function () {
        $scope.gestaoVendaResultados.forEach(element => {

            if (element.statusConciliacao == 2 || element.statusConciliacao == 3) {
                element.isChecked = $scope.todosDetalhesSelecionados;
                $scope.selecionarDetalhe(element.isChecked, element.idDetalhe)
            }

        });
    }

    function mostrarModalDetalhesNsu(response) {
        // var info = response.data.shift();
        $scope.dadosModalNsu = {};
        $scope.dadosModalNsu.info = response.data[0];
        $scope.dadosModalNsu.data = response.data;
        $('#detalhes-nsu').modal('show');
    }

    /**
     * Muda a cor da linha da tabela para indicar que estah selecionada.
     * 
     * @param {number} index se nao exitir desmarca a linha selecionada.
     */
    function marcarDesmarcarLinha(index) {

        if (!index) {
            $scope.selected = [];
            return;
        }

        $scope.selected = [];
        $scope.selected[index] = true;
    }
    ;

    function carregaListaConciliar(response) {

        if (!response.data || response.data.length == 0) {
            $scope.showErrorMessage("A pesquisa não retornou resultado.");
            return;
        }
        $scope.transacaoASerConciliada = response.data.listarTransacoesASerConciliada.shift();
        $scope.listarPossiveisTransacoes = response.data.listarPossiveisTransacoes;
        $('#modal-conciliar').modal('show');
    }

    function carregaListaDesconciliar(response) {

        if (!response.data || response.data.length == 0) {
            $scope.showErrorMessage("A pesquisa não retornou resultado.");
            return;
        }

        $scope.listaTransacaoRemessa = response.data.listaTransacaoRemessa.shift();
        $scope.listaTransacaoFato = response.data.listaTransacaoFato;

        if ($scope.listaTransacaoRemessa.rowKey != 0 || $scope.listaTransacaoRemessa.quantidadeItensAgrupado) {
            /*
             AS-14510
             listaTransacaoRemessa: não seta valor nos campos rowKey e quantidadeItensAgrupado: (elemento 0 do exemplo da task)
             listaTransacaoFato seta elemento rowKey e quantidadeItensAgrupado (elemento 1 e 2 exemplo da task)
             */
            $scope.showErrorMessage("Comportamento inesperado, entre em contato com o administrador.")
            return;
        }

        $('#modal-desconciliar').modal('show');
    }

    /**
     * Extrai o nome do arquivo do Headers Response -> content-disposition
     * 
     * @param {string} nomeArquivo 
     */
    function pegarNomeArquivo(nomeArquivo) {
        var nomeArquivoAux = nomeArquivo;
        var regex = /filename=.*/g;

        if (!nomeArquivoAux) {
            return nomeArquivoAux
        }

        nomeArquivoAux = nomeArquivoAux.match(regex);

        if (!nomeArquivoAux) {
            return nomeArquivoAux;
        }

        nomeArquivoAux = nomeArquivoAux[0].replace("filename=", "");

        return nomeArquivoAux;
    }

    /**
     * Salva string em arquivo texto.
     * 
     * @param {String} data 
     * @param {String} filename 
     */
    function saveTextAsFile(data, filename) {

        if (!data) {
            return;
        }

        if (!filename)
            filename = 'console.json'

        var blob = new Blob([data], {type: 'text/plain'}),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')


        // FOR IE:
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
            e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    }

    /**
     * Exibe a mensagem de falha ao fazer o download do arquivo.
     */
    function msgFalhaBaixarArquivo() {
        $scope.showErrorMessage("Falha ao fazer o download do arquivo.");
    }

    /**
     * Insere um detalhe no array de detalhes para excluir
     * @param {JSON} detalhe 
     */
    function inserirDetalhesExcluir(detalhe) {

        if (!$scope.detalhesExcluir) {
            $scope.detalhesExcluir = [];
        }

        var jaInserido = $scope.detalhesExcluir.some(element => {
            return element.idDetalhe == detalhe.idDetalhe;
        });

        if (!jaInserido) {
            $scope.detalhesExcluir.push(detalhe);
        }
    }

    /**
     * Remove os detalhes excluidos da tabela de resultado da pesquisa.
     */
    function removerDetalhesExcluidosTable() {
        $scope.detalhesExcluir.forEach(detalhe => {
            $scope.gestaoVendaResultados = $scope.gestaoVendaResultados.filter((element) => element.idDetalhe != detalhe.idDetalhe);
        });

        $scope.detalhesExcluir = [];
    }

    function resetarPagina() {
        $scope.gestaoVendaResultados = [];
        $scope.totalItems = 0;
        $scope.dadosSemaforo = {};
    }

    /**
     * Compara os itens do array de detalhes selecionados com os itens
     * do resultado da pesquisa e marca o checkbox como true caso esteja
     * no array de itens para excluir.
     */
    function marcarLinhaComoSelecionada() {
        $scope.detalhesExcluir.forEach(detalheExcluir => {

            for (var i = 0; i < $scope.gestaoVendaResultados.length; i++) {

                if (detalheExcluir.idDetalhe == $scope.gestaoVendaResultados[i].idDetalhe) {
                    $scope.gestaoVendaResultados[i].isChecked = true;
                    break;
                }

            }
        })
    }

    $scope.init = function () {

        //para dar tempo de carregar o moment-picker e o calendario ficar em Portugues.
        $timeout(function() {
            $scope.dataInicial = moment(moment().date(1).format("DD/MM/YYYY"), "DD/MM/YYYY");
            $scope.dataFinal = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
            $scope.dataInicialArquivo = moment(moment().date(1).format("DD/MM/YYYY"), "DD/MM/YYYY");
            $scope.dataFinalArquivo = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
        }, 1000)

        UsuarioService.buscarEmpresa().then(
                function success(response) {
                    if (response.data.length > 0) {
                        $scope.empresaCaList = response.data;
                    } else {
                        $scope.showErrorMessage("Empresa(s) não tem dados de cartão.");
                    }
                },
                function (result) {
                    console.log('Error:' + result);
                }
        );
    };

    function mascaraCnpj(valor) {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
    }

    $scope.init();

    $scope.$watch('empresa', function (novoCnpjSelecionado, antigoCnpjSelecionado) {
        if (novoCnpjSelecionado !== antigoCnpjSelecionado) {
            var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);
            if (empresaCa) {
                $scope.empresaUsuLogado = empresaCa;
                empId = empresaCa.idEmpresaCa;
                idSegmento = empresaCa.idSegmento;
                $scope.nomeEmpresa = empresaCa.razaoSocial;
                $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
                loadLojas();
                loadVisoes();
            } else {
                empId = '';
            }
        }
    });

    //Soma dos valores para exibição no detalhe do bilhete
    $scope.somaValorBruto = 0;
    $scope.somaValorTxAdmin = 0;
    $scope.somaValorTxAntecip = 0;
    $scope.somaValorLiquido = 0;

    $scope.setTotals = function (detalhe) {
        if (detalhe) {
            $scope.somaValorBruto += detalhe.valorBruto;
            $scope.somaValorTxAdmin += detalhe.valorTxAdmin;
            $scope.somaValorTxAntecip += detalhe.taxaAntecipacao;
            $scope.somaValorLiquido += detalhe.valorLiquido;
        }
    }

    $scope.zeraTotals = function () {
        $scope.somaValorBruto = 0;
        $scope.somaValorTxAdmin = 0;
        $scope.somaValorTxAntecip = 0;
        $scope.somaValorLiquido = 0;
    }

});
