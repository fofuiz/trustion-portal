angular.module('trustionPortal').controller('TaxasAntecipacaoController', function ($scope, $filter, taxaAntecipacaoService, UsuarioService, TrustionHelpers) {

    function agruparRegistros(todosRegistros) {
        var arrayAux = [];
        var arrayRetorno = [];
        var indicesList = [];

        for (i = 0; i < todosRegistros.length; i++) {
            var indice = "" + todosRegistros[i].operadora + todosRegistros[i].produto + todosRegistros[i].loja;
            indice = indice.replace(/ /g, '');

            if (arrayAux[indice]) {
                arrayAux[indice]['taxas'][todosRegistros[i].plano] = todosRegistros[i].taxa;
            } else {
                indicesList.push(indice)
                arrayAux[indice] = [];
                arrayAux[indice]['taxas'] = [];
                arrayAux[indice]['produto'] = todosRegistros[i].produto;
                arrayAux[indice]['operadora'] = todosRegistros[i].operadora;
                arrayAux[indice]['loja'] = todosRegistros[i].loja;
                arrayAux[indice]['taxas'][todosRegistros[i].plano] = todosRegistros[i].taxa;
            }

        }

        indicesList.forEach(function (value, index) {
            arrayRetorno[index] = arrayAux[value];
        });

        return arrayRetorno;
    }

    var dataAtual = new Date();
    var primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    $scope.dataInicial = moment(primeiroDia);
    $scope.dataFinal = moment(dataAtual);

    /**
     * Percorre o array de taxas verificando se tem taxa, se tiver seta true no index
     * para ocultar ou exibir a coluna relacionada a taxa na tabela de resultado.
     * 
     * @param {Array} taxasAntecipacaoAgrupadas
     * @returns array de 12 posicoes com true e false.
     */
    function ocultarExibirColuna(taxasAntecipacaoAgrupadas) {
        var taxasAntecipacao = taxasAntecipacaoAgrupadas;
        var temTaxa = new Array(12).fill(false);

        taxasAntecipacao.forEach(taxaAntecipacao => {

            taxaAntecipacao.taxas.forEach((taxa, index) => {
                temTaxa[index] = true;
            });
        });

        return temTaxa;
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

    $scope.pesquisaTxAntecipacao = function () {
        if (!$scope.empId) {
            $scope.showErrorMessage("Selecione uma empresa.");
            return;
        }
        var dataInicial = moment($scope.dataInicial).format('YYYYMMDD');
        var dataFinal = moment($scope.dataFinal).format('YYYYMMDD');
        var registrosAgrupados;

        $scope.loading = taxaAntecipacaoService.buscarTaxaAntecipacao(dataInicial, dataFinal, $scope.empId).then(function (result) {

            if (result.data.length > 0) {
                $scope.hideMessage();
                registrosAgrupados = agruparRegistros(result.data);
                $scope.taxasAntecipacao = registrosAgrupados;
                $scope.temTaxa = ocultarExibirColuna(registrosAgrupados);//exibe ou oculta a coluna de taxas na view (tabela de resultado)
                $scope.showTable = true;
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
     * Exporta as taxas de antecipacao no formato csv.
     */
    $scope.exportTxAntecipacao = function () {
        var nomeArquivo = '';
        var cabecalhoCsv = "Loja;Operadora;Produto;";
        var corpoCsv = '';
        var arquivoCsv;
        var linha;

        $scope.temTaxa.forEach((element, index) => {
            if (element) {
                cabecalhoCsv = cabecalhoCsv + index + ';';
            }
        });

        cabecalhoCsv = cabecalhoCsv + '\n';

        $scope.taxasAntecipacao.forEach(taxaAntecipacao => {
            linha = taxaAntecipacao['loja'] + ';' + taxaAntecipacao['operadora'] + ';' + taxaAntecipacao['produto'] + ';';

            for (var i = 1; i < taxaAntecipacao.taxas.length; i++) {
                linha = linha + (taxaAntecipacao.taxas[i] ? ($filter('number')(taxaAntecipacao.taxas[i], 2)) : '') + ';';
            }

            linha = linha + '\n';
            corpoCsv = corpoCsv + linha;
        });

        nomeArquivo = moment().format('YYYYMMDDHHmmss') + '-taxas_antecipacao-';
        nomeArquivo = nomeArquivo + moment($scope.dataInicial, 'DD/MM/YYYY').format('YYYYMMDD') + '-' + moment($scope.dataFinal, 'DD/MM/YYYY').format('YYYYMMDD') + '.csv';
        arquivoCsv = cabecalhoCsv + corpoCsv;
        saveTextAsFile(arquivoCsv, nomeArquivo);
    };

    $scope.showTable = false;

    $scope.buscarEmpresa = function () {
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

    $scope.buscarEmpresa();

    function mascaraCnpj(valor) {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
    }

    $scope.$watch('empresa', function (novoCnpjSelecionado, antigoCnpjSelecionado) {
        if (novoCnpjSelecionado !== antigoCnpjSelecionado) {
            var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);
            if (empresaCa) {
                $scope.empId = empresaCa.idEmpresaCa;
                $scope.nomeEmpresa = empresaCa.razaoSocial;
                $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
            } else {
                $scope.empId = '';
            }
        }
    });


});
