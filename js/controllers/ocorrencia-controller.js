angular.module('trustionPortal').controller('OcorrenciaController',
	function ($scope, $stateParams, $uibModal, $http, $window, $filter, UsuarioService, CacheService, OcorrenciaService, EmpresaService, AtividadeService, RelatorioAnaliticoCreditosService, TipoStatusOcorrenciaService, ModeloNegocioService, EnvironmentService, TransportadoraService, UTF8, TrustionHelpers) {

		$scope.listaAtividade = [];
		var relat;
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';
		$scope.listaGrupoTransp = [];
		$scope.listaEmpresa = [];
		$scope.listaModeloDeNegocio = [];
		$scope.farois = ['Atrasado', 'Atenção', 'Dentro do prazo'];
		$scope.filtroConsulta = {};
		$scope.filtroConsultaPage = {};
		$scope.paginacao = true;
		$scope.lstRegPorPag = [10, 15, 25, 30];
		$scope.registrosPorPag = $scope.lstRegPorPag[0];
		$scope.idsEmpresa = [];
		$scope.listaEmpresaSel = [];
		$scope.listaEmpresaSel2 = [];
		$scope.farol = [];
		$scope.listaRelatorioExport = [];
		$scope.listaRelatorio = [];
		$scope.listaTransportadora = [];
		var usuarioLogadoDetalhes;

		$scope.orderByMe = function (x) {
			if($scope.myOrderBy == x){
				x='-'+x;
			}
			$scope.myOrderBy = x;
		}

		function carregarTransportadoras() {
			TransportadoraService.listarTodos().then(function successCallback(res){
				$scope.listaTransportadora = res.data;
			}, function errorCallback(res){
				$scope.showErrorMessage(res.mensagem);
			});
		}

		function getTransportadora(idTransportadora) {
			var transportadora = {};
			transportadora.idTransportadora = idTransportadora;
			TransportadoraService.pesquisarPorCriterios(transportadora).then(function successCallback(res){
				$scope.listaTransportadora = res.data;
			}, function errorCallback(res){
				$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de transportadoras. Favor, entrar em contato com o administrador do sistema.');
			});
		};

		function carregarUsuarioTransportadoras() {
			UsuarioService.pesquisarPorId(CacheService.usuario.data.principal.idUsuario).then(function successCallback(res){
				usuarioLogadoDetalhes = res.data;
				getTransportadora();
				if(usuarioLogadoDetalhes.idPerfil === 1) {
					carregarTransportadoras();
				}else {
					if(usuarioLogadoDetalhes.transportadoraList) {
						getTransportadora(usuarioLogadoDetalhes.transportadoraList[0].idTransportadora)
					}
				}
			}, function errorCallback(res){
				$scope.showErrorMessage(UTF8.Nao + ' foi' + UTF8.possivel + ' obter a trasnportadora do ' + UTF8.usuario);
			});
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

		configurarPaginacao();

		function configurarPaginacao() {

			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;

		}

		$scope.toggleFiltro = function (isCollapsedFilter) {
			return $scope.isCollapsedFilter = !isCollapsedFilter;
		}

		loadPage();

		function loadPage() {
			$scope.hideMessage();
			carregarStatusTiposOcorrencias();
			carregarUsuarioTransportadoras();
		}

		$scope.carregarRelatorioPorPagina = function (filtroRelatorio) {

			OcorrenciaService.pesquisarPorCriteriosPagina(
				filtroRelatorio, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(

					function successCallback(retorno) {
						if (retorno.data.content == '' || retorno.data == '') {
							$scope.showErrorMessage('Nenhum registro encontrado.');
						}

						$scope.listaRelatorio = retorno.data.content;
						$scope.pag_totalRegistros = retorno.data.totalElements;
						$scope.paginacao = true;
					},

					function errorCallback(retorno) {
						if (retorno.data != null && retorno.data.hasOwnProperty('mensagem')) {
							$scope.showErrorMessage(retorno.data.mensagem);
						} else {
							$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.');
						}
						$scope.listaRelatorio = []
						$scope.pag_totalRegistros = 0;
					}
				);
		}

		function pesquisarOcorrencia(idOcorrencia) {
			OcorrenciaService.pesquisar(idOcorrencia).then(
				function successCallback(res) {
					$scope.ocorrencia = res.data;
					var arranjo = $scope.ocorrencia.modeloNegocio

				}, function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
		}

		function pesquisarAtividadePorIdOcor(idOcorrencia) {
			AtividadeService.pesquisarPorIdOcor(idOcorrencia).then(
				function successCallback(res) {
					$scope.listaAtividade = res.data;
				}, function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
		}

		listarModeloDeNegocio();

		function listarModeloDeNegocio() {
			ModeloNegocioService.listarPorEmpresaD0().then(
				function successCallback(res) {
					$scope.listaModeloDeNegocio = TrustionHelpers.duplicateCleaning(res.data);
					listarEmpresas($scope.listaModeloDeNegocio);
				}, function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
		}

		function listarEmpresas(listaModeloDeNegocio) {
			var lstIdsModeloNegocio = [];
			listaModeloDeNegocio.forEach(id => lstIdsModeloNegocio.push(id.idModeloNegocio));
			EmpresaService.pequisarPorModelosNegocio(lstIdsModeloNegocio).then(
				function successCallback(res) {
					$scope.listaEmpresa = res.data
				}, function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
		}



		$scope.pesquisarOcorrencia = function () {
			$scope.hideMessage();

			if (!$scope.dataInicial) {
				$scope.showErrorMessage('Favor, preencher a data inicial');
				return;
			}

			if (!$scope.dataFinal) {
				$scope.showErrorMessage('Favor, preencher a data final');
				return;
			}

			if (!$scope.idModeloNegocio) {
				$scope.showErrorMessage('Favor, preencher o modelo de ' + UTF8.negocio);
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

			$scope.filtroConsulta.dataInicial = dataInicialEnvio.getTime();
			$scope.filtroConsulta.dataFinal = dataFinalEnvio.getTime();
			$scope.filtroConsulta.idModeloNegocio = $scope.idModeloNegocio;
			$scope.filtroConsulta.idOcorrencia = $scope.idOcorrencia;
			$scope.filtroConsulta.statusOcorrencia = $scope.statusOcorrencia;
			$scope.filtroConsulta.idsEmpresa = [];
			$scope.filtroConsulta.cnpjCliente = $scope.cnpj;
			$scope.filtroConsulta.idTransportadora = $scope.idTransportadora;

			if (!$scope.idsEmpresa.length == 0) {
				$scope.idsEmpresa.forEach(id => $scope.filtroConsulta.idsEmpresa.push(id.idEmpresa));
			} else {
				$scope.listaEmpresa.forEach(id => $scope.filtroConsulta.idsEmpresa.push(id.idEmpresa));
			}
			$scope.filtroConsulta.gtv = $scope.gtv;
			$scope.filtroConsulta.cnpj = $scope.cnpj;
			$scope.filtroConsulta.responsavel = $scope.responsavel;
			$scope.filtroConsulta.farois = $scope.farol;
			$scope.pag_registrosPorPagina = $scope.registrosPorPag;
			//$scope.pag_registrosPorPagina = 5;
			$scope.pag_paginaSelecionada = 1;

			$scope.carregarRelatorioPorPagina($scope.filtroConsulta);
			$scope.toggleFiltro();

		}

		$scope.carregarRelatorio = function(filtroRelatorio) {
			OcorrenciaService.pesquisarPorCriterioExportar(filtroRelatorio).then(
				function successCallback(retorno) {
					if (retorno.data.content == '' || retorno.data == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}

					$scope.listaRelatorioExport = retorno.data;

				}, function errorCallback(retorno) {
					if (retorno.data != null && retorno.data.hasOwnProperty('mensagem')) {
						$scope.showErrorMessage(retorno.data.mensagem);
					}
				}
			);

			return $scope.listaRelatorioExport;
		}


		function getFilter() {

			if (!$scope.dataInicial) {
				$scope.showErrorMessage('Favor, preencher a data inicial');
				return;
			}

			if (!$scope.dataFinal) {
				$scope.showErrorMessage('Favor, preencher a data final');
				return;
			}

			if (!$scope.idModeloNegocio) {
				$scope.showErrorMessage('Favor, preencher o modelo de ' + UTF8.negocio);
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

			$scope.filtroConsulta.dataInicial = dataInicialEnvio.getTime();
			$scope.filtroConsulta.dataFinal = dataFinalEnvio.getTime();
			$scope.filtroConsulta.idModeloNegocio = $scope.idModeloNegocio;
			$scope.filtroConsulta.idOcorrencia = $scope.idOcorrencia;
			$scope.filtroConsulta.statusOcorrencia = $scope.statusOcorrencia;
			$scope.filtroConsulta.idsEmpresa = [];

			if (!$scope.idsEmpresa.length == 0)
				$scope.idsEmpresa.forEach(id => $scope.filtroConsulta.idsEmpresa.push(id.idEmpresa));

			$scope.filtroConsulta.gtv = $scope.gtv;
			$scope.filtroConsulta.cnpj = $scope.cnpj;
			$scope.filtroConsulta.responsavel = $scope.responsavel;
			$scope.filtroConsulta.idTransportadora = $scope.idTransportadora;

			return $scope.filtroConsulta;
		}

		function pesquisarRelatorioAnalitico(idRelatorio) {
			RelatorioAnaliticoCreditosService.pesquisar(idRelatorio).then(function successCallback(res) {
				relat = res.data;
			}, function errorCallback(res) {
				$scope.showErrorMessage(res.data.mensagem);
			});
		}

		if ($stateParams.idOcorrencia) {
			pesquisarOcorrencia($stateParams.idOcorrencia);
			pesquisarAtividadePorIdOcor($stateParams.idOcorrencia);
		}

		$scope.modalMesclarOcorrencias = function () {
			$uibModal.open(
					{
						animation: true,
						ariaLabelledBy: 'modal-titulo',
						ariaDescribedBy: 'modal-body',
						templateUrl: 'partials/ocorrencia/modais/mesclar-ocorrencia.html',
						controller: 'MesclarOcorrenciaController',
						size: 'lg',
						resolve: {
							ocorrencia: function () {
								return $scope.ocorrencia;
							}
						}
					}
				).result.then(function successCallback() {
					pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
					pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

				}, function errorCallback() {
				}).finally(function successCallback() {
					pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
					pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

				}, function errorCallback() {
				});
			

		}

		$scope.modaAprovarMescla = function () {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/aprovar-mescla-ocorrencia.html',
					controller: 'MesclarOcorrenciaController',
					size: 'lg',
					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						}
					}
				}
			).result.then(function successCallback() {
				pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
				pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);
			}, function errorCallback() {
			}).finally(function () {
				pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
				pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);
			});

		}

		$scope.callModalMescla = function () {
			if($scope.ocorrencia.concluido) {
				$scope.showErrorMessage('Ocorrência já está concluída.');
			} else if($scope.ocorrencia.isOcorrenciaD1 && ($scope.ocorrencia.valorCreditadoConta - $scope.ocorrencia.valorDeclarado <= 0)){
				$scope.showErrorMessage('Para iniciar uma mescla, a diferença deverá ter valor positivo');
			} else if ($scope.ocorrencia.valorCreditadoConta - $scope.ocorrencia.valorRegistradoCofre <= 0) {
				$scope.showErrorMessage('Para iniciar uma mescla, a diferença deverá ter valor positivo');
			} else {
				$scope.modalMesclarOcorrencias();
			}
		}


		$scope.modalAlteracaoStatusOcorrencia = function () {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/alteracao-status-ocorrencia.html',
					controller: 'AlteracaoStatusOcorrenciaController',

					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						}
					}
				}
			).result.then(function successCallback() {
				pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
				pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);
			}, function errorCallback() {
			}).finally(function successCallback() {
				pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
				pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

			}, function errorCallback() {
			});

		}

		$scope.modalEnviarMensagemOcorrencia = function () {
			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/enviar-mensagem-ocorrencia.html',
					controller: 'EnviarMensagemOcorrenciaController',

					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						}
					}
				}
			).result.then(function successCallback() {
				pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
				pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);
			}, function errorCallback() {
			});
		}

		$scope.modalObservacaoOcorrencia = function (obs) {
			$uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-titulo',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'partials/ocorrencia/modais/observacao-ocorrencia.html',
				controller: 'ObservacaoOcorrenciaController',

				resolve: {
					observacao: function () {
						return obs;
					}
				}
			});
		};


		$scope.modalDetalheRelatorio = function () {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/relatorioanaliticocreditos/modais/detalhe-relatorio.html',
					controller: 'DetalheRelatorioController',
					windowClass: 'large-Modal',

					resolve: {
						relatorio: function () {
							return relat;
						}
					}
				}
			);
		}


		$scope.modalAcao = function (atividade) {
			
			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/acao-ocorrencia.html',
					controller: 'AcaoOcorrenciaController',

					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						},
						atividade: function () {
							return atividade
						}
					}
				}

			)
				.result.then(
					function successCallback() {
						pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
						pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

					}, function errorCallback() {
					}
				);
		}


		$scope.modalAprovacao = function (atividade) {
			
			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/conclusao-ocorrencia.html',
					controller: 'ConclusaoOcorrenciaController',

					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						},
						atividade: function () {
							return atividade;
						}
					}
				}

			)
				.result.then(
					function successCallback() {
						pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

					}, function errorCallback() {
					}
				).finally(function () {
					pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
					pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);
				});
		}



		$scope.modalUploadEvidencia = function () {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/ocorrencia/modais/upload-evidencia.html',
					controller: 'UploadEvidenciaController',

					resolve: {
						ocorrencia: function () {
							return $scope.ocorrencia;
						}
					}
				}

			)
				.result.then(
					function successCallback() {
						pesquisarOcorrencia($scope.ocorrencia.idOcorrencia);
						pesquisarAtividadePorIdOcor($scope.ocorrencia.idOcorrencia);

					}, function errorCallback() {
					}
				);
		}


		$scope.downloadArquivo = function (idAtividade) {

			$http.get(EnvironmentService.getEnvironment() + 'download/atividade1/' + idAtividade, { responseType: 'arraybuffer' }).then(
				function successCallback(res) {
					var contentDispositionHeader;
					var fileName;

					contentDispositionHeader = res.headers('Content-Disposition');
					fileName = contentDispositionHeader.split(';')[1].trim();
					fileName = fileName.split('=')[1].trim();

					var file = new Blob([res.data], { type: 'application/pdf' });
					var fileURL = URL.createObjectURL(file);
					$window.open(fileURL, fileName);

				}, function errorCallback(res) {
					if (res.data != null && res.data.hasOwnProperty('mensagem')) {
						$scope.showErrorMessage(res.data.mensagem);
					} else {
						$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' fazer o download do arquivo. Favor, entrar em contato com o administrador do sistema.');
					}
				}
			);
		}


		$scope.exportar = function () {

			if ($scope.listaRelatorio.length == 0) {
				$scope.showErrorMessage('Favor, pesquisar antes de exportar');
				return;
			}


			if (!$scope.dataInicial) {
				$scope.showErrorMessage('Favor, preencher a data inicial');
				return;
			}

			if (!$scope.dataFinal) {
				$scope.showErrorMessage('Favor, preencher a data final');
				return;
			}

			if (!$scope.idModeloNegocio) {
				$scope.showErrorMessage('Favor, preencher o modelo de ' + UTF8.negocio);
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

			$scope.filtroConsulta.dataInicial = dataInicialEnvio.getTime();
			$scope.filtroConsulta.dataFinal = dataFinalEnvio.getTime();
			$scope.filtroConsulta.idModeloNegocio = $scope.idModeloNegocio;
			$scope.filtroConsulta.idOcorrencia = $scope.idOcorrencia;
			$scope.filtroConsulta.statusOcorrencia = $scope.statusOcorrencia;
			$scope.filtroConsulta.idsEmpresa = [];
			$scope.filtroConsulta.cnpjCliente = $scope.cnpj;

			if (!$scope.idsEmpresa.length == 0)
				$scope.idsEmpresa.forEach(id => $scope.filtroConsulta.idsEmpresa.push(id.idEmpresa));

			$scope.filtroConsulta.gtv = $scope.gtv;
			$scope.filtroConsulta.cnpj = $scope.cnpj;
			$scope.filtroConsulta.responsavel = $scope.responsavel;
			$scope.filtroConsulta.farois = $scope.farol;
			$scope.filtroConsulta.idTransportadora = $scope.idTransportadora;

			var exportar = true;

			$scope.listaRelatorioExport = $scope.listaRelatorio;

			if ($scope.listaRelatorioExport.length == 0) {
				$scope.showErrorMessage('Nenhum registro encontrado.');
				exportar = false;
				return;
			}
			$scope.separadorCampo = ';';
			var separadorLinha = '\n';
			var registrosExport = '';
			if (exportar) {
				registrosExport = 'Empresa' + $scope.separadorCampo + 'CNPJ' + $scope.separadorCampo + 'ID da ' + UTF8.Ocorrencia + $scope.separadorCampo + 'Data da ' + UTF8.Ocorrencia + $scope.separadorCampo +
					'Status da ' + UTF8.Ocorrencia + $scope.separadorCampo + 'Responsável ' + $scope.separadorCampo +
					'SLA Atendimento ' + $scope.separadorCampo + 'Dias em aberto ' + $scope.separadorCampo +
					'Quantidade de dias Pendente ' + $scope.separadorCampo + 'Modelo de Negócio' + separadorLinha;
				for (i = 0; i < $scope.listaRelatorioExport.length; i++) {
					registrosExport += $scope.listaRelatorioExport[i].razaoSocial != null ? $scope.listaRelatorioExport[i].razaoSocial : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].cnpjCliente != null ? $scope.listaRelatorioExport[i].cnpjCliente : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].idOcorrencia != null ? $scope.listaRelatorioExport[i].idOcorrencia : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].dataStatusOcorrencia != null ? new Date($scope.listaRelatorioExport[i].dataStatusOcorrencia).toLocaleDateString() : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].statusOcorrencia != null ? $scope.listaRelatorioExport[i].statusOcorrencia : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].responsavel != null ? $scope.listaRelatorioExport[i].responsavel : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].quantidadeDiasSla != null ? $scope.listaRelatorioExport[i].quantidadeDiasSla : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].diasEmAberto != null ? $scope.listaRelatorioExport[i].diasEmAberto : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].diasPendentes != null ? $scope.listaRelatorioExport[i].diasPendentes : ' ';
					registrosExport += $scope.separadorCampo;
					registrosExport += $scope.listaRelatorioExport[i].nomeModeloNegocio != null ? $scope.listaRelatorioExport[i].nomeModeloNegocio : ' ';
					registrosExport += separadorLinha;
				}

				//windows-1252
				var csvContent = registrosExport,
					textEncoder = new CustomTextEncoder('ISO-8859-1', { NONSTANDARD_allowLegacyEncoding: true }),
					fileName = 'ocorrencias-d0-periodo-' + new Date($scope.dataInicial).toLocaleDateString("pt-BR") + '-a-' + new Date($scope.dataFinal).toLocaleDateString("pt-BR") + '.csv';

				//windows-1252
				var csvContentEncoded = textEncoder.encode([csvContent]);
				var blob = new Blob([csvContentEncoded], { type: 'text/csv;charset=ISO-8859-1;' });
				saveAs(blob, fileName);
			}

		}

		$scope.downloadResumoOcorrencia = function () {
			var columns = [
				{ title: '' + UTF8.Usuario, dataKey: "usuario" },
				{ title: "Data/" + UTF8.Horario, dataKey: "dataHorario" },
				{ title: "Atividade", dataKey: "atividade" }
			];
			var rows = [];

			for (i = 0; i < $scope.listaAtividade.length; i++) {
				rows[i] = {};
				rows[i].usuario = $scope.listaAtividade[i].usuario;
				rows[i].dataHorario = $filter('date')($scope.listaAtividade[i].dataHorario, 'dd/MM/yyyy HH:mm:ss');
				rows[i].atividade = $scope.listaAtividade[i].atividade;
			}

			var doc = new jsPDF('1');
			doc.text("Resumo de Atividades - " + UTF8.Ocorrencia + ": " + $scope.ocorrencia.idOcorrencia, 14, 16);
			doc.autoTable(columns, rows, {
				startY: 20,
				margin: { horizontal: 7 },
				headerStyles: {
					fillColor: [0, 130, 65],
					halign: 'center'
				},
				styles: {
					overflow: 'linebreak'
				},
				columnStyles: {
					usuario: { columnWidth: 40 },
					dataHorario: { columnWidth: 40 },
					atividade: { columnWidth: 115 }
				}
			});
			doc.save($scope.ocorrencia.arquivoResumoOcorrencia);
		}

		$scope.moveItem = function(items, from, to) {

			angular.forEach(items, function(item) {
				var idx = from.indexOf(item);
				from.splice(idx, 1);
				to.push(item);
			});
		};



	}


);
