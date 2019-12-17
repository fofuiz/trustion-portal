angular.module('trustionPortal').controller('RelatorioAnaliticoCreditosD1Controller', function ($scope, $uibModal, CacheService, TipoStatusOcorrenciaService, GrupoEconomicoService, TransportadoraService, EmpresaService, RelatorioAnaliticoCreditosD1Service, UTF8) {

	$scope.listaGrupoTranspOpc = [];
	$scope.listaGrupoTranspSel = [];
	$scope.listaGrupoTranspMem = [];

	$scope.listaGrupoEconOpc = [];
	$scope.listaGrupoEconSel = [];
	$scope.listaGrupoEconMem = [];

	$scope.listaEmpresaOpc = [];
	$scope.listaEmpresaSel = [];
	$scope.listaEmpresaSel2 = [];
	$scope.listaEmpresaSel3 = [];
	$scope.listaEmpresaMem = [];

	$scope.listaStatusOcorrencia = [];
	$scope.listaStatusConciliacao = [
		'CONCILIADO',
		UTF8.NAO + ' CONCILIADO',
		'PENDENTE',
		'CONCIL. AJUSTE',
		'CONC DIVERGE'
	];

	$scope.listaStatusDiferenca = [
		'SIM',
		UTF8.NAO 		
	];

	$scope.lstRegPorPag = [10,15,25,30];

	$scope.registrosPorPag = $scope.lstRegPorPag[1];

	$scope.statusConciliacao = $scope.listaStatusConciliacao[1];

	$scope.filtroRelatorio = {};
	$scope.filtroRelatorioPage = {};
	$scope.verQuestionarValor = true;

	$scope.tipoCreditoD0 = 'D0';
	$scope.tipoCreditoDN = 'DN';


	configurarPaginacao();
	loadPage();

	function loadPage() {
		carregarStatusTiposOcorrencias();
		carregarTransportadoras();

		var grupo = {};
		grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

		if (CacheService.usuario.data.principal.idPerfil == 1) {
			$scope.verQuestionarValor = false;
		}
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
			restaurarListas();

			// Eliminar opcoes
			eliminarGruposEconomicosPelasTransportadoras();
			eliminarGruposEconomicosPelasEmpresas();
			eliminarEmpresasPelosGruposEconomicos();
			eliminarTransportadorasPelasEmpresas();
			eliminarEmpresasPelasTransportadoras();
			eliminarTransportadorasPelosGruposEconomicos();

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


	function carregarStatusTiposOcorrencias() {
		TipoStatusOcorrenciaService.listar().then(
			function successCallback(res) {
				$scope.listaStatusOcorrencia = res.data;
			}, function errorCallback(res) {
				$scope.showErrorMessage(res.mensagem);
			}
		);
	}

	function carregarTransportadoras() {
		var idPerfil = CacheService.usuario.data.principal.idPerfil;
		TransportadoraService.listarPorPerfilETipoCredito(idPerfil, $scope.tipoCreditoDN).then(function successCallback(res){
			$scope.listaGrupoTranspOpc = res.data;
			$scope.carregarGruposEconomicosOutros();
		}, function errorCallback(res) {
			$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de grupo ' + UTF8.economico + ' transportadora. Favor, entrar em contato com o administrador do sistema.');
		});
	}

	$scope.toggleFiltro = function(isCollapsedFilter){
		return $scope.isCollapsedFilter = !isCollapsedFilter;
	}

	$scope.modalDetalheConferencia = function (relatorioParam) {

		$uibModal.open(
			{
				animation: true,
				ariaLabelledBy: 'modal-titulo',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'partials/relatorioanaliticocreditosd1/modais/detalhe-conferencia.html',
				controller: 'DetalheConferenciaController',
				size: 'lg',

				resolve: {
					relatorio: function () {
						return relatorioParam;
					}
				}
			}
		);
	}

	function configurarPaginacao() {
		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 5;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 0;
	}

	$scope.carregarGruposEconomicosOutros = function () {
		var idPerfil = CacheService.usuario.data.principal.idPerfil;

		GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(
			function successCallback(res) {
				$scope.listaGrupoEconOpc = res.data;
				$scope.carregarEmpresas();
			},

			function errorCallback(res) {
				$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de grupo ' + UTF8.economico + '. Favor, entrar em contato com o administrador do sistema.');
			}
		);
	}

	$scope.carregarEmpresas = function () {

		var selGrupos = undefined;

		if (($scope.listaGrupoEconSel == undefined || $scope.listaGrupoEconSel == '') && ($scope.listaGrupoEconOpc != undefined || $scope.listaGrupoEconOpc != '')) {
			$scope.listaEmpresaOpc = [];
			$scope.listaEmpresaSel = [];
			selGrupos = $scope.listaGrupoEconOpc;
		} else {
			selGrupos = $scope.listaGrupoEconSel;
		}

		EmpresaService.pesquisarPorGrpEconD1(selGrupos).then(function successCallback(res) {
			$scope.listaEmpresaOpc = res.data;
			memorizarListas();
		}, function errorCallback(res) {
			$scope.showErrorMessage(res.data.mensagem);
		});
	}

	$scope.pesquisarRelatorios = function () {

		$scope.hideMessage();
		
		if ($scope.formRelatorioAnaliticoCreditos.$valid) {
			if (!$scope.dataInicial) {
				$scope.showErrorMessage('Favor, preencher a data inicial.');
				return;
			}

			if (!$scope.dataFinal) {
				$scope.showErrorMessage('Favor, preencher a data final.');
				return;
			}

			var dataInicialEnvio = new Date($scope.dataInicial);
			var dataFinalEnvio = new Date($scope.dataFinal);

			dataInicialEnvio.setHours(0, 0, 0);
			dataFinalEnvio.setHours(23, 59, 59);

			if (dataInicialEnvio.getTime() >= dataFinalEnvio.getTime()) {
				$scope.showErrorMessage('Intervalo de datas ' + UTF8.invalido + '!');
				return;
			}

			$scope.filtroRelatorio.transportadoras = $scope.listaGrupoTranspSel;
			$scope.filtroRelatorio.outrasEmpresas = $scope.listaGrupoEconSel;
			$scope.filtroRelatorio.empresas = $scope.listaEmpresaSel;
			$scope.filtroRelatorio.cnpj = $scope.cnpj;
			$scope.filtroRelatorio.gtv = $scope.gtv;
			$scope.filtroRelatorio.siglaLoja = $scope.siglaLoja;
			$scope.filtroRelatorio.idOcorrencia = $scope.idOcorrencia;
			$scope.filtroRelatorio.statusOcorrencia = $scope.statusOcorrencia;
			$scope.filtroRelatorio.statusConciliacao = $scope.statusConciliacao;
			$scope.filtroRelatorio.dataInicial = dataInicialEnvio.getTime();
			$scope.filtroRelatorio.dataFinal = dataFinalEnvio.getTime();
			$scope.filtroRelatorio.registrosComDiferenca = $scope.registrosComDiferenca;
			$scope.pag_registrosPorPagina = $scope.registrosPorPag;

			$scope.filtroRelatorioPage = angular.copy($scope.filtroRelatorio);

			$scope.pag_paginaSelecionada = 1;


			$scope.carregarRelatorioPorPagina($scope.filtroRelatorioPage);
			$scope.toggleFiltro();

		} else {

			if (!$scope.dataInicial) {
				$scope.showErrorMessage('Favor, preencher a data inicial.');
				return;
			}

			if (!$scope.dataFinal) {
				$scope.showErrorMessage('Favor, preencher a data final.');
				return;
			}

		}

	}
	

	$scope.carregarRelatorioPorPagina = function (filtroRelatorio) {


		RelatorioAnaliticoCreditosD1Service.pesquisarPorCriteriosPagina(filtroRelatorio, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(function successCallback(res) {

			if (res.data.content == '' || res.data == '') {
				$scope.showErrorMessage('Nenhum registro encontrado.');
				$scope.listaRelatorio = []
				$scope.pag_totalRegistros = 0;
			}

			$scope.listaRelatorio = res.data.content;
			$scope.pag_totalRegistros = res.data.totalElements;
			$scope.paginacao = true;

		}, function errorCallback(res) {
			if (res.data.mensagem) {
				$scope.showErrorMessage(res.data.mensagem);
			} else {
				$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.');
			}
			$scope.listaRelatorio = []
			$scope.pag_totalRegistros = 0;
		});
	}

	$scope.modalQuestionarValor = function (item) {

		$uibModal.open(
			{
				animation: true,
				ariaLabelledBy: 'modal-titulo',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'partials/relatorioanaliticocreditosd1/modais/questionar-valor-d1.html',
				controller: 'QuestionarValorD1Controller',
				size: 'lg',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					relatorio: function () {
						return item;
					}
				}
			}
		);
	}

	$scope.modalDetalheConciliacao = function (item) {

		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-titulo',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'partials/relatorioanaliticocreditosd1/modais/detalhe-conciliacao.html',
			controller: 'DetalheConciliacaoD1Controller',
			size: 'xl',
			backdrop: 'static',
			keyboard: false,
			resolve: {
				relatorio: function () {
					return item;
				}
			}
		}).result.then(
			function successCallback(res) {
				if (res != undefined && res == 'sucesso') {
					$scope.carregarRelatorioPorPagina($scope.filtroRelatorioPage);
				}
				//fechou normal
			}, function errorCallback() {
				//saiu da tela detalhe da conciliação
			}
		);
	}

	$scope.modalConciliacaoManual = function (item) {

		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-titulo',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'partials/relatorioanaliticocreditosd1/modais/conciliacao-manual.html',
			controller: 'ConciliacaoManualD1Controller',
			size: 'xl',
			backdrop: 'static',
			keyboard: false,
			resolve: {
				relatorio: function () {
					return item;
				}
			}
		}).result.then(
			function successCallback(res) {
				if (res != undefined && res == 'sucesso') {
					$scope.carregarRelatorioPorPagina($scope.filtroRelatorioPage);
				}
				//fechou normal
			}, function errorCallback() {
				//saiu da tela conciliação manual
			}
		);
	}

	$scope.moveItem = function(items, from, to) {

		angular.forEach(items, function(item) {
			var idx = from.indexOf(item);
			from.splice(idx, 1);
			to.push(item);
		});
	};

});