angular.module('trustionPortal').controller('RecebimentosDetalheController', function($scope, $stateParams, $filter, $state, CacheCartoesService, RecebimentosService, UTF8){

    google.charts.load('current', {'packages':['corechart']});

    angular.element(document).ready(function () {
        $scope.alt = $("#div_rec_chart").width()/1.5;
        $('#recebimentos_chart').css('height', $scope.alt);
        graficosResize();
    });

    $(window).resize(function() {
        if($("#div_rec_chart").length != 0){
            $scope.alt = $("#div_rec_chart").width()/1.5;
            $('#recebimentos_chart').css('height', $scope.alt);
            graficosResize();
        }
    });

    function graficosResize(){
        try{
            DrawChart();
        }catch(exception){
            console.warn(exception);
        }
    }

    $scope.recebimentos = [];
    $scope.recebimentosArranjo = [];

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
        var res = RecebimentosService.detalheTotalRecebimentosProdutoPeriodo(CacheCartoesService.recebimentos.operadora.id);
        $scope.operadora = CacheCartoesService.recebimentos.operadora.operadora;
        $scope.produto = CacheCartoesService.recebimentos.operadora.bandeira;
        $scope.dataInicial = new Date(CacheCartoesService.recebimentosGrid.dataInicial);
        $scope.dataFinal = new Date(CacheCartoesService.recebimentosGrid.dataFinal);
        $scope.recebimentos = res.data;
        console.log(JSON.stringify($scope.recebimentos));
        converterParaArranjo('recebimentos', 'recebimentosArranjo');
        console.log(JSON.stringify($scope.recebimentosArranjo));
        DrawChart();
        var rest = RecebimentosService.detalheRecebimentosGrid();
        $scope.recebimentosGrid = rest.data;
        $scope.pag_totalRegistros = $scope.recebimentosGrid.length;
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

        for(var i = 0; i<$scope.recebimentosArranjo.length;i++){
            linhas.push([$scope.recebimentosArranjo[i].tipo, $scope.recebimentosArranjo[i].valor]);
        }

        data.addRows(linhas);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('recebimentos_chart'));

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
        $state.go('recebimentos', {"volta" : 1});
    }

    $scope.exportar = function(){
        ocultarMensagemErro();
        $scope.isDadosInvalidos = false;
        var separadorLinha = '\n';
        var registrosExport = '';
        if($scope.recebimentosGrid != undefined){
            registrosExport =
                'Empresa' + $scope.separadorCampo +
                'Ponto de Venda' + $scope.separadorCampo +
                'Data Venda' + $scope.separadorCampo +
                'Parcela' + $scope.separadorCampo +
                'Plano' + $scope.separadorCampo +
                'Status' + $scope.separadorCampo +
                'Lote' + $scope.separadorCampo +
                'NSU' + $scope.separadorCampo +
                 UTF8.Autorizacao + $scope.separadorCampo +
                'Valor da Venda' + $scope.separadorCampo +
                'Taxa Administrativa' + $scope.separadorCampo +
                'Taxa de ' + UTF8.Antecipacao + $scope.separadorCampo +
                'Valor ' + UTF8.Liquido + $scope.separadorCampo +
                'Data de ' + UTF8.Credito + $scope.separadorCampo +
                'Banco' + $scope.separadorCampo +
                 UTF8.Agencia + $scope.separadorCampo +
                'Conta ' + separadorLinha;
            for(i = 0; i<$scope.recebimentosGrid.length;i++){
                registrosExport += $scope.recebimentosGrid[i].emp != null ? $scope.recebimentosGrid[i].emp : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_ponto_venda != null ? $scope.recebimentosGrid[i].cod_ponto_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_data_venda != null ? $scope.recebimentosGrid[i].cod_data_venda : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].nro_parcela != null ? $scope.recebimentosGrid[i].nro_parcela : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].nro_plano != null ? $scope.recebimentosGrid[i].nro_plano : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_status != null ? $scope.recebimentosGrid[i].cod_status : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_lote_bandeira != null ? $scope.recebimentosGrid[i].cod_lote_bandeira : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].nro_nsu != null ? $scope.recebimentosGrid[i].nro_nsu : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_autorizacao != null ? $scope.recebimentosGrid[i].cod_autorizacao : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].vlr_bruto != null ? $filter('realbrasileiro')($scope.recebimentosGrid[i].vlr_bruto) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].vlr_comissao != null ? $filter('realbrasileiro')($scope.recebimentosGrid[i].vlr_comissao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].vlr_taxa_antecipacao != null ? $filter('realbrasileiro')($scope.recebimentosGrid[i].vlr_taxa_antecipacao) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].vlr_liquido != null ? $filter('realbrasileiro')($scope.recebimentosGrid[i].vlr_liquido) : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].cod_data_credito != null ? $scope.recebimentosGrid[i].cod_data_credito : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].banco != null ? $scope.recebimentosGrid[i].banco : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].agencia != null ? $scope.recebimentosGrid[i].agencia : ' ';
                registrosExport += $scope.separadorCampo;
                registrosExport += $scope.recebimentosGrid[i].conta != null ? '' + $scope.recebimentosGrid[i].conta : ' ';

                registrosExport += separadorLinha;
            }

            console.log('iniciando exporta&ccedil;&atilde;o');
            console.log(registrosExport.toString());
            //windows-1252
            var csvContent = registrosExport,
                textEncoder = new CustomTextEncoder('ISO-8859-1', {NONSTANDARD_allowLegacyEncoding: true}),
                fileName = 'recebimentos-'+ new Date($scope.dataInicial).toLocaleDateString("pt-BR") +'-'+ new Date($scope.dataFinal).toLocaleDateString("pt-BR") +'.csv';

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
                    fileName = 'recebimentos-'+ new Date($scope.dataInicial).toLocaleDateString("pt-BR") +'-'+ new Date($scope.dataFinal).toLocaleDateString("pt-BR") +'.csv';

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