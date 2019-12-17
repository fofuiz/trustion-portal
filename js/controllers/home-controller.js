angular.module('trustionPortal').controller('HomeController', function ($scope, $filter, CacheService, RelatorioAnaliticoTotalService, CategorizacaoCartoesService, UTF8, TableauTokenService, EmpresaService, $location) {
    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    angular.element(document).ready(function () {
        $scope.tableauHeight = $(window).height();
    });

    $(window).resize(function() {
        $scope.tableauHeight = $(window).height();
    });

    $scope.modulos = [
        {
            nome: 'numerarios',
            funcao: function() {
                if(CacheService.usuario.data.principal.idPerfil !== 1){ //1 - perfil Administrador
                    carregarGridNumerarios();
                }
                $scope.serieColetado = "Coletado";
                $scope.serieConferido = "Conferido";
                $scope.serieCreditado = "Creditado";
            }
        },
        {
            nome: 'cartoes',
            funcao: function () {
                carregarGraficoCartoes();
                carregarGridCartoes();
            }
        }
    ];

    $scope.dadosNumerarios = [];
    $scope.labelsNumerarios = [];

    $scope.dadosCartoes = [];
    $scope.labelsCartoes = [];
    $scope.activeNav = "";
    $scope.tableauTokenNumD0 ="";
    $scope.tableauTokenNumD1 ="";
    $scope.tableauTokenCartoes ="";
    $scope.allMods = [
        {"mod":"numerarios", "label": "Numerários"},
        {"mod":"cartoes", "label":"Cartões"},
        //{"mod":"cheques", "label": "Cheques" } -> Será descomentado posteriormente.
    ];
    $scope.modsEnable = [];
    $scope.defaultLoad ="";
    $scope.empFilter = "";
    $scope.isAdminModNumerarios  = true;
    $scope.maquina = $location.host();

    $scope.options = {
        sliceVisibilityThreshold: 0,
        pieStartAngle: 50,
        legend: {
            position:'labeled'
        },
        pieSliceText: 'none',
        pieSliceTextStyle: {
            color: 'white',
            fontSize:0.5
        },
        enableInteractivity: false,
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

    function exibirMensagemErro(mensagem){
        $scope.mensagemErro = mensagem;
        $scope.isExibirMensagemErro = true;
    }

    function ocultarMensagemErro(){
        $scope.mensagemErro = '';
        $scope.isExibirMensagemErro = false;
    }

    function NumerariosDrawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Tipos');
        data.addColumn('number', 'Valores');

        var linhas = [];

        for(var i = 0; i<$scope.dadosNumerarios.length;i++){
            linhas.push([$scope.labelsNumerarios[i], $scope.dadosNumerarios[i]]);
        }

        data.addRows(linhas);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div1'));

        chart.draw(data, $scope.options);
    }

    function CartoesDrawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        var self = $scope;
        data.addColumn('string', 'Tipos');
        data.addColumn('number', 'Valores');

        var linhas = [];

        for(var i = 0; i<$scope.dadosCartoes.length;i++){
            linhas.push([$scope.labelsCartoes[i], $scope.dadosCartoes[i]]);
        }

        data.addRows(linhas);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div2'));

        chart.draw(data, $scope.options);
    }

    loadPage();

    // after load check
    angular.element(function () {
        $("li."+$scope.defaultLoad).addClass("active");
    });

    function loadPage(){
        verificarModulos();
        ocultarMensagemErro();
        setDefaultNavActive();
    }

    function verificarModulos(){
        $scope.isAdminModNumerarios = CacheService.usuario.data.principal.idPerfil != 1;
        var mods = CacheService.usuario.data.principal.modulos;
        
        if( mods.length != $scope.modsEnable.length ){
            $scope.modsEnable = [];
            for(var i = 0;i<mods.length;i++){

                var mod = $scope.allMods.filter(function(m){
                    return m.mod == mods[i];
                });
                if(mod.length > 0){
                    $scope.modsEnable.push(mod[0]);
                }
            }
        }else{
            $scope.modsEnable = $scope.allMods;
        }
    }

    function carregarGridCartoes(){
        CategorizacaoCartoesService.totalPorVendaERecebimentos().then(function successCallback(res) {
            for(var i = 0; i<res.data.length; i++){
                if(res.data[i].tipo === 'Vendas'){
                    $scope.serieVendas = res.data[i].tipo;
                    $scope.valorVendas = $filter('realbrasileiro')(res.data[i].total);
                    $scope.transacao = res.data[i].numero;
                }
                if(res.data[i].tipo === 'Recebimentos'){
                    $scope.serieRecebimentos = res.data[i].tipo;
                    $scope.valorRecebimentos = $filter('realbrasileiro')(res.data[i].total);
                }
                if(res.data[i].tipo === 'Recebimentos Futuros'){
                    $scope.serieRecebimentosFuturos = res.data[i].tipo;
                    $scope.valorRecebimentosFuturos = $filter('realbrasileiro')(res.data[i].total);
                }
            }
        }, function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar os valores de vendas, recebimentos e recebimentos futuros. Favor, entrar em contato com o administrador do sistema.');
            }
        });
    }

    function carregarGridNumerarios(){

        RelatorioAnaliticoTotalService.totalCreditosPeriodoUsuario().then(
            function successCallback(res) {
                $scope.serieCreditado = res.data.serie;
                $scope.valorCreditado = $filter('realbrasileiro')(res.data.total);
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o valor de ' + UTF8.credito + '. Favor, entrar em contato com o administrador do sistema.');
                }
            });
    }

    function carregarGraficoCartoes(){
        CategorizacaoCartoesService.categorizacaoTipoProduto().then(
            function successCallback(res){
                for(var i = 0; i<res.data.length; i++){
                    $scope.labelsCartoes.push(converterDadosCartoes(res.data[i].tipo, res.data[i].tipoTransacao) + ' ' + $filter('realbrasileiro')(res.data[i].valor));
                    $scope.dadosCartoes.push(res.data[i].valor);
                }
                google.charts.setOnLoadCallback(CartoesDrawChart);
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o ' + UTF8.grafico + ' de ' + UTF8.cartoes + '. Favor, entrar em contato com o administrador do sistema.');
                }
            });
    }

    function converterDadosCartoes(tipo, tipoTransacao){
        if(tipo === 'D'){
            return UTF8.Debido;
        }else if(tipo === 'C' && tipoTransacao === 'VISTA'){
            return UTF8.Credito + ' ' + UTF8.aCrase + ' vista';
        }else if(tipo === 'C' && tipoTransacao === 'PARCELADO'){
            return UTF8.Credito + ' parcelado';
        }else{
            return 'Outros';
        }
    }

    /**
     * Carrega as navs :
     *      Numéricos
     *      Cartões
     */
    $scope.setActiveNav = setActiveNav;

    function setActiveNav(nav){
        $scope.activeNav = nav;
        $('.tab-content').removeClass('active');
        $('.nav-tabs [name="' + nav + '"]').tab('show');
        $('.'+ nav).addClass('active');

        setTokenTableau(nav);
    }

    function setDefaultNavActive(){
        if($scope.modsEnable.length > 0){
            $scope.defaultLoad = $scope.modsEnable[0].mod
            setActiveNav($scope.modsEnable[0].mod);            
        }        
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
        if(type === 'numerarios'){
            if( $scope.tableauTokenNumD0 === ''){
                getTableauTokenNumerariosD0();
            }

            if( $scope.tableauTokenNumD1 === ''){
                getTableauTokenNumerariosD1();
            }
        }
        else if( type === 'cartoes'){
            if($scope.tableauTokenCartoes === ''){
                getTableauTokenCartoes();
            }
        }
    }

    function getTableauTokenNumerariosD0(){
        TableauTokenService.getToken().then(
            function successCallback(res) {
                $scope.tableauTokenNumD0 = res.data.token;
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o token do dashboard. Favor, entrar em contato com o administrador do sistema.');
                }
            });
    }

    function getTableauTokenNumerariosD1(){
        TableauTokenService.getToken().then(
            function successCallback(res) {
                $scope.tableauTokenNumD1 = res.data.token;
            },
            function errorCallback(res) {
                if(res.data != null && res.data.hasOwnProperty('mensagem')){
                    exibirMensagemErro(res.data.mensagem);
                }else{
                    exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o token do dashboard. Favor, entrar em contato com o administrador do sistema.');
                }
            });
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
            });
    }

});