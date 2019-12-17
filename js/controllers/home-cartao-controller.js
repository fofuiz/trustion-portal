angular.module('trustionPortal').controller('HomeCartaoController', function($scope, CategorizacaoCartoesService, TableauTokenService, EmpresaService, $location){

    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});


    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.


    $scope.vendas = [];
    $scope.recebimentos = [];
    $scope.recebimentosFuturos = [];
    $scope.arranjoRecebimentos = [];
    $scope.arranjoVendas = [];
    $scope.arranjoRecebimentosFuturos = [];
    $scope.tableauTokenCartoes = "";
    $scope.empFilter = "";
    $scope.maquina = $location.host();

    var vendasDivChart = 'vendas_chart';
    var recebimentosDivChart = 'recebimentos_chart';
    var recebimentosFuturosDivChart = 'recebimentos_futuros_chart';

    var vendas = 'VENDAS';
    var recebimentos = 'RECEBIMENTOS';
    var recebimentos_futuros = 'RECEBIMENTOS_FUTUROS';

    angular.element(document).ready(function () {
        resizeGraficos();
        $scope.tableauHeight = $(window).height();
    });

    $(window).resize(function() {
        resizeGraficos();
        $scope.tableauHeight = $(window).height();
    });

    function resizeGraficos(){
        if($("#divcartao").length !== 0){
            $scope.altCartoes = $("#divcartao").width()/1.7;
            $('#vendas_chart').css('height', $scope.altCartoes);
            $('#recebimentos_chart').css('height', $scope.altCartoes);
            $('#recebimentos_futuros_chart').css('height', $scope.altCartoes);
            DrawChart($scope.arranjoVendas, vendasDivChart);
            DrawChart($scope.arranjoRecebimentos, recebimentosDivChart);
            DrawChart($scope.arranjoRecebimentosFuturos, recebimentosFuturosDivChart);
        }
    }

    function exibirMensagemErro(mensagem){
        $scope.mensagemErro = mensagem;
        $scope.isExibirMensagemErro = true;
    }

    function ocultarMensagemErro(){
        $scope.mensagemErro = '';
        $scope.isExibirMensagemErro = false;
    }


    $scope.options = {
        sliceVisibilityThreshold: 0,
        legend: {
            position:'labeled'
            /*,
            alignment:'center'*/
        },
        pieSliceText: 'none',
        pieStartAngle: 50,
        pieSliceTextStyle: {
            color: 'white'
        },
        enableInteractivity: false,
        /*colors : [ '#008241', '#00a863', '#008c49', '#007339', '#00bb77', '#004b25', '#00cb4f'],*/
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

    loadPage();

    function loadPage(){
        carregarVendasOperadoras();
        carregarRecebimentosOperadoras();
        carregarRecebimentosFuturosOperadoras();
        setTokenTableau();
    }

    function carregarVendasOperadoras(){
        CategorizacaoCartoesService.totalPorOperadoraPeriodo(vendas).then(
        function successCallback(res) {
            for(var i = 0;i<res.data.length;i++){
                $scope.vendas.push(res.data[i]);
            }
            converterParaArranjo('vendas', 'arranjoVendas');
            DrawChart($scope.arranjoVendas, vendasDivChart);
        },
        function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o ' + UTF8.grafico + ' de vendas por operadoras. Favor, entrar em contato com o administrador do sistema.');
            }
        });
        // Set a callback to run when the Google Visualization API is loaded.
        //google.charts.setOnLoadCallback(VendasDrawChart);
    }

    function carregarRecebimentosOperadoras(){
        CategorizacaoCartoesService.totalPorOperadoraPeriodo(recebimentos).then(
        function successCallback(res){
            for(var i = 0;i<res.data.length;i++){
                $scope.recebimentos.push(res.data[i]);
            }
            converterParaArranjo('recebimentos', 'arranjoRecebimentos');
            DrawChart($scope.arranjoRecebimentos, recebimentosDivChart);
        },
        function errorCallback(res){
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o ' + UTF8.grafico + ' de recebimentos por operadoras. Favor, entrar em contato com o administrador do sistema.');
            }
        });
    }

    function carregarRecebimentosFuturosOperadoras(){
        CategorizacaoCartoesService.totalPorOperadoraPeriodo(recebimentos_futuros).then(
            function successCallback(res) {
                $scope.recebimentosFuturos = res.data;
                converterParaArranjo('recebimentosFuturos', 'arranjoRecebimentosFuturos');
                DrawChart($scope.arranjoRecebimentosFuturos, recebimentosFuturosDivChart);
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o ' + UTF8.grafico + ' de recebimentos futuros por operadoras. Favor, entrar em contato com o administrador do sistema.');
                }
            });
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

    function converterRecebimentosParaArranjoRecebimentos(){
        $scope.arranjoRecebimentos = [];
        for(var i = 0;i<$scope.recebimentos.length;i++){
            $scope.arranjoRecebimentos.push({
                tipo: $scope.recebimentos[i].operadora,
                valor: $scope.recebimentos[i].total
            });
        }
    }

    function converterOperadoraVendasParaArranjoVendas(index){
        $scope.arranjoVendas = [];
        for(var i = 0;i<$scope.vendas[index].produtos.length;i++){
            $scope.arranjoVendas.push({
                tipo:  $scope.vendas[index].produtos[i].nome,
                valor: $scope.vendas[index].produtos[i].total
            });
        }
    }

    function DrawChart(arranjo, divRenderizacao) {

        // Create the data table.
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Tipos');
        data.addColumn('number', 'Valores');

        var linhas = [];

        for(var i = 0; i<arranjo.length;i++){
            linhas.push([arranjo[i].tipo, arranjo[i].valor]);
        }

        data.addRows(linhas);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById(divRenderizacao));

        chart.draw(data, $scope.options);
    }
    
    $scope.carregarProdutoVendasId = function (index) {

        if($scope.vendas[index].hasOwnProperty('produtos')){
            //converterVendasParaArranjoVendas();
            //DrawChart($scope.arranjoVendas, vendasDivChart);
            delete $scope.vendas[index].produtos;
            return;
        }

        for(var i = 0;i<$scope.vendas.length;i++){
            if($scope.vendas[i].hasOwnProperty('produtos')){
                delete $scope.vendas[i].produtos;
            }
        }
        var id = $scope.vendas[index].codigoOperadora;
        CategorizacaoCartoesService.totalPorProdutoPeriodo(vendas, id).then(
            function successCallback(res) {
                $scope.vendas[index].produtos = res.data;
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os produtos da operadora ' + $scope.vendas[index].operadora + ' da categoria de vendas. Favor, entrar em contato com o administrador do sistema.');
                }
            });
        //converterOperadoraVendasParaArranjoVendas(index);
        //DrawChart($scope.arranjoVendas, vendasDivChart);
    }

    $scope.carregarProdutoRecebimentosId = function (index) {

        if($scope.recebimentos[index].hasOwnProperty('produtos')){
            //converterVendasParaArranjoVendas();
            //DrawChart($scope.arranjoVendas, vendasDivChart);
            delete $scope.recebimentos[index].produtos;
            return;
        }

        for(var i = 0;i<$scope.recebimentos.length;i++){
            if($scope.recebimentos[i].hasOwnProperty('produtos')){
                delete $scope.recebimentos[i].produtos;
            }
        }
        var id = $scope.recebimentos[index].codigoOperadora;
        CategorizacaoCartoesService.totalPorProdutoPeriodo(recebimentos, id).then(
            function successCallback(res) {
                $scope.recebimentos[index].produtos = res.data;
            },
            function errorCallback(res){
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os produtos da operadora ' + $scope.vendas[index].operadora + ' da categoria de recebimentos. Favor, entrar em contato com o administrador do sistema.');
                }
            }
        );
        //converterOperadoraVendasParaArranjoVendas(index);
        //DrawChart($scope.arranjoVendas, vendasDivChart);
    }

    $scope.carregarProdutosRecebimentosFuturosId = function (index) {

        if($scope.recebimentosFuturos[index].hasOwnProperty('produtos')){
            //converterVendasParaArranjoVendas();
            //DrawChart($scope.arranjoVendas, vendasDivChart);
            delete $scope.recebimentosFuturos[index].produtos;
            return;
        }

        for(var i = 0;i<$scope.recebimentosFuturos.length;i++){
            if($scope.recebimentosFuturos[i].hasOwnProperty('produtos')){
                delete $scope.recebimentosFuturos[i].produtos;
            }
        }
        var id = $scope.recebimentosFuturos[index].codigoOperadora;
        CategorizacaoCartoesService.totalPorProdutoPeriodo(recebimentos_futuros, id).then(
            function successCallback(res) {
                $scope.recebimentosFuturos[index].produtos = res.data;
            },
            function errorCallback(res){
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os produtos da operadora ' + $scope.vendas[index].operadora + ' da categoria de recebimentos futuros. Favor, entrar em contato com o administrador do sistema.');
                }
            }
        );
        //converterOperadoraVendasParaArranjoVendas(index);
        //DrawChart($scope.arranjoVendas, vendasDivChart);
    }

    function setTokenTableau(type){
        if($scope.empFilter == "" || $scope.empFilter == "CNPJ=0"){
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
                }
            );
        }
        if($scope.tableauTokenCartoes === ''){
            getTableauTokenCartoes();
        
        }
    }

    function getTableauTokenCartoes(){
        TableauTokenService.getToken().then(
            function successCallback(res) {
                $scope.tableauTokenCartoes = res.data.token;                            
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o token do dashboard. Favor, entrar em contato com o administrador do sistema.');
                }
            }
        );
    }

});