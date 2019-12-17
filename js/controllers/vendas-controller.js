angular.module('trustionPortal').controller('VendasController', function($scope, $state, $sce, $stateParams, $filter, VendasService, CacheCartoesService, CacheService, TableauTokenService, EmpresaService, UTF8, $location){

    $scope.minData = moment().subtract(90, 'day');
    $scope.maxData = moment().subtract(0, 'day');

   /* $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }*/

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

    // Load the Visualization API and the piechart package.
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
    $scope.obj = {};

    $scope.isPesquisaFeita = false;

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

        console.log('--> VendasController.configurarPaginacao');

        $scope.paginacao = false;

        $scope.pag_desabilitado = false;
        $scope.pag_tamanho = 5;
        $scope.pag_registrosPorPagina = 5;
        $scope.pag_totalRegistros = 0;
        $scope.pag_paginaSelecionada = 1;

        console.log('<-- VendasController.configurarPaginacao');
    }

    configurarPaginacao();

    function loadPage(){
        if($stateParams.volta){
            console.log("passei por aqui");
            $scope.dataInicial = CacheCartoesService.vendasGrid.dataInicial;
            $scope.dataFinal = CacheCartoesService.vendasGrid.dataFinal;
            $scope.vendasGrid = CacheCartoesService.vendasGrid.grid;
            $scope.vendasArranjo = CacheCartoesService.vendasGrid.grafico;
            DrawChart();
            $scope.pag_totalRegistros = CacheCartoesService.vendasGrid.pag_totalRegistros;
            $scope.pag_paginaSelecionada = CacheCartoesService.vendasGrid.pag_paginaSelecionada;
            $scope.paginacao = true;
            $scope.isPesquisaFeita = true;
        }
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
                tipo: $scope[arranjoIn][i].operadora,
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
    
    $scope.pesquisarVendas = function (isValid) {
        ocultarMensagemErro();
        $scope.paginacao = false;

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

            $scope.obj.dataInicial = dataInicialEnvio;
            $scope.obj.dataFinal = dataFinalEnvio;

            var res = VendasService.totalVendasPorOperadoraPeriodo();
            $scope.vendas = res.data;
            /*console.log(JSON.stringify($scope.vendas));*/
            converterParaArranjo('vendas', 'vendasArranjo');
            /*console.log(JSON.stringify($scope.vendasArranjo));*/
            DrawChart();
            var rest = VendasService.totalVendasPorProdutoPeriodo();
            $scope.vendasGrid = rest.data;
            $scope.pag_totalRegistros = $scope.vendasGrid.length;
            $scope.paginacao = true;
            $scope.isPesquisaFeita = true;

        }else{
            $scope.paginacao = false;
            if($scope.formVendas.dataInicial.$error.required){
                exibirMensagemErro('Favor, preencher a data inicial.');
                return;
            }

            if($scope.formVendas.dataFinal.$error.required){
                exibirMensagemErro('Favor, preencher a data final.');
                return;
            }
        }
    }

    $scope.detalheVendas = function(operadora){
        console.log("passei para ir pro detalhe da venda" + JSON.stringify(operadora));
        $scope.obj.operadora = operadora;
        CacheCartoesService.vendas = $scope.obj;
        CacheCartoesService.vendasGrid = {};
        CacheCartoesService.vendasGrid.dataInicial = $scope.dataInicial;
        CacheCartoesService.vendasGrid.dataFinal = $scope.dataFinal;
        CacheCartoesService.vendasGrid.grid = $scope.vendasGrid;
        CacheCartoesService.vendasGrid.pag_totalRegistros = $scope.vendasGrid.length;
        CacheCartoesService.vendasGrid.pag_paginaSelecionada = $scope.pag_paginaSelecionada;
        CacheCartoesService.vendasGrid.grafico = $scope.vendasArranjo;
        console.log("passei por aqui!");
        $state.go('vendasDetalhe');
        console.log("depois do route");
    };

    $scope.exportar = function(){
        ocultarMensagemErro();
        $scope.isDadosInvalidos = false;
        var separadorLinha = '\n';
        var registrosExport = '';
        if($scope.vendasGrid != undefined){
                registrosExport = 'Operadora' + $scope.separadorCampo +  'Bandeira' + $scope.separadorCampo + 'Valor Total' + $scope.separadorCampo + 'Quantidade de CVs' + $scope.separadorCampo + 'Ticket ' + UTF8.Medio + separadorLinha;
                for(i = 0; i<$scope.vendasGrid.length;i++){
                    registrosExport += $scope.vendasGrid[i].operadora != null ? $scope.vendasGrid[i].operadora : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += $scope.vendasGrid[i].bandeira != null ? $scope.vendasGrid[i].bandeira : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += $scope.vendasGrid[i].total != null ? $filter('realbrasileiro')($scope.vendasGrid[i].total) : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += $scope.vendasGrid[i].cvs != null ? $scope.vendasGrid[i].cvs : ' ';
                    registrosExport += $scope.separadorCampo;
                    registrosExport += $scope.vendasGrid[i].ticket != null ? $filter('realbrasileiro')($scope.vendasGrid[i].ticket) : ' ';
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