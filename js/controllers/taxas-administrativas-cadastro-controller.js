angular.module('trustionPortal').controller('TaxasAdministrativasCadastroController',
    function ($scope, $filter, TrustionHelpers, $state, $timeout, valoresComboService, TaxasAdministrativasService, UsuarioService) {

        $scope.hideMessage();

        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.maxSize = 5; //Number of pager buttons to show
        $scope.totalItems = 0; // sera atribuido o length do response

        $scope.editarTaxas = false;
        $scope.disabilitarFormPesquisa = false;
        $scope.taxasAdministrativas = [];
        $scope.taxasAdministrativasSalvar = [];
        $scope.filtro = {};

        /**
         * Carrega o combo de lojas
         */
        $scope.loadLojas = function () {
            var cnpj = $scope.cnpj;
            valoresComboService.getLojasByCnpjEmpresa(cnpj).then(
                function (result) {
                    $scope.lojas = result.data;
                }, function (result) {
                    console.log('Error:' + result);
                }
            );
        };

        /**
         * Carrega o combo de ponto de venda
         */
        $scope.loadPontoVendas = function () {
            var empId = $scope.empId;
            var codLoja = $scope.codLoja;

            $scope.pontoVendas = [];

            if(codLoja !== undefined){
                valoresComboService.getComboPontoVendaPorCodLoja(codLoja).then(
                    function (result) {
                        $scope.pontoVendas = result.data;
                    }, function (result) {
                        console.log('Error:' + result);
                    }
                );
            } else {
                valoresComboService.getComboPontoVenda(empId).then(
                    function (result) {
                        $scope.pontoVendas = result.data;
                    }, function (result) {
                        console.log('Error:' + result);
                    }
                );
            }
        };

        /**
         * carrega o combo de operadoras.
         */
        $scope.loadOperadoras = function () {
            valoresComboService.getOperadoras().then(
                function (result) {
                    $scope.operadoras = result.data;
                }, function (result) {
                    console.log('Error:' + result);
                }
            );
        };

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

        function mascaraCnpj(valor) {
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
        }

        $scope.operadoraOnChange = function () {
            loadProdsOperadoras();
        }

        $scope.pesquisar = function () {

            if(!$scope.empId){
                $scope.showErrorMessage('Selecione uma empresa.');
                return;
            }
            if(!$scope.filtro.codLoja){
                $scope.showErrorMessage('Selecione uma loja.');
                return;
            }
            if(!$scope.filtro.codPontoVenda){
                $scope.showErrorMessage('Selecione um ponto de venda.');
                return;
            }
            
            var filtro = new Object();
            $scope.currentPage = 1;
            $scope.filtro.empId = $scope.empId;
            filtro = $scope.filtro;
            $scope.taxasAdministrativasSalvar = [];

            TaxasAdministrativasService.getTaxasAdministrativas(filtro).then(
                function (result) {
                    $scope.taxasAdministrativas = result.data;

                    $scope.taxasAdministrativas.forEach(txAdm => {

                        for (var i = 1; i <= 12; i++) {
                            var nroPlano = "nroPlano" + i;

                            if (txAdm[nroPlano]) {
                                txAdm[nroPlano] = $filter("number")(txAdm[nroPlano] * 100, 2) + "%";
                            } else if (txAdm[nroPlano] == 0) {
                                txAdm[nroPlano] = '0,00%'
                            }
                        }
                    });

                    $scope.totalItems = $scope.taxasAdministrativas.length;
                }, function (result) {
                    $scope.showErrorMessage("Não foram encontrados dados para esta pesquisa.");
                }
            );
        }

        /**
         * Carrega o combo de produtos
         */
        function loadProdsOperadoras() {
            var codOperadora = $scope.filtro.codOperadora;

            if (!codOperadora || codOperadora == '') {
                $scope.prodsOperadoras = [];
                return;
            }

            valoresComboService.getProdsOperadoras(codOperadora).then(
                function (result) {
                    $scope.prodsOperadoras = result.data;
                }
            );
        }
        ;

        /**
         * Formata as taxas administrativas antes de mandar para o servico.
         * Operacoes realizadas:
         * troca , por . no nro_plano
         * 
         * @param {JSON[]} taxasAdministrativas
         * @returns {JSON[]} taxasFormatadas
         */
        function formatTaxasAdministrativas(taxasAdministrativas) {
            var taxasFormatadas = taxasAdministrativas;

            taxasFormatadas.forEach(taxaAdm => {

                for (var i = 1; i <= 12; i++) {
                    var nroPlano = "nroPlano" + i;

                    if (taxaAdm[nroPlano]) {
                        taxaAdm[nroPlano] = taxaAdm[nroPlano].toString().replace(",", ".").replace("%", "");
                    }
                }
            });

            return taxasFormatadas;
        }

        /**
         * Limpa o array de taxas que foram alteradas (para salvar).
         */
        function limparTaxasParaSalvar() {
            $scope.taxasAdministrativas.forEach((taxaAdm) => {
                taxaAdm.listaSalvar = [];
            });

            $scope.taxasAdministrativasSalvar = []
        }

        /**
         * Divide a taxa por 100.
         * Acao feita antes de chamar o servico para salvar.
         * 
         * @param {JSON} taxasDividir 
         */
        function dividirTaxaPorCem(taxasDividir) {
            var taxasDivididas = taxasDividir;

            taxasDivididas.forEach(taxa => {

                for (var i = 1; i <= 12; i++) {

                    if (taxa['nroPlano' + i]) {
                        taxa['nroPlano' + i] = taxa['nroPlano' + i] / 100;
                    }
                }
            });

            return taxasDivididas;
        }

        /**
         * Atualiza a lista de mapaId da taxa com os dados do response.
         * 
         * @param {Array} taxasResponse Array de JSON com as taxas do response.
         */
        function atualizarListaMapaId(taxasResponse) {
            taxasResponse.forEach((taxaResp) => {

                $scope.taxasAdministrativas.forEach((taxaReq) => {

                    var idTaxaResp = taxaResp.codPontoVenda + '-' + taxaResp.codOperadora + '-' + taxaResp.codProduto;
                    var idTaxaReq = taxaReq.codLoja + '-' + taxaReq.codOperadora + '-' + taxaReq.codProduto;

                    if (idTaxaResp === idTaxaReq) {

                        var mapasIds = Object.keys(taxaReq['mapaId']);
                        var temMapaId;

                        temMapaId = mapasIds.some((mapaIdAux) => {
                            return taxaReq.mapaId[mapaIdAux] === taxaResp.codTaxaAdministrativa;
                        });

                        if (!temMapaId) {
                            var plano_ = "PLANO_" + taxaResp.nroPlano;
                            taxaReq.mapaId[plano_] = taxaResp.codTaxaAdministrativa;
                        }

                    }

                });
            });
        }

        /**
         * Salva as taxas administratrivas.
         */
        $scope.salvar = function (taxasAdministrativasSalvar) {
            var taxasAdministrativasFormatada = angular.copy(taxasAdministrativasSalvar);
            taxasAdministrativasFormatada = formatTaxasAdministrativas(taxasAdministrativasFormatada);

            if (taxasAdministrativasFormatada.length === 0) {
                $scope.hideMessage();
                $("#modalConfirmar").modal("hide");
                return;
            }

            taxasAdministrativasFormatada = dividirTaxaPorCem(taxasAdministrativasFormatada);

            TaxasAdministrativasService.taxaAdministrativaSalvar(taxasAdministrativasFormatada).then(
                    function success(result) {
                        atualizarListaMapaId(result.data);
                        limparTaxasParaSalvar();
                        $scope.hideMessage();
                        $("#modalConfirmar").modal("hide");
                        $scope.showSuccessMessage("Operação realizada com sucesso.");
                    }
            ), function error(result) {
                $scope.pesquisar();
                $scope.hideMessage();
                $("#modalConfirmar").modal("hide");
                $scope.showErrorMessage("Operação não realizada.");
            };
        }

        /**
         * Adiciona o numero do plano no array de planos que eh para atualizar.
         * 
         * @param {JSON} txAdm - A linha da tabela de resultado da pesquisa.
         * @param {String} nroPlano - Plano que o usuario editou na tabela de resultado da pesquisa
         */
        $scope.pushPlanosParaAtualizar = function (indexTabela, nroPlano) {
            var nroPlanoAux = nroPlano;
            var valorDigitado;

            $scope.hideMessage();
            nroPlanoAux = nroPlanoAux.replace(/\D/g, '');
            nroPlanoAux = 'nroPlano' + nroPlanoAux;

            var txAdm = $scope.taxasAdministrativas[indexTabela];

            valorDigitado = $scope.taxasAdministrativas[indexTabela][nroPlanoAux];

            if (!valorDigitado) {
                valorDigitado = '0';
            }

            if (valorDigitado) {
                valorDigitado = valorDigitado.toString().replace(/\./g, "");
                valorDigitado = valorDigitado.toString().replace(",", ".");
                valorDigitado = valorDigitado.toString().replace("%", "");
            }

            if (valorDigitado > 100) {
                $scope.showErrorMessage("O Valor precisa estar na faixa entre 0% e 100%");
                return;
            }

            if (!txAdm.listaSalvar.includes(nroPlano)) {
                txAdm.listaSalvar.push(nroPlano);
                var indiceTaxa;

                indiceTaxa = $scope.taxasAdministrativasSalvar.some((element, index, arr) => {

                    if (element.$$hashKey == txAdm.$$hashKey) {
                        arr[index] = txAdm;
                    }

                    return element.$$hashKey == txAdm.$$hashKey;
                });

                if (!indiceTaxa) {
                    $scope.taxasAdministrativasSalvar.push(txAdm);
                }

            }

            valorDigitado = $filter('currency')(valorDigitado, '', 2) + '%';
            $scope.taxasAdministrativas[indexTabela][nroPlanoAux] = valorDigitado;
        }

        $scope.taxaKeyup = function (index, nroPlano) {
            var valueFormated = $scope.taxasAdministrativas[index][nroPlano];
            var re;//regular expression
            var indexes;

            if (!valueFormated) {
                return valueFormated;
            }

            valueFormated = valueFormated.replace(/[^0-9,%]/g, ''); //diferente de numeros ',' e %
            valueFormated = valueFormated.replace(/^[\D]*/, ""); //diferente de numero no comeco
            valueFormated = valueFormated.replace(/,{2,}/g, ""); //duas ',' ou mais juntas
            valueFormated = valueFormated.replace(/%{2,}/g, ""); //dois '%' ou mais juntos
            valueFormated = valueFormated.replace(/,%/g, "");  //',' e '%' juntos

            // remove os % que nao estao no final da string.
            re = /%/g;
            while ((match = re.exec(valueFormated)) != null) {

                if (match.index != valueFormated.length - 1) {
                    valueFormated = valueFormated.replace('%', '')
                }

            }

            // remove as ',' quando tem mais de uma.
            re = /,/g;
            indexes = [];

            while ((match = re.exec(valueFormated)) != null) {
                indexes.push(match.index)
            }

            if (indexes.length > 1) {
                indexes.pop();
                indexes.forEach(index => {
                    valueFormated = valueFormated.replace(',', '')
                })
            }
            // fim do: remove as ',' quando tem mais de uma.

            $scope.taxasAdministrativas[index][nroPlano] = valueFormated;
        }

        $scope.exportarTaxasAdministrativas = function () {

            var data = new Date();
            var month = eval(data.getMonth() + 1);

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }

            var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

            var strHTML = "<table>";

            strHTML += '<tr bgcolor="#747476">';

            strHTML += '<th><font color="#FFFFFF">Loja</th>';
            strHTML += '<th><font color="#FFFFFF">Ponto de Vendas</th>';
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

            angular.forEach($scope.taxasAdministrativas, function (value, key) {

                strHTML += '<tr>';

                strHTML += '<td>' + (value.nmeLoja ? value.nmeLoja : '') + '</td>';
                strHTML += '<td>' + (value.nmePontoVenda ? value.nmePontoVenda : '') + '</td>';
                strHTML += '<td>' + (value.nmeOperadora ? value.nmeOperadora : '') + '</td>';
                strHTML += '<td>' + (value.nmeProduto ? value.nmeProduto : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano1 ? value.nroPlano1 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano2 ? value.nroPlano2 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano3 ? value.nroPlano3 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano4 ? value.nroPlano4 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano5 ? value.nroPlano5 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano6 ? value.nroPlano6 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano7 ? value.nroPlano7 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano8 ? value.nroPlano8 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano9 ? value.nroPlano9 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano10 ? value.nroPlano10 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano11 ? value.nroPlano11 : '') + '</td>';
                strHTML += '<td>' + (value.nroPlano12 ? value.nroPlano12 : '') + '</td>';

            });

            strHTML += "</table>";

            var blob = new Blob([strHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
            });

            saveAs(blob, "Cadastro_Taxas_Administrativas_" + stringData + ".xls");
        }

        $scope.marcarParaEditar = function () {
            $scope.editarTaxas = !$scope.editarTaxas;
            $scope.disabilitarFormPesquisa = !$scope.disabilitarFormPesquisa;
        }

        $scope.voltar = function () {
            $state.go('taxasAdministrativas');
        }

        /* Inicialização de conteúdos */
        $scope.init = function () {
            $scope.buscarEmpresa();
        };

        $scope.init();

        $scope.$watch('empresa', function (novoCnpjSelecionado, antigoCnpjSelecionado) {
            if (novoCnpjSelecionado !== antigoCnpjSelecionado) {
                var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);
                if (empresaCa) {
                    $scope.empId = empresaCa.idEmpresaCa;
                    $scope.nomeEmpresa = empresaCa.razaoSocial;
                    $scope.cnpj = mascaraCnpj(empresaCa.cnpj);

                    $scope.loadLojas();
                    $scope.loadPontoVendas();
                    $scope.loadOperadoras();
                } else {
                    $scope.empId = '';
                    $scope.lojas = [];
                    $scope.pontoVendas = [];
                    $scope.operadoras = [];
                }
            }
        });

        $scope.$watch('filtro.codLoja', function (novoCodLojaSelecionado, antigoCodLojaSelecionado) {
            if (novoCodLojaSelecionado !== antigoCodLojaSelecionado) {
                $scope.codLoja = novoCodLojaSelecionado;
                $scope.loadPontoVendas();
            }
        });
    }
);
