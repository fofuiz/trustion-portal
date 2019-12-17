angular.module('trustionPortal').controller('RelatorioAnaliticoExtratoController',
	function ($scope, $filter, CacheService, RelatorioAnaliticoExtratoService, GrupoEconomicoService, TransportadoraService, EmpresaService, CofreService, UTF8) {

		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';

		$scope.listaGrupoTranspOpc = [];
		$scope.listaGrupoTranspSel = [];
		$scope.listaGrupoTranspMem = [];

		$scope.listaGrupoEconOpc = [];
		$scope.listaGrupoEconSel = [];
		$scope.listaGrupoEconMem = [];

		$scope.listaEmpresaOpc = [];
		$scope.listaEmpresaSel = [];
		$scope.listaEmpresaMem = [];

		//Dados Bancários
		$scope.listaDadosBancarios = {};
		$scope.listaDadosBancariosSel = [];
		$scope.listaDadosBancariosOpc = [];

		$scope.listaCofre = [];
		$scope.listaCofreSel = [];
		$scope.listaCofreOpc = [];

		$scope.listaStatusConciliacao = [
			'CONCILIADO',
			UTF8.NAO + ' CONCILIADO',
			'PENDENTE',
			'CONCIL. AJUSTE'
		];

		$scope.lstRegPorPag = [10, 15, 25, 30];
		$scope.registrosPorPag = $scope.lstRegPorPag[1];

		$scope.listaRelatorio = [];

		$scope.filtroRelatorio = {};
		$scope.filtroRelatorioPage = {};

		$scope.tipoCreditoD0 = 'D0';
		$scope.tipoCreditoDN = 'DN';

		configurarPaginacao();
		loadPage();

		function loadPage() {
			carregarTransportadoras();
			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
		}

		$scope.toggleFiltro = function (isCollapsedFilter) {
			return $scope.isCollapsedFilter = !isCollapsedFilter;
		}

		function memorizarListas() {
			$scope.listaGrupoTranspMem = $scope.listaGrupoTranspOpc.slice();
			$scope.listaGrupoEconMem = $scope.listaGrupoEconOpc.slice();
			$scope.listaEmpresaMem = $scope.listaEmpresaOpc.slice();
		}

		function restaurarListas() {
			$scope.listaGrupoTranspOpc = $scope.listaGrupoTranspMem.slice();
			$scope.listaGrupoEconOpc = $scope.listaGrupoEconMem.slice();
			$scope.listaEmpresaOpc = $scope.listaEmpresaMem.slice();
		}

		$scope.restringirTranspGrupoEconEmpresa = function () {
			if ($scope.listaGrupoTranspMem.length > 0) {
				// Restaurar opcoes
				restaurarListas()

				// Eliminar opcoes
				eliminarGruposEconomicosPelasTransportadoras();
				eliminarGruposEconomicosPelasEmpresas();
				eliminarEmpresasPelosGruposEconomicos();
				eliminarTransportadorasPelasEmpresas();
				eliminarEmpresasPelasTransportadoras();
				eliminarTransportadorasPelosGruposEconomicos();

				//NOVO VALIDAÇÕES
				if ($scope.listaEmpresaSel.length === 1) {
					buscarBancoContaAgencia();
					carregarCofres();
				} else {
					$scope.listaDadosBancariosOpc = {};
					$scope.listaCofreOpc = {};
				}
			}
		}


		function buscarBancoContaAgencia() {
			EmpresaService.pesquisarPorId($scope.listaEmpresaSel[0].idEmpresa).then(
				function successCallback(res) {
					$scope.listaDadosBancariosOpc = res.data.dadosBancarios.slice();
				},
				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
				}
			);
		}


		function eliminarTransportadorasPelosGruposEconomicos() {
			// restringir opcoes de "transportadoras" para os "grupos economicos" selecionados
			if ($scope.listaGrupoEconSel.length > 0) {
				var elementosCorretosF = [];
				for (var i = 0; i < $scope.listaGrupoEconSel.length; i++) {
					for (var index = 0; index < $scope.listaGrupoTranspOpc.length; index++) {
						for (var j = 0; j < $scope.listaGrupoTranspOpc[index].outrasEmpresas.length; j++) {
							if ($scope.listaGrupoTranspOpc[index].outrasEmpresas[j].idGrupoEconomico === $scope.listaGrupoEconSel[i].idGrupoEconomico
								&& elementosCorretosF.indexOf($scope.listaGrupoTranspOpc[index]) < 0) {
								elementosCorretosF.push($scope.listaGrupoTranspOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoTranspOpc = elementosCorretosF.slice();
			}
		}


		function eliminarGruposEconomicosPelasTransportadoras() {
			// restringir opcoes de "grupos economicos" para as "transportadoras" selecionadas
			if ($scope.listaGrupoTranspSel.length > 0) {
				var elementosCorretosA = [];
				for (var index = 0; index < $scope.listaGrupoEconOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspSel.length; i++) {
						for (var m = 0; m < $scope.listaGrupoTranspSel[i].outrasEmpresas.length; m++) {
							if ($scope.listaGrupoEconOpc[index].idGrupoEconomico === $scope.listaGrupoTranspSel[i].outrasEmpresas[m].idGrupoEconomico
								&& elementosCorretosA.indexOf($scope.listaGrupoEconOpc[index]) < 0) {
								elementosCorretosA.push($scope.listaGrupoEconOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoEconOpc = elementosCorretosA.slice();
			}
		}


		function eliminarGruposEconomicosPelasEmpresas() {
			// restringir opcoes de "grupos economicos" para as "empresas" selecionadas
			if ($scope.listaEmpresaSel.length > 0) {
				var elementosCorretosB = [];
				for (var index = 0; index < $scope.listaGrupoEconOpc.length; index++) {
					for (var i = 0; i < $scope.listaEmpresaSel.length; i++) {
						if ($scope.listaGrupoEconOpc[index].idGrupoEconomico === $scope.listaEmpresaSel[i].idGrupoEconomico
							&& elementosCorretosB.indexOf($scope.listaGrupoEconOpc[index]) < 0) {
							elementosCorretosB.push($scope.listaGrupoEconOpc[index]);
						}
					}
				}
				$scope.listaGrupoEconOpc = elementosCorretosB.slice();
			}
		}


		function eliminarEmpresasPelosGruposEconomicos() {
			// restringir opcoes de "empresas" para os "grupos economicos" selecionados
			if ($scope.listaGrupoEconSel.length > 0) {
				var elementosCorretosC = [];
				for (var index = 0; index < $scope.listaEmpresaOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoEconSel.length; i++) {
						if ($scope.listaEmpresaOpc[index].idGrupoEconomico === $scope.listaGrupoEconSel[i].idGrupoEconomico
							&& elementosCorretosC.indexOf($scope.listaEmpresaOpc[index]) < 0) {
							elementosCorretosC.push($scope.listaEmpresaOpc[index]);
						}
					}
				}
				$scope.listaEmpresaOpc = elementosCorretosC.slice();
			}
		}


		function eliminarTransportadorasPelasEmpresas() {
			// restringir opcoes de "transportadoras" para as "empresas" selecionadas
			if ($scope.listaEmpresaSel.length > 0) {
				var elementosCorretosD = [];
				for (var index = 0; index < $scope.listaGrupoTranspOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspOpc[index].outrasEmpresas.length; i++) {
						for (var m = 0; m < $scope.listaEmpresaSel.length; m++) {
							if ($scope.listaGrupoTranspOpc[index].outrasEmpresas[i].idGrupoEconomico === $scope.listaEmpresaSel[m].idGrupoEconomico
								&& elementosCorretosD.indexOf($scope.listaGrupoTranspOpc[index]) < 0) {
								elementosCorretosD.push($scope.listaGrupoTranspOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoTranspOpc = elementosCorretosD.slice();
			}
		}


		function eliminarEmpresasPelasTransportadoras() {
			// restringir opcoes de "empresas" para os "transportadoras" selecionados
			if ($scope.listaGrupoTranspSel.length > 0) {
				var elementosCorretosE = [];
				for (var index = 0; index < $scope.listaEmpresaOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspSel.length; i++) {
						for (var m = 0; m < $scope.listaGrupoTranspSel[i].outrasEmpresas.length; m++) {
							if ($scope.listaEmpresaOpc[index].idGrupoEconomico == $scope.listaGrupoTranspSel[i].outrasEmpresas[m].idGrupoEconomico
								&& elementosCorretosE.indexOf($scope.listaEmpresaOpc[index]) < 0) {
								elementosCorretosE.push($scope.listaEmpresaOpc[index]);
							}
						}
					}
				}
				$scope.listaEmpresaOpc = elementosCorretosE.slice();
			}
		}


		function carregarTransportadoras() {

			var idPerfil = CacheService.usuario.data.principal.idPerfil;
			TransportadoraService.listarPorPerfilETipoCredito(idPerfil, $scope.tipoCreditoD0).then(function successCallback(res) {
				$scope.listaGrupoTranspOpc = res.data;
				$scope.carregarGruposEconomicosOutros();
			}, function errorCallback(res) {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de transportadoras. Favor, entrar em contato com o administrador do sistema.';
			});
		}


		$scope.carregarGruposEconomicosOutros = function () {
			var idPerfil = CacheService.usuario.data.principal.idPerfil;

			GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(
				function successCallback(res) {
					$scope.listaGrupoEconOpc = res.data;
					$scope.carregarEmpresas();
				},

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de grupo ' + UTF8.economico + '. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}


		$scope.carregarEmpresas = function () {
			var selGrupos = undefined;

			if (($scope.listaGrupoEconSel == undefined || $scope.listaGrupoEconSel == '') && ($scope.listaGrupoEconOpc != undefined || $scope.listaGrupoEconOpc != '')) {
				$scope.listaEmpresaOpc = [];
				$scope.listaEmpresaSel = [];
				selGrupos = $scope.listaGrupoEconOpc.slice();
			} else {
				selGrupos = $scope.listaGrupoEconSel.slice();
			}

			EmpresaService.pesquisarPorGrpEconD0(selGrupos).then(
				function successCallback(res) {
					$scope.listaEmpresaOpc = res.data;
					memorizarListas();
				},

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}

		function carregarCofres() {
			CofreService.pesquisarPorEmpresas($scope.listaEmpresaSel).then(
				function successCallback(res) {
					$scope.listaCofreOpc = res.data;
				},

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de cofre. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}


		$scope.dadosBancarioPorEmpresa = function () {
			if ($scope.listaGrupoTranspMem.length > 0) {
				// Restaurar opcoes
				restaurarListas()

				// Eliminar opcoes
				eliminarGruposEconomicosPelasTransportadoras();
				eliminarGruposEconomicosPelasEmpresas();
				eliminarEmpresasPelosGruposEconomicos();
				eliminarTransportadorasPelasEmpresas();
				eliminarEmpresasPelasTransportadoras();
				eliminarTransportadorasPelosGruposEconomicos();

				if ($scope.listaEmpresaSel.length === 1) {
					EmpresaService.pesquisarPorId($scope.listaEmpresaSel[0].idEmpresa).then(
						function successCallback(res) {
							$scope.dadosBancariosEmpresaSel = res.data.dadosBancarios;
							$scope.listaAgenciaOpc = $scope.dadosBancariosEmpresaSel[0].descricao;
						},
						function errorCallback(res) {
							$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
						}
					);
				} else {
					$scope.dadosBancariosEmpresaSel = {};
				}
			}
		}


		function validarDatasPeriodo() {

			$scope.dataInicialEnvio = new Date($scope.dataInicial);
			$scope.dataFinalEnvio = new Date($scope.dataFinal);
			var diferenca = Math.round(($scope.dataFinalEnvio.getTime() - $scope.dataInicialEnvio.getTime()) / 86400011);

			if (diferenca > 90) {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = 'Favor, preencher as datas com o máximo de 90 dias, no momento você selecionou ' + diferenca + ' dias.';
				return false;
			}

			if (diferenca < 0) {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = 'Favor, preencher a data corretamente, data final é menor que a data inicial.';
				return false;
			}

			return true;
		}


		$scope.pesquisarExtratos = function (exportValid) {

			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';

			if ($scope.formRelatorioAnaliticoExtrato.$valid) {

				//Validando data
				if (!validarDatasPeriodo()) {
					return;
				}

				//Validando filtros da tela
				if ($scope.listaGrupoTranspSel.length == 0) {
					$scope.filtroRelatorio.transportadoras = [];
				} else {
					$scope.filtroRelatorio.transportadoras = $scope.listaGrupoTranspSel;
				}

				if ($scope.listaGrupoEconSel.length == 0) {
					$scope.filtroRelatorio.grupoEmpresas = [];
				} else {
					$scope.filtroRelatorio.grupoEmpresas = $scope.listaGrupoEconSel;
				}

				if ($scope.listaEmpresaSel.length == 0) {
					$scope.filtroRelatorio.empresas = [];
				} else {
					$scope.filtroRelatorio.empresas = $scope.listaEmpresaSel;
				}

				if (!$scope.statusConciliacao) {
					$scope.filtroRelatorio.statusConciliacao = '';
				} else {
					$scope.filtroRelatorio.statusConciliacao = $scope.statusConciliacao;
				}

				if ($scope.listaCofreSel == null){
					$scope.filtroRelatorio.numSerieCofre = '';
				}else{
					if ($scope.listaCofreSel.length == 0) {
						$scope.filtroRelatorio.numSerieCofre = '';
					} else {
						$scope.filtroRelatorio.numSerieCofre = $scope.listaCofreSel.numSerie;
					}
				}

				if ($scope.listaDadosBancariosSel == null){
					$scope.filtroRelatorio.idBanco = '';
					$scope.filtroRelatorio.idAgencia = '';
				}else{
					if ($scope.listaDadosBancariosSel.length == 0) {
						$scope.filtroRelatorio.idBanco = '';
						$scope.filtroRelatorio.idAgencia = '';
					} else {
						$scope.filtroRelatorio.idBanco = $scope.listaDadosBancariosSel.agencia;
						$scope.filtroRelatorio.idAgencia = $scope.listaDadosBancariosSel.idBanco;
					}
				}
				
				$scope.filtroRelatorio.dataInicial = $scope.dataInicialEnvio.getTime();
				$scope.filtroRelatorio.dataFinal = $scope.dataFinalEnvio.getTime();

				$scope.filtroRelatorio.registrosComDiferenca = $scope.registrosComDiferenca;
				$scope.pag_registrosPorPagina = $scope.registrosPorPag;
				$scope.pag_paginaSelecionada = 1;
				$scope.filtroRelatorioPage = angular.copy($scope.filtroRelatorio);

				if (exportValid){
					console.log("Exportando Relatório Completo...");
					$scope.carregarRelatorioExport($scope.filtroRelatorioPage);	
				}else{
					console.log("Pesquisando Relatório por Página...");
					$scope.carregarRelatorioPorPagina($scope.filtroRelatorioPage);
				}
				
				$scope.toggleFiltro();

			} else {
				if (!$scope.dataInicial) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = 'Favor, preencher a data inicial.';
					return;
				}

				if (!$scope.dataFinal) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = 'Favor, preencher a data final.';
					return;
				}
			}

		}


		$scope.carregarRelatorioPorPagina = function (filtroRelatorio) {
					RelatorioAnaliticoExtratoService.pesquisarPorCriteriosPagina(
						filtroRelatorio, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(
							function successCallback(retorno) {
								if (retorno.data.content == '' || retorno.data == '') {
									$scope.mensagemErro = 'Nenhum registro encontrado.';
									$scope.isExibirMensagemErro = true;
								}

								$scope.listaRelatorio = retorno.data.content;
								$scope.pag_totalRegistros = retorno.data.totalElements;
								$scope.paginacao = true;
								return;
							},

							function errorCallback(retorno) {
								if (retorno.data != null && retorno.data.hasOwnProperty('mensagem')) {
									$scope.isExibirMensagemErro = true;
									$scope.mensagemErro = retorno.data.mensagem;
								} else {
									$scope.isExibirMensagemErro = true;
									$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
								}
								$scope.listaRelatorio = [];
								$scope.pag_totalRegistros = 0;
							}
						);		
		}


		$scope.carregarRelatorioExport = function (filtroRelatorio) {
			RelatorioAnaliticoExtratoService.pesquisarPorCriteriosExport(filtroRelatorio).then(
					function successCallback(retorno) {
						if (retorno.data.content == '' || retorno.data == '') {
							$scope.mensagemErro = 'Nenhum registro encontrado.';
							$scope.isExibirMensagemErro = true;
						}
						$scope.listaRelatorioExport = retorno.data;
					},

					function errorCallback(retorno) {
						if (retorno.data != null && retorno.data.hasOwnProperty('mensagem')) {
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = retorno.data.mensagem;
						} else {
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
						}
						$scope.listaRelatorioExport = [];
					}
				);
		}

		
		$scope.exportarXLS = function () {
			console.log("Exportando XLS...");
			$scope.pesquisarExtratos(true);

			var data = new Date();
			var month = eval(data.getMonth() + 1);
			
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}

			var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

			var strHTML = "<table>";
			strHTML += montarCabecalhoXLS(strHTML);
			
			setTimeout(function() {
				for (let index = 0; index < $scope.listaRelatorioExport.length; index++) {
					var banco = validBanco($scope.listaRelatorioExport[index].banco);
					var agencia = validAgencia($scope.listaRelatorioExport[index].agencia);
					var conta = validConta($scope.listaRelatorioExport[index].contaCorrente);
					var numeroDocumento = validNumDocumento($scope.listaRelatorioExport[index].numDocumento);
					var categoria = validCategoria($scope.listaRelatorioExport[index].categoria);
					var natureza = validNatureza($scope.listaRelatorioExport[index].natureza);
					var historico = validHistorico($scope.listaRelatorioExport[index].historico);
					var valorLancamento = validValorLancamento($scope.listaRelatorioExport[index].valorLancamento);
					var tipo = validTipo($scope.listaRelatorioExport[index].tipo);
					var valorCofre = validValorCofre($scope.listaRelatorioExport[index].valorCofre);
					var cofre = validCofre($scope.listaRelatorioExport[index].cofre);
					var status = validStatus($scope.listaRelatorioExport[index].status);
					var loja = validLoja($scope.listaRelatorioExport[index].loja);



					$scope.dataFormatada = $filter("date")($scope.listaRelatorioExport[index].dtLancamento, "dd/MM/yyyy"); 

					strHTML += '<tr>';
					strHTML += '<td>' + $scope.dataFormatada + '</td>';
					strHTML += '<td>' + banco + '</td>';
					strHTML += '<td>' + agencia + '</td>';
					strHTML += '<td>' + conta + '</td>';
					strHTML += '<td>' + numeroDocumento + '</td>';
					strHTML += '<td>' + categoria + '</td>';
					strHTML += '<td>' + natureza + '</td>';
					strHTML += '<td>' + historico + '</td>';
					strHTML += '<td>' + valorLancamento + '</td>';
					strHTML += '<td>' + tipo + '</td>';
					strHTML += '<td>' + valorCofre + '</td>';
					strHTML += '<td>' + cofre + '</td>';
					strHTML += '<td>' + status + '</td>';
					strHTML += '<td>' + loja + '</td>';
					strHTML += '</tr>';
				}

				strHTML += "</table>";

				var blob = new Blob([strHTML], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
				});

				saveAs(blob, "RelatorioAnaliticoExtrato_" + stringData + ".xls");
				
			}, 1000);
		}


		$scope.exportarCSV = function(){
			console.log("Exportando CSV...");
			$scope.pesquisarExtratos(true);

			var separadorLinha = '\n';
			var separadorCampo = ';';
			var registrosExport = '';
			registrosExport = 
			'Data Lançamento ' + separadorCampo +
			'Banco ' + separadorCampo +
			'Agência ' + separadorCampo +
			'Conta ' + separadorCampo +
			'Num Documento ' + separadorCampo +
			'Categoria ' + separadorCampo +
			'Natureza ' + separadorCampo +
			'Histórico ' + separadorCampo +
			'Valor de Lançamento ' + separadorCampo +
			'Tipo ' + separadorCampo +
			'Valor de Cofre ' + separadorCampo +
			'Cofre ' + separadorCampo +
			'Status ' + separadorCampo +
			'Loja ' + separadorLinha;

			setTimeout(function() {
				for (let index = 0; index < $scope.listaRelatorioExport.length; index++) {
					var banco = validBanco($scope.listaRelatorioExport[index].banco);
					var agencia = validAgencia($scope.listaRelatorioExport[index].agencia);
					var conta = validConta($scope.listaRelatorioExport[index].contaCorrente);
					var numeroDocumento = validNumDocumento($scope.listaRelatorioExport[index].numDocumento);
					var categoria = validCategoria($scope.listaRelatorioExport[index].categoria);
					var natureza = validNatureza($scope.listaRelatorioExport[index].natureza);
					var historico = validHistorico($scope.listaRelatorioExport[index].historico);
					var valorLancamento = validValorLancamento($scope.listaRelatorioExport[index].valorLancamento);
					var valorCofre = validValorCofre($scope.listaRelatorioExport[index].valorCofre);
					var cofre = validCofre($scope.listaRelatorioExport[index].cofre);
					var status = validStatus($scope.listaRelatorioExport[index].status);
					var loja = validLoja($scope.listaRelatorioExport[index].loja);

					$scope.dataFormatada = $filter("date")($scope.listaRelatorioExport[index].dtLancamento, "dd/MM/yyyy"); 

					registrosExport += $scope.dataFormatada + separadorCampo;
					registrosExport += banco + separadorCampo;
					registrosExport += agencia + separadorCampo;
					registrosExport += conta + separadorCampo;
					registrosExport += numeroDocumento + separadorCampo;
					registrosExport += categoria + separadorCampo;
					registrosExport += natureza + separadorCampo;
					registrosExport += historico + separadorCampo;
					registrosExport += valorLancamento + separadorCampo;
					registrosExport += $scope.listaRelatorioExport[index].tipo + separadorCampo;
					registrosExport += valorCofre + separadorCampo;
					registrosExport += cofre + separadorCampo;
					registrosExport += status + separadorCampo;
					registrosExport += loja + separadorLinha;
				}
			
				textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true}),
				fileName = 'RelatorioAnaliticoExtrato_' + new Date().toLocaleDateString("pt-BR")+'.csv';
				
				var csvContentEncoded = textEncoder.encode([registrosExport]);
				var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=windows-1252;'});
				saveAs(blob, fileName);

			}, 1000);
		}


		$scope.exportarPDF = function () {
            console.log("Exportando PDF...");
			$scope.pesquisarExtratos(true);

			$scope.checkBoxTrue = [];

			if($scope.isDataLancamentoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Data Lançamento", dataKey: "dtLancamento"});
			} 

			
			if ($scope.isBancoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Banco", dataKey: "banco"});
			}
			
			if($scope.isAgenciaColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Agência", dataKey: "agencia"});
			} 
			
			if($scope.isContaCorrenteColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Conta", dataKey: "conta"});
			}
			
			if ($scope.isNumeroDocumentoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Num Documento", dataKey: "numDocumento"});
			}
			
			if($scope.isCategoriaColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Categoria", dataKey: "categoria"});
			}
			
			if($scope.isNaturezaColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Natureza", dataKey: "natureza"});
			}
			
			if($scope.isHistoricoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Histórico", dataKey: "historico"});
			}
			
			if($scope.isValorLancamentoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Valor de Lançamento", dataKey: "vlrLancamento"});
			}
			
			if($scope.isTipoColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Tipo", dataKey: "tipo"});
			}
			
			if($scope.isValorCofreColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Valor de Cofre", dataKey: "vlrCofre"});
			}
			
			if($scope.isCofreColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Cofre", dataKey: "cofre"});
			}
			
			if($scope.isStatusColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Status", dataKey: "status"});
			}
			
			if ($scope.isLojaColumnVisible == true){
				$scope.checkBoxTrue.push({ title: "Loja", dataKey: "loja"});
			}

			var columns = $scope.checkBoxTrue;
            var rows = [];//Linha
			
			setTimeout(function() {
				for (index = 0; index < $scope.listaRelatorioExport.length; index++) {
					var banco = validBanco($scope.listaRelatorioExport[index].banco);
					var agencia = validAgencia($scope.listaRelatorioExport[index].agencia);
					var conta = validConta($scope.listaRelatorioExport[index].contaCorrente);
					var numeroDocumento = validNumDocumento($scope.listaRelatorioExport[index].numDocumento);
					var categoria = validCategoria($scope.listaRelatorioExport[index].categoria);
					var natureza = validNatureza($scope.listaRelatorioExport[index].natureza);
					var historico = validHistorico($scope.listaRelatorioExport[index].historico);
					var valorLancamento = validValorLancamento($scope.listaRelatorioExport[index].valorLancamento);
					var valorCofre = validValorCofre($scope.listaRelatorioExport[index].valorCofre);
					var cofre = validCofre($scope.listaRelatorioExport[index].cofre);
					var status = validStatus($scope.listaRelatorioExport[index].status);	
					var loja = validLoja($scope.listaRelatorioExport[index].loja);
					
					$scope.dataFormatada = $filter("date")($scope.listaRelatorioExport[index].dtLancamento, "dd/MM/yyyy"); 

					rows[index] = {};
					rows[index].dtLancamento = $scope.dataFormatada;
					rows[index].banco = banco;
					rows[index].agencia = agencia;
					rows[index].conta = conta;
					rows[index].numDocumento = numeroDocumento;
					rows[index].categoria = categoria;
					rows[index].natureza = natureza;
					rows[index].historico = historico;
					rows[index].vlrLancamento = valorLancamento;
					rows[index].tipo = $scope.listaRelatorioExport[index].tipo;
					rows[index].vlrCofre = valorCofre;
					rows[index].cofre = cofre;
					rows[index].status = status;
					rows[index].loja = 	loja;
				}

				var doc = new jsPDF('l');
				doc.text("Relatório Analítico de Extrato", 110, 13);
				doc.autoTable(columns, rows, {
					startY: 20,
					margin: { horizontal: 7 },
					headerStyles: {
						fillColor: [0, 130, 65],
						halign: 'center'
					},
					styles: {
						overflow: 'linebreak',
					},
					columnStyles: {
						loja: { columnWidth: 50 }
					}
				});

				var fileName = 'RelatorioAnaliticoExtrato_' + new Date().toLocaleDateString("pt-BR");
				doc.save(fileName);
			}, 1000);
        }


		function montarCabecalhoTH(strHTML){
            strHTML += '<tr bgcolor="#747476">';
            strHTML += '<th><font color="#FFFFFF">Data '+ UTF8.Lancamento + '</th>';
            strHTML += '<th><font color="#FFFFFF">Banco</th>';
            strHTML += '<th><font color="#FFFFFF">' + UTF8.Agencia + '</th>';
            strHTML += '<th><font color="#FFFFFF">Conta</th>';
            strHTML += '<th><font color="#FFFFFF">Num Documento</th>';
            strHTML += '<th><font color="#FFFFFF">Categoria</th>';
            strHTML += '<th><font color="#FFFFFF">Natureza</th>';
            strHTML += '<th><font color="#FFFFFF">' + UTF8.Historico + '</th>';
            strHTML += '<th><font color="#FFFFFF">Valor de ' + UTF8.Lancamento + '</th>';
            strHTML += '<th><font color="#FFFFFF">Tipo</th>';
            strHTML += '<th><font color="#FFFFFF">Valor de Cofre</th>';
            strHTML += '<th><font color="#FFFFFF">Cofre</th>';
            strHTML += '<th><font color="#FFFFFF">Status</th>';
            strHTML += '<th><font color="#FFFFFF">Loja</th>';
            strHTML += "</tr>";
            return strHTML;
		}
		
		function montarCabecalhoXLS(strHTML){
            strHTML += '<tr bgcolor="#747476">';
            strHTML += '<th><font color="#FFFFFF">Data Lancamento</th>';
            strHTML += '<th><font color="#FFFFFF">Banco</th>';
            strHTML += '<th><font color="#FFFFFF">Agencia</th>';
            strHTML += '<th><font color="#FFFFFF">Conta</th>';
            strHTML += '<th><font color="#FFFFFF">Num Documento</th>';
            strHTML += '<th><font color="#FFFFFF">Categoria</th>';
            strHTML += '<th><font color="#FFFFFF">Natureza</th>';
            strHTML += '<th><font color="#FFFFFF">Historico</th>';
            strHTML += '<th><font color="#FFFFFF">Valor de Lancamento </th>';
            strHTML += '<th><font color="#FFFFFF">Tipo</th>';
            strHTML += '<th><font color="#FFFFFF">Valor de Cofre</th>';
            strHTML += '<th><font color="#FFFFFF">Cofre</th>';
            strHTML += '<th><font color="#FFFFFF">Status</th>';
            strHTML += '<th><font color="#FFFFFF">Loja</th>';
            strHTML += "</tr>";
            return strHTML;
        }

		
		function configurarPaginacao() {
			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;
		}

		function validLoja(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validBanco(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validAgencia(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validConta(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validNumDocumento(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validCategoria(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validNatureza(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validHistorico(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validValorLancamento(valor){
			if(valor){
				return $filter("currency")(valor, "R$ ");
			}else{
				return "R$ 0,00";
			}
		}

		function validTipo(valor){
			if(valor == "CRÉDITO"){
				return "CREDITO";
			} else{
				return "DEBITO";
			}
		}

		function validValorCofre(valor){
			if(valor){
				return $filter("currency")(valor, "R$ ");
			}else{
				return "R$ 0,00";
			}
		}

		function validCofre(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

		function validStatus(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}		

	});