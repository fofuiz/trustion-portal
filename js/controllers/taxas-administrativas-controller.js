angular.module('trustionPortal').controller('TaxasAdministrativasController',
    function ($scope, $filter, TrustionHelpers, $timeout, $state, TaxasAdministrativasService, UsuarioService, valoresComboService) {

        $scope.tipo = "T";
        $scope.hideMessage();

        var dataAtual = new Date();
        var primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        $scope.dataInicial = moment(primeiroDia);
        $scope.dataFinal = moment(dataAtual);
        var filtroTaxasPage = {};

        configurarPaginacao();

        $scope.pesquisar = function () {

            if(!$scope.empId){
                $scope.showErrorMessage('Selecione uma empresa.');
                return;
            }
            
            var filtro = new Object();
            filtro.idsEmp = $scope.empId;
            filtro.codLoja = $scope.codLoja;
            filtro.tipo = $scope.tipo;
            filtro.dataInicial = moment($scope.dataInicial, "DD/MM/YYYY").format("YYYYMMDD");
            filtro.dataFinal = moment($scope.dataFinal, "DD/MM/YYYY").format("YYYYMMDD");
            filtroTaxasPage = angular.copy(filtro);
            $scope.pag_paginaSelecionada = 1;

            $scope.pesquisarPorPagina($scope.pag_paginaSelecionada);

        }

        $scope.pesquisarPorPagina = function (currentPage) {

            var pagina = currentPage;

            TaxasAdministrativasService.getTaxasAdministrativasCriterios(filtroTaxasPage, pagina, $scope.pag_registrosPorPagina).then(
                function (result) {
                    if (result.data.length > 0) {
                        $scope.hideMessage();
                        $scope.showTable = true;
                        $scope.taxasAdm = agruparRegistros(result.data);
                        $scope.temTaxa = exibirColunasTaxas($scope.taxasAdm);
                        $scope.pag_totalRegistros = result.data[0].totalRegistros;
                        $scope.pag_paginaSelecionada = currentPage;
                        $scope.paginacao = true;
                    } else {
                        $scope.showTable = false;
                        $scope.showErrorMessage('Não foram encontrados dados para esta pesquisa.');
                    }

                }, 
                function errorCallback(result) {
                    $scope.showTable = false;
                    $scope.showErrorMessage("Não foram encontrados dados para esta pesquisa.");
                }
            );

        }

        $scope.cadastrarTaxasAdministrativas = function () {
            $state.go('taxasAdministrativasCadastro');
        }

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

        $scope.exportar = function () {
            var taxasExportar;
            var filtro = new Object();

            filtro.idsEmp = $scope.empId;
            filtro.codLoja = $scope.codLoja;
            filtro.tipo = $scope.tipo;                
            filtro.dataInicial = moment($scope.dataInicial, "DD/MM/YYYY").format("YYYYMMDD");
            filtro.dataFinal = moment($scope.dataFinal, "DD/MM/YYYY").format("YYYYMMDD");

            TaxasAdministrativasService.getTaxasAdministrativasCriterios(filtro).then(
                function (result) {
                    taxasExportar = agruparRegistros(result.data);
                    gerarExcel(taxasExportar)
                }, function (result) {
                    $scope.showErrorMessage("Erro ao exportar.");
                }
            );
        }

        $scope.exportarComparacao = function () {
            var taxasExportar;
            var filtro = new Object();

            filtro.idsEmp = $scope.empId;
            filtro.codLoja = $scope.codLoja;
            filtro.tipo = $scope.tipo;                
            filtro.dataInicial = moment($scope.dataInicial, "DD/MM/YYYY").format("YYYYMMDD");
            filtro.dataFinal = moment($scope.dataFinal, "DD/MM/YYYY").format("YYYYMMDD");

            TaxasAdministrativasService.getTaxasAdministrativasCriterios(filtro).then(
                function (result) {
                    taxasExportar = agruparRegistros(result.data);
                    gerarExcelComparacao(taxasExportar)
                }, function (result) {
                    $scope.showErrorMessage("Erro ao exportar comparação.");
                }
            );
        }

        function gerarExcelComparacao(taxasExportar) {
            var temTaxa = exibirColunasTaxas(taxasExportar);
            var data = new Date();
            var month = eval(data.getMonth() + 1);

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }

            var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

            var strHTML = "<table>";

            strHTML += '<tr bgcolor="#747476">';

            strHTML += '<th><font color="#FFFFFF"></th>';
            strHTML += '<th><font color="#FFFFFF"></th>';
            strHTML += '<th><font color="#FFFFFF"></th>';
            strHTML += '<th><font color="#FFFFFF"></th>';
            strHTML += '<th><font color="#FFFFFF">Taxa Praticada</th>';
            if (temTaxa[1]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[2]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[3]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[4]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[5]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[6]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[7]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[8]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[9]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[10]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[11]) strHTML += '<th><font color="#FFFFFF"></th>';
            strHTML += '<th><font color="#FFFFFF">Taxa Cadastrada</th>';
            if (temTaxa[1]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[2]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[3]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[4]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[5]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[6]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[7]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[8]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[9]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[10]) strHTML += '<th><font color="#FFFFFF"></th>';
            if (temTaxa[11]) strHTML += '<th><font color="#FFFFFF"></th>';

            strHTML += "</tr>";

            strHTML += '<tr bgcolor="#747476">';

            strHTML += '<th><font color="#FFFFFF">Loja</th>';
            strHTML += '<th><font color="#FFFFFF">Ponto de Venda</th>';
            strHTML += '<th><font color="#FFFFFF">Operadora</th>';
            strHTML += '<th><font color="#FFFFFF">Produto</th>';
            if (temTaxa[0]) strHTML += '<th><font color="#FFFFFF">1</th>';
            if (temTaxa[1]) strHTML += '<th><font color="#FFFFFF">2</th>';
            if (temTaxa[2]) strHTML += '<th><font color="#FFFFFF">3</th>';
            if (temTaxa[3]) strHTML += '<th><font color="#FFFFFF">4</th>';
            if (temTaxa[4]) strHTML += '<th><font color="#FFFFFF">5</th>';
            if (temTaxa[5]) strHTML += '<th><font color="#FFFFFF">6</th>';
            if (temTaxa[6]) strHTML += '<th><font color="#FFFFFF">7</th>';
            if (temTaxa[7]) strHTML += '<th><font color="#FFFFFF">8</th>';
            if (temTaxa[8]) strHTML += '<th><font color="#FFFFFF">9</th>';
            if (temTaxa[9]) strHTML += '<th><font color="#FFFFFF">10</th>';
            if (temTaxa[10]) strHTML += '<th><font color="#FFFFFF">11</th>';
            if (temTaxa[11]) strHTML += '<th><font color="#FFFFFF">12</th>';

            if (temTaxa[0]) strHTML += '<th><font color="#FFFFFF">1</th>';
            if (temTaxa[1]) strHTML += '<th><font color="#FFFFFF">2</th>';
            if (temTaxa[2]) strHTML += '<th><font color="#FFFFFF">3</th>';
            if (temTaxa[3]) strHTML += '<th><font color="#FFFFFF">4</th>';
            if (temTaxa[4]) strHTML += '<th><font color="#FFFFFF">5</th>';
            if (temTaxa[5]) strHTML += '<th><font color="#FFFFFF">6</th>';
            if (temTaxa[6]) strHTML += '<th><font color="#FFFFFF">7</th>';
            if (temTaxa[7]) strHTML += '<th><font color="#FFFFFF">8</th>';
            if (temTaxa[8]) strHTML += '<th><font color="#FFFFFF">9</th>';
            if (temTaxa[9]) strHTML += '<th><font color="#FFFFFF">10</th>';
            if (temTaxa[10]) strHTML += '<th><font color="#FFFFFF">11</th>';
            if (temTaxa[11]) strHTML += '<th><font color="#FFFFFF">12</th>';

            strHTML += "</tr>";

            angular.forEach(taxasExportar, function (value, key) {

                strHTML += '<tr>';
                strHTML += '<td>' + (value.loja ? value.loja : '')+ '</td>';
                strHTML += '<td>' + (value.pontoVenda ? value.pontoVenda : '') + '</td>';
                strHTML += '<td>' + (value.operadora ? value.operadora : '') + '</td>';
                strHTML += '<td>' + (value.produto ? value.produto : '') + '</td>';
                if (temTaxa[0]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[0]) + '">' + (value.taxas[0] ? $filter("formatDecimal")(value.taxas[0].taxa) : '-') + '</td>';
                if (temTaxa[1]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[1]) + '">' + (value.taxas[1] ? $filter("formatDecimal")(value.taxas[1].taxa) : '-') + '</td>';
                if (temTaxa[2]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[2]) + '">' + (value.taxas[2] ? $filter("formatDecimal")(value.taxas[2].taxa) : '-') + '</td>';
                if (temTaxa[3]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[3]) + '">' + (value.taxas[3] ? $filter("formatDecimal")(value.taxas[3].taxa) : '-') + '</td>';
                if (temTaxa[4]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[4]) + '">' + (value.taxas[4] ? $filter("formatDecimal")(value.taxas[4].taxa) : '-') + '</td>';
                if (temTaxa[5]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[5]) + '">' + (value.taxas[5] ? $filter("formatDecimal")(value.taxas[5].taxa) : '-') + '</td>';
                if (temTaxa[6]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[6]) + '">' + (value.taxas[6] ? $filter("formatDecimal")(value.taxas[6].taxa) : '-') + '</td>';
                if (temTaxa[7]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[7]) + '">' + (value.taxas[7] ? $filter("formatDecimal")(value.taxas[7].taxa) : '-') + '</td>';
                if (temTaxa[8]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[8]) + '">' + (value.taxas[8] ? $filter("formatDecimal")(value.taxas[8].taxa) : '-') + '</td>';
                if (temTaxa[9]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[9]) + '">' + (value.taxas[9] ? $filter("formatDecimal")(value.taxas[9].taxa) : '-') + '</td>';
                if (temTaxa[10]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[10]) + '">' + (value.taxas[10] ? $filter("formatDecimal")(value.taxas[10].taxa) : '-') + '</td>';
                if (temTaxa[11]) strHTML += '<td>' + '<font color="' + setarCorFonte(value.taxas[11]) + '">' + (value.taxas[11] ? $filter("formatDecimal")(value.taxas[11].taxa) : '-') + '</td>';

                if (temTaxa[0]) strHTML += '<td>' + (value.taxas[0] ? $filter("formatDecimal")(value.taxas[0].txCadastrada) : '-') + '</td>';
                if (temTaxa[1]) strHTML += '<td>' + (value.taxas[1] ? $filter("formatDecimal")(value.taxas[1].txCadastrada) : '-') + '</td>';
                if (temTaxa[2]) strHTML += '<td>' + (value.taxas[2] ? $filter("formatDecimal")(value.taxas[2].txCadastrada) : '-') + '</td>';
                if (temTaxa[3]) strHTML += '<td>' + (value.taxas[3] ? $filter("formatDecimal")(value.taxas[3].txCadastrada) : '-') + '</td>';
                if (temTaxa[4]) strHTML += '<td>' + (value.taxas[4] ? $filter("formatDecimal")(value.taxas[4].txCadastrada) : '-') + '</td>';
                if (temTaxa[5]) strHTML += '<td>' + (value.taxas[5] ? $filter("formatDecimal")(value.taxas[5].txCadastrada) : '-') + '</td>';
                if (temTaxa[6]) strHTML += '<td>' + (value.taxas[6] ? $filter("formatDecimal")(value.taxas[6].txCadastrada) : '-') + '</td>';
                if (temTaxa[7]) strHTML += '<td>' + (value.taxas[7] ? $filter("formatDecimal")(value.taxas[7].txCadastrada) : '-') + '</td>';
                if (temTaxa[8]) strHTML += '<td>' + (value.taxas[8] ? $filter("formatDecimal")(value.taxas[8].txCadastrada) : '-') + '</td>';
                if (temTaxa[9]) strHTML += '<td>' + (value.taxas[9] ? $filter("formatDecimal")(value.taxas[9].txCadastrada) : '-') + '</td>';
                if (temTaxa[10]) strHTML += '<td>' + (value.taxas[10] ? $filter("formatDecimal")(value.taxas[10].txCadastrada) : '-') + '</td>';
                if (temTaxa[11]) strHTML += '<td>' + (value.taxas[11] ? $filter("formatDecimal")(value.taxas[11].txCadastrada) : '-') + '</td>';

                strHTML += '</tr>';

            });

            strHTML += "</table>";

            var blob = new Blob([strHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
            });

            saveAs(blob, "Taxas_Administrativas_Comparacao" + stringData + ".xls");
        }

        function gerarExcel(taxasExportar) {
            var data = new Date();
            var month = eval(data.getMonth() + 1);

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }

            var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

            var strHTML = "<table>";

            strHTML += '<tr bgcolor="#747476">';

            strHTML += '<th><font color="#FFFFFF">Loja</th>';
            strHTML += '<th><font color="#FFFFFF">Ponto de Venda</th>';
            strHTML += '<th><font color="#FFFFFF">Operadora</th>';
            strHTML += '<th><font color="#FFFFFF">Produto</th>';
            strHTML += '<th><font color="#FFFFFF">1</th>';
            strHTML += '<th><font color="#FFFFFF">2</th>';
            strHTML += '<th><font color="#FFFFFF">3</th>';
            strHTML += '<th><font color="#FFFFFF">4</th>';
            strHTML += '<th><font color="#FFFFFF">5</th>';
            strHTML += '<th><font color="#FFFFFF">6</th>';
            strHTML += '<th><font color="#FFFFFF">7</th>';
            strHTML += '<th><font color="#FFFFFF">8</th>';
            strHTML += '<th><font color="#FFFFFF">9</th>';
            strHTML += '<th><font color="#FFFFFF">10</th>';
            strHTML += '<th><font color="#FFFFFF">11</th>';
            strHTML += '<th><font color="#FFFFFF">12</th>';

            strHTML += "</tr>";

            angular.forEach(taxasExportar, function (value, key) {

                strHTML += '<tr>';

                strHTML += '<td>' + (value.loja ? value.loja : '')+ '</td>';
                strHTML += '<td>' + (value.pontoVenda ? value.pontoVenda : '') + '</td>';
                strHTML += '<td>' + (value.operadora ? value.operadora : '') + '</td>';
                strHTML += '<td>' + (value.produto ? value.produto : '') + '</td>';
                strHTML += '<td>' + (value.taxas[0] ? $filter("formatDecimal")(value.taxas[0].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[1] ? $filter("formatDecimal")(value.taxas[1].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[2] ? $filter("formatDecimal")(value.taxas[2].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[3] ? $filter("formatDecimal")(value.taxas[3].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[4] ? $filter("formatDecimal")(value.taxas[4].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[5] ? $filter("formatDecimal")(value.taxas[5].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[6] ? $filter("formatDecimal")(value.taxas[6].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[7] ? $filter("formatDecimal")(value.taxas[7].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[8] ? $filter("formatDecimal")(value.taxas[8].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[9] ? $filter("formatDecimal")(value.taxas[9].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[10] ? $filter("formatDecimal")(value.taxas[10].taxa) : '') + '</td>';
                strHTML += '<td>' + (value.taxas[12] ? $filter("formatDecimal")(value.taxas[11].taxa) : '') + '</td>';

                strHTML += '</tr>';

            });

            strHTML += "</table>";

            var blob = new Blob([strHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
            });

            saveAs(blob, "Taxas_Administrativas_" + stringData + ".xls");
        }

        /**
         * Agrupa o resultado da pesquisa por loja, ponto de venda, operador e produto
         * 
         * 
         * @param {Array} registros 
         */
        function agruparRegistros(registros) {
            var agrupados = [];

            if (registros.length === 0) {
                return agrupados;
            }

            agrupados.push(novaLinhaTabela(registros[0]));

            registros.forEach(registro => {
                var temRegistro = false;
                registro.id = registro.loja + "" + registro.pontoVenda + "" + registro.operadora + "" + registro.produto;

                agrupados.forEach(agrupado => {
                    if (registro.id === agrupado.id) {
                        temRegistro = true;
                        agrupado.taxas[registro.plano - 1] = atualizaArrayTaxas(agrupado.taxas[registro.plano - 1], registro);
                    }
                });

                if (!temRegistro) {
                    agrupados.push(novaLinhaTabela(registro));
                }
            });

            return agrupados;
        }

        /**
         * Representa uma nova linha na tabela de resultado da pesquisa
         * 
         * @param {JSON} taxaAdm
         * @returns {JSON} Representa a linha da tabela de resultado na view.
         */
        function novaLinhaTabela(taxaAdm) {
            var linhaTabela = new Object();
            var taxa = new Object();

            taxa.taxa = taxaAdm.taxa;
            taxa.txCadastrada = taxaAdm.txCadastrada * 100;
            taxa.taxasSaoIguais = taxasSaoIguais(taxa.taxa, taxa.txCadastrada);
            taxa.plano = taxaAdm.plano;

            linhaTabela.id = taxaAdm.loja + "" + taxaAdm.pontoVenda + "" + taxaAdm.operadora + "" + taxaAdm.produto;
            linhaTabela.loja = taxaAdm.loja;
            linhaTabela.pontoVenda = taxaAdm.pontoVenda;
            linhaTabela.operadora = taxaAdm.operadora;
            linhaTabela.produto = taxaAdm.produto;
            linhaTabela.taxas = new Array(12);

            linhaTabela.taxas[taxaAdm.plano - 1] = taxa;

            return linhaTabela;
        }

        /**
         * Atualiza o array de taxas da linha da tabela de resultado da pesquisa.
         * 
         * Se a taxa ja existir, retorna a propria taxa.
         * Se a taxa nao exisitr, eh cria da uma para receber os dados novos.
         * 
         * @param {JSON} taxa Taxa que vai receber os dados novos.
         * @param {JSON} taxaDadosNovos Taxa que fornece os dados novos.
         */
        function atualizaArrayTaxas(taxa, taxaDadosNovos) {

            if (!taxa) {
                taxa = new Object();
                taxa.taxa = taxaDadosNovos.taxa;
                taxa.txCadastrada = taxaDadosNovos.txCadastrada * 100;
                taxa.taxasSaoIguais = taxasSaoIguais(taxa.taxa, taxa.txCadastrada);
                taxa.plano = taxaDadosNovos.plano;
            }

            return taxa;
        }

        /**
         * Verifica se a taxa pratica eh igual a taxa cadastrada.
         * 
         * @param {number} taxaPraticada 
         * @param {number} taxaCadastrada 
         * @returns 'null' se uma das taxas for null ou for vazia.
         * @returns 'igual' se as taxas forem iguais.
         * @returns 'diferente' se as taxas forem diferentes
         */
        function taxasSaoIguais(taxaPraticada, taxaCadastrada) {
            _taxaPraticada = (Math.round(taxaPraticada * 100) / 100);
            _taxaCadastrada = (Math.round(taxaCadastrada * 100) / 100);

            if (!_taxaPraticada || !_taxaCadastrada) {
                return null;
            }

            if (_taxaPraticada === _taxaCadastrada) {
                return "igual";
            }

            if (_taxaPraticada !== _taxaCadastrada) {
                return "diferente";
            }
        }

        /**
         * Percorre as taxas das administrativas agrupadas e coloca true na coluna que tem dados para exibir
         * essa coluna na tabela de resultado da pesquisa.
         * 
         * @param {Array} taxasAdmAgrupadas 
         */
        function exibirColunasTaxas(taxasAdmAgrupadas) {
            var temTaxa = new Array(12);

            taxasAdmAgrupadas.forEach(taxaAdm => {
                for (var i = 0; i < taxaAdm.taxas.length; i++) {

                    if (taxaAdm.taxas[i]) {
                        temTaxa[i] = true;
                    }
                }
            });

            return temTaxa;
        }

        /**
         * Seta a cor da fonte na planilha como vermelho se as taxas forem diferentes.
         * 
         * @param {JSON} taxa
         * @returns vermelho se as taxas forem diferentes.
         */
        function setarCorFonte(taxa) {

            if (!taxa) {
                return '#000000';
            }

            if (taxa.taxasSaoIguais && taxa.taxasSaoIguais === 'igual') {
                return '#000000';
            }

            if (taxa.taxasSaoIguais && taxa.taxasSaoIguais === 'diferente') {
                return '#FF0000';
            }

            return '#000000';
        }

        function configurarPaginacao() {
            $scope.pag_desabilitado = false;
            $scope.pag_tamanho = 5;
            $scope.pag_registrosPorPagina = 26;
            $scope.pag_totalRegistros = 0;
            $scope.pag_paginaSelecionada = 0;
        }

        $scope.$watch('empresa', function (novoCnpjSelecionado, antigoCnpjSelecionado) {
            if (novoCnpjSelecionado !== antigoCnpjSelecionado) {
                var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);
                if(empresaCa) {
                    $scope.empId = empresaCa.idEmpresaCa;
                    $scope.nomeEmpresa = empresaCa.razaoSocial;
                    $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
                    loadLojas($scope.empId);
                } else {
                    $scope.empId = '';
                    $scope.lojas = [];
                }
            }
        });

        /**
         * Carrega o combo de lojas
         */
        var loadLojas = function (empId) {
            valoresComboService.getLojas(empId).then(
                function (result) {
                    $scope.lojas = result.data;
                }, function (result) {
                    console.log('Error:' + result);
                }
            );
        };

    }
);
