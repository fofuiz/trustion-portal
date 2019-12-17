angular.module('trustionPortal').controller('AluguelEquipamentosController', function ($scope, $filter, aluguelEquipamentoService, UsuarioService, TrustionHelpers, $timeout) {

    $scope.itensPorPagina = 10;
    $scope.numeroDePaginas = 0;
    $scope.qtdeTotalDeItens = 0;
    $scope.paginaAtual = 1;
    $scope.numeroMaximoDeBotoes = 5;

    var dataAtual = new Date();
    var primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

    var ctrl = this;
    ctrl.dataInicial = moment(primeiroDia);
    ctrl.dataFinal = moment(dataAtual);


    $scope.buscarEmpresa = function (callback) {
        UsuarioService.buscarEmpresa().then(
                function (result) {
                    if (result.data.length > 0) {
                        $scope.empresaCaList = result.data;
                    } else {
                        $scope.showErrorMessage("Empresa(s) não tem dados de cartão.");
                    }
                }, function (result) {
            console.log('Error:' + result);
        }
        );
    };

    function mascaraCnpj(valor) {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
    }

    $scope.buscarEmpresa();

    $scope.pesquisaAluguelEquipmanento = function () {
        if(!$scope.empId){
            $scope.showErrorMessage("Selecione uma empresa.");
            return;
        }
        var empId = $scope.empId;
        var dataInicial = moment(ctrl.dataInicial).format('YYYY-MM-DD');
        var dataFinal = moment(ctrl.dataFinal).format('YYYY-MM-DD');
        $scope.loading = aluguelEquipamentoService.buscarAluguelEquipamento(empId, dataInicial, dataFinal).then(function (result) {
            if (result.data.length > 0) {
                $scope.hideMessage();
                $scope.bandeiraEquipamentos = result.data;
                $scope.bandeiras = getBandeiras($scope.bandeiraEquipamentos);
                $scope.aluguelEquipamentos = getAlugueis($scope.bandeiraEquipamentos);
                $scope.totalAluguelEquipamentos = result.data[0].totalBandeira;
                $scope.showTable = true;
                $scope.qtdeTotalDeItens = $scope.aluguelEquipamentos.length;
            } else {
                $scope.showErrorMessage("Não foram encontrados dados para esta pesquisa.");
                $scope.showTable = false;
            }
            $scope.loading = false;
        }, function (result) {
            $scope.loading = false;
            $scope.showErrorMessage("Erro ao pesquisar.");
            $scope.showTable = false;
        });
    };

    /**
     * Obtem a lista de bandeiras retornadas no resultado
     * 
     * 
     * @param {Array} registros 
     */
    function getBandeiras(registros) {
        var bandeirasList = [];

        if (registros.length === 0) {
            return bandeirasList;
        }

        registros.forEach(registro => {
            bandeirasList.push(registro.aluguelEquipamentos[0].bandeira);
        });

        return bandeirasList;
    }

    /**
     * Obtem a lista de todos os alugueis retornadas no resultado
     * 
     * 
     * @param {Array} registros 
     */
    function getAlugueis(registros) {
        var aluguelList = [];

        if (registros.length === 0) {
            return aluguelList;
        }

        registros.forEach(registro => {
            registro.aluguelEquipamentos.forEach(aluguel => {
                aluguelList.push(aluguel);
            });

        });

        return aluguelList;
    }

    $scope.exportAluguelEquipmanento = function () {

        var data = new Date();

        var month = eval(data.getMonth() + 1);

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }

        var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

        var strHTML = "<table>";

        strHTML += '<tr bgcolor="#747476">';

        strHTML += '<th><font color="#FFFFFF">Data</th>';
        $scope.bandeiras.forEach(bd => {
            strHTML += '<th><font color="#FFFFFF">' + bd + '</th>';
        });
        strHTML += '<th><font color="#FFFFFF">Loja</th>';

        strHTML += "</tr>";

        angular.forEach($scope.aluguelEquipamentos, function (value, key) {

            strHTML += '<tr>';

            strHTML += '<td>' + $filter('date')(value.dataCredito, 'dd/MM/yyyy') + '</td>';
            $scope.bandeiras.forEach(bd => {
                if (value.bandeira === bd) {
                    strHTML += '<td>' + $filter('currency')(value.valor) + '</td>';
                } else {
                    strHTML += '<td></td>'
                }

            });
            strHTML += '<td>' + value.loja + '</td>';

            strHTML += "</tr>";

        });

        strHTML += '<tr bgcolor="#333">';
        strHTML += '<td></td>';
        $scope.bandeiras.forEach(bd => {
            $scope.bandeiraEquipamentos.forEach(be => {
                if (be.aluguelEquipamentos[0].bandeira === bd) {
                    strHTML += '<td><font color="#FFFFFF">' + $filter('currency')(be.totalBandeira) + '</td>';
                }
            });
        });

        strHTML += '<td></td>';
        strHTML += "</tr>";


        strHTML += "</table>";

        var blob = new Blob([strHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
        });

        saveAs(blob, "ASConciliacao_ConciliacaoResumo_" + stringData + ".xls");

    };

    $scope.$watch('empresa', function (novoCnpjSelecionado, antigoCnpjSelecionado) {
        if (novoCnpjSelecionado !== antigoCnpjSelecionado) {
            var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);
            if(empresaCa) {
                $scope.empId = empresaCa.idEmpresaCa;
                $scope.nomeEmpresa = empresaCa.razaoSocial;
                $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
            } else {
                $scope.empId = '';
            }
        }
    });

});