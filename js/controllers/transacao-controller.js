angular.module('trustionPortal').controller('TransacaoController', function($scope, $filter, TransacaoService, TableauTokenService, EmpresaService, UTF8, $location){

    TableauTokenService.getToken().then(
        function successCallback(res) {
            $scope.tableauHeight = $(window).height();
            $scope.tableauToken = res.data.token;
            $scope.maquina = $location.host();
            //$scope.tableauEnd = 'https://tableau.accesstage.com.br/trusted/' + $scope.tableauToken + '/t/trustion/views/Brinks_dev_vendas/PaineldeVendas?:embed=y&showVizHome=no';
            console.log($scope.tableauToken);
        },
        function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o token do dashboard. Favor, entrar em contato com o administrador do sistema.');
            }
        });

    EmpresaService.listarEmpresasCNPJs().then(
        function successCallback(res) {
            if(res.data != '' && res.data.length !== 0) {
                $scope.empFilter = "CNPJ=";
                res.data.forEach(function (item, index) {
                    $scope.empFilter += item.cnpj;
                    if(index !== res.data.length-1) {
                        $scope.empFilter += ",";
                    }
                });
            }else {
                $scope.empFilter = "CNPJ=0";
            }
        },
        function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o filtro de empresas do dashboard. Favor, entrar em contato com o administrador do sistema.');
            }
        });


    angular.element(document).ready(function () {
        $scope.tableauHeight = $(window).height();
        console.log($(window).height());
    });

    $(window).resize(function() {
        $scope.tableauHeight = $(window).height();
    });


    function loadPage(){
        configurarPaginacao();
        $scope.minData = moment().subtract(90, 'day');
        $scope.maxData = moment().subtract(0, 'day');
        $scope.pontoVendas = TransacaoService.carregarPontoVendas();
        $scope.operadoras = TransacaoService.carregarOperadoras();
        $scope.produtos = TransacaoService.carregarProdutos();
    }

    loadPage();

    function configurarPaginacao() {

        console.log('--> GrupoEconomicoController.configurarPaginacao');

        $scope.paginacao = false;

        $scope.pag_desabilitado = false;
        $scope.pag_tamanho = 5;
        $scope.pag_registrosPorPagina = 5;
        $scope.pag_totalRegistros = 0;
        $scope.pag_paginaSelecionada = 1;

        console.log('<-- GrupoEconomicoController.configurarPaginacao');
    }

    function exibirMensagemErro(mensagem){
        $scope.isExibirMensagemErro = true;
        $scope.mensagemErro = mensagem;
    }

    function ocultarMensagemErro(){
        $scope.isExibirMensagemErro = false;
        $scope.mensagemErro = '';
    }

    $scope.isPesquisaFeita = false;


    $scope.pesquisarTransacao = function (isValid) {
        ocultarMensagemErro();

        if(isValid){
            var dataInicialEnvio = new Date($scope.dataInicial);
            var dataFinalEnvio = new Date($scope.dataFinal);

            var hoje = new Date();

            dataInicialEnvio.setHours(0,0,0);
            dataFinalEnvio.setHours(23,59,59);

            if(dataInicialEnvio.getTime() >= dataFinalEnvio.getTime()){
                $scope.isExibirMensagemErro = true;
                $scope.mensagemErro = 'Intervalo de datas '+UTF8.invalido+'!';
                return;
            }

            $scope.transacaoPesquisa = {};
            $scope.transacaoPesquisa.dataInicial = dataInicialEnvio.getTime();
            $scope.transacaoPesquisa.dataFinal = dataFinalEnvio.getTime();
            $scope.transacaoPesquisa.nsu = $scope.nsu;
            $scope.transacaoPesquisa.autorizacao = $scope.autorizacao;
            $scope.transacaoPesquisa.tid = $scope.tid;
            $scope.transacaoPesquisa.pontoVenda = $scope.pontoVenda;
            $scope.transacaoPesquisa.operadora = $scope.operadora;
            $scope.transacaoPesquisa.produto = $scope.produto;

            var res = TransacaoService.carregarTransacoes($scope.transacaoPesquisa);
            $scope.transacaoGrid = res.data;
            console.log(res.data.length);
            $scope.pag_totalRegistros = res.data.length;
            console.log($scope.pag_totalRegistros);
            $scope.paginacao = true;
            $scope.isPesquisaFeita = true;

        }else{
            $scope.paginacao = false;
            if($scope.formTransacao.dataInicial.$error.required || $scope.formTransacao.dataFinal.$error.required){
                exibirMensagemErro('Os campos de data '+ UTF8.sao +' '+ UTF8.obrigatorios +'. Por favor, informe o '+ UTF8.periodo +' desejado.');
                return;
            }
        }

    }

    $scope.mudaPagina = function(){
        console.log($scope.pag_paginaSelecionada);
    }

    $scope.exportar = function(){
        ocultarMensagemErro();
        $scope.isDadosInvalidos = false;
        var separadorLinha = '\n';
        $scope.separadorCampo = ';';
        var registrosExport = '';
        if($scope.transacaoGrid != undefined){
            registrosExport =
                'Data Venda' + $scope.separadorCampo +
                'Operadora' + $scope.separadorCampo +
                'Produto' + $scope.separadorCampo +
                'Ponto de Venda' + $scope.separadorCampo +
                'Parcela' + $scope.separadorCampo +
                'Plano' + $scope.separadorCampo +
                'Status' + $scope.separadorCampo +
                'Lote' + $scope.separadorCampo +
                'NSU' + $scope.separadorCampo +
                UTF8.Autorizacao + $scope.separadorCampo +
                UTF8.Cartao + $scope.separadorCampo +
                'Valor da Venda' + $scope.separadorCampo +
                'Taxa Administrativa' + $scope.separadorCampo +
                'Taxa de ' + UTF8.Antecipacao + $scope.separadorCampo +
                'Valor ' + UTF8.Liquido + $scope.separadorCampo +
                'Data de ' + UTF8.Credito + $scope.separadorCampo +
                'Banco' + $scope.separadorCampo +
                UTF8.Agencia + $scope.separadorCampo +
                'Conta ' + separadorLinha;
            for(i = 0; i<$scope.transacaoGrid.length;i++){
                registrosExport += $scope.transacaoGrid[i].cod_data_venda != null ? $scope.transacaoGrid[i].cod_data_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_operadora != null ? $scope.transacaoGrid[i].cod_operadora : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_produto != null ? $scope.transacaoGrid[i].cod_produto : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_ponto_venda != null ? $scope.transacaoGrid[i].cod_ponto_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].nro_parcela != null ? $scope.transacaoGrid[i].nro_parcela : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].nro_plano != null ? $scope.transacaoGrid[i].nro_plano : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_status != null ? $scope.transacaoGrid[i].cod_status : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_lote_bandeira != null ? $scope.transacaoGrid[i].cod_lote_bandeira : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].nro_nsu != null ? $scope.transacaoGrid[i].nro_nsu : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_autorizacao != null ? $scope.transacaoGrid[i].cod_autorizacao : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_numerocartao != null ? $scope.transacaoGrid[i].cod_numerocartao : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].vlr_bruto != null ? $filter('realbrasileiro')($scope.transacaoGrid[i].vlr_bruto) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].vlr_comissao != null ? $filter('realbrasileiro')($scope.transacaoGrid[i].vlr_comissao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].vlr_taxa_antecipacao != null ? $filter('realbrasileiro')($scope.transacaoGrid[i].vlr_taxa_antecipacao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].vlr_liquido != null ? $filter('realbrasileiro')($scope.transacaoGrid[i].vlr_liquido) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].cod_data_credito != null ? $scope.transacaoGrid[i].cod_data_credito : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].banco != null ? $scope.transacaoGrid[i].banco : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].agencia != null ? $scope.transacaoGrid[i].agencia : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.transacaoGrid[i].conta != null ? '' + $scope.transacaoGrid[i].conta : ' ';

                registrosExport += separadorLinha;
            }

            console.log('iniciando exporta&ccedil;&atilde;o');
            console.log(registrosExport.toString());
            //windows-1252
            var csvContent = registrosExport,
                textEncoder = new CustomTextEncoder('ISO-8859-1', {NONSTANDARD_allowLegacyEncoding: true}),
                fileName = 'transacao-'+ new Date($scope.dataInicial).toLocaleDateString("pt-BR") +'-'+ new Date($scope.dataFinal).toLocaleDateString("pt-BR") +'.csv';

            //windows-1252
            var csvContentEncoded = textEncoder.encode([csvContent]);
            var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=ISO-8859-1;'});
            saveAs(blob, fileName);
            $scope.mensagem = UTF8.Nao + ' foi ' + UTF8.possivel + ' exportar os registros de auditoria. Contate o Administrador';
        }else{
            if($scope.isPesquisaFeita){
                console.log('iniciando exporta&ccedil;&atilde;o');
                console.log(registrosExport.toString());
                //windows-1252
                var csvContent = registrosExport,
                    textEncoder = new CustomTextEncoder('ISO-8859-1', {NONSTANDARD_allowLegacyEncoding: true}),
                    fileName = 'vendas-'+ new Date($scope.dataInicial).toLocaleDateString("pt-BR") +'-'+ new Date($scope.dataFinal).toLocaleDateString("pt-BR") +'.csv';

                //windows-1252
                var csvContentEncoded = textEncoder.encode([csvContent]);
                var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=ISO-8859-1;'});
                saveAs(blob, fileName);
                /*$scope.mensagem = UTF8.Nao + ' foi2';
                $scope.isDadosInvalidos = true;*/
            }else{
                exibirMensagemErro("Por favor, selecione o " + UTF8.periodo + " e clique em pesquisar antes de efetuar a " + UTF8.exportacao + ".");
            }
        }

    }


});