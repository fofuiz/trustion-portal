angular.module('trustionPortal').controller('VendasDetalheController', function($scope, $stateParams, $filter, $state, CacheCartoesService, VendasService, UTF8){

    google.charts.load('current', {'packages':['corechart']});

    angular.element(document).ready(function () {
        $scope.alt = $("#div_vendas_chart").width()/1.5;
        $('#vendas_chart').css('height', $scope.alt);
        graficosResize();
    });

    $(window).resize(function() {
        if($("#div_vendas_chart").length != 0){
            $scope.alt = $("#div_vendas_chart").width()/1.5;
            $('#vendas_chart').css('height', $scope.alt);
            graficosResize();
        }
    });

    function graficosResize(){
        try{
            DrawChart();
        }catch (exception){
            console.log(exception);
        }
    }

    $scope.vendas = [];
    $scope.vendasArranjo = [];

    $scope.separadorCampo = ';';

    $scope.options = {
        legend: {
            position:'labeled'
            /*,
            alignment:'center'*/
        },
        pieSliceText: 'none',
        pieSliceTextStyle: {
            color: 'white'
        },
        enableInteractivity: false,
        /*colors : [ '#008241', '#00a863', '#008c49', '#007339', '#00bb77', '#004b25', '#00cb4f'],*/
        'width': '460px',
        'height': '300px',
        pieHole: 0.4,
        chartArea: {
            width:'100%',
            left:10,
            right:10,
            top:10,
            bottom:10,
            height:'100%'
        }
    };

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

    configurarPaginacao();

    function loadPage(){
        var res = VendasService.detalheTotalVendasProdutoPeriodo(CacheCartoesService.vendas.operadora.id);
        $scope.operadora = CacheCartoesService.vendas.operadora.operadora;
        $scope.produto = CacheCartoesService.vendas.operadora.bandeira;
        $scope.dataInicial = new Date(CacheCartoesService.vendasGrid.dataInicial);
        $scope.dataFinal = new Date(CacheCartoesService.vendasGrid.dataFinal);
        $scope.vendas = res.data;
        console.log(JSON.stringify($scope.vendas));
        converterParaArranjo('vendas', 'vendasArranjo');
        console.log(JSON.stringify($scope.vendasArranjo));
        DrawChart();
        var rest = VendasService.detalheVendasGrid();
        $scope.vendasGrid = rest.data;
        $scope.pag_totalRegistros = $scope.vendasGrid.length;
        $scope.paginacao = true;
        $scope.isPesquisaFeita = true;
    }

    loadPage();

    function DrawChart() {

        // Create the data table.
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Tipos');
        data.addColumn('number', 'Valores');

        var linhas = [];

        for(var i = 0; i<$scope.vendasArranjo.length;i++){
            linhas.push([$scope.vendasArranjo[i].tipo, $scope.vendasArranjo[i].valor]);
        }

        data.addRows(linhas);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('vendas_chart'));

        chart.draw(data, $scope.options);
    }

    function converterParaArranjo(arranjoIn, arranjoOut){
        $scope[arranjoOut] = [];
        for(var i = 0;i<$scope[arranjoIn].length;i++){
            $scope[arranjoOut].push({
                tipo: $scope[arranjoIn][i].bandeira,
                valor: $scope[arranjoIn][i].total
            });
        }
    }

    function exibirMensagemErro(mensagem){
        $scope.isExibirMensagemErro = true;
        $scope.mensagemErro = mensagem;
    }

    function ocultarMensagemErro(){
        $scope.isExibirMensagemErro = false;
        $scope.mensagemErro = '';
    }

    $scope.voltar = function () {
        $state.go('vendas', {"volta" : 1});
    }

    $scope.exportar = function(){
        ocultarMensagemErro();
        $scope.isDadosInvalidos = false;
        var separadorLinha = '\n';
        var registrosExport = '';
        if($scope.vendasGrid != undefined){
            registrosExport =
                'Empresa' + $scope.separadorCampo +
                'Ponto de Venda' + $scope.separadorCampo +
                'Data Venda' + $scope.separadorCampo +
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
                'Banco' + $scope.separadorCampo +
                 UTF8.Agencia + $scope.separadorCampo +
                'Conta ' + separadorLinha;
            for(i = 0; i<$scope.vendasGrid.length;i++){
                registrosExport += $scope.vendasGrid[i].emp != null ? $scope.vendasGrid[i].emp : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_ponto_venda != null ? $scope.vendasGrid[i].cod_ponto_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_data_venda != null ? $scope.vendasGrid[i].cod_data_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].nro_plano != null ? $scope.vendasGrid[i].nro_plano : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_status != null ? $scope.vendasGrid[i].cod_status : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_lote_bandeira != null ? $scope.vendasGrid[i].cod_lote_bandeira : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].nro_nsu != null ? $scope.vendasGrid[i].nro_nsu : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_autorizacao != null ? $scope.vendasGrid[i].cod_autorizacao : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].cod_numerocartao != null ? $scope.vendasGrid[i].cod_numerocartao : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].vlr_bruto != null ? $filter('realbrasileiro')($scope.vendasGrid[i].vlr_bruto) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].vlr_comissao != null ? $filter('realbrasileiro')($scope.vendasGrid[i].vlr_comissao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].vlr_taxa_antecipacao != null ? $filter('realbrasileiro')($scope.vendasGrid[i].vlr_taxa_antecipacao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].vlr_liquido != null ? $filter('realbrasileiro')($scope.vendasGrid[i].vlr_liquido) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].banco != null ? $scope.vendasGrid[i].banco : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].agencia != null ? $scope.vendasGrid[i].agencia : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.vendasGrid[i].conta != null ? '' + $scope.vendasGrid[i].conta : ' ';

                registrosExport += separadorLinha;
            }

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