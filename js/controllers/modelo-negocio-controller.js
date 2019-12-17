angular.module('trustionPortal').controller('ModeloNegocioController', function ($scope, $stateParams, $filter, ModeloNegocioService, TransportadoraService, TipoCreditoService, CacheService, UTF8) {

	$scope.novoModelo = {};
	$scope.filtroModelo = {};
	$scope.alteraModelo = {};
	var filtroModeloPage = {};
	$scope.isPerfilBPO = CacheService.usuario.data.principal.idPerfil == 6;

	$scope.textPesquisa = 'Pesquisar';

	$scope.hideMessage();

	function configurarPaginacao() {

		$scope.paginacao = false;

		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 5;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 0;

	}
	configurarPaginacao();

	function carregaAlteracao() {
		if ($stateParams.modeloId) {
			ModeloNegocioService.pesquisar($stateParams.modeloId).then(function successcallback(res) {
				$scope.alteraModelo = res.data;
				$scope.alteraModelo.horarioCorteCredito = $filter('date')(res.data.horarioCorteCredito, 'HHmm');
				$scope.alteraModelo.horarioCorteEnvioBanco = $filter('date')(res.data.horarioCorteEnvioBanco, 'HHmm');
				$scope.alteraModelo.quantidadeDiasConfCredito = res.data.quantidadeDiasConfCredito;
			}, function errorCallback(res) {
				$scope.showErrorMessage(res.data.mensagem);
			});
		}
	}

	function carregaTipoCredito() {
		TipoCreditoService.listaTodos().then(function successCallback(res) {
			$scope.listaTipoCredito = res.data;
		}, function errorCallback(res) {
			$scope.showErrorMessage(res.data.mensagem);
		});
	}

	function carregaTransportadoras() {
		TransportadoraService.pesquisar().then(function successCallback(res) {
			$scope.listaTransportadora = res.data;
		}, function errorCallback(res) {
			$scope.showErrorMessage(res.data.mensagem);
		});
	}

	carregaTipoCredito();
	carregaTransportadoras();
	carregaAlteracao();

	function validaData(valor) {

		var hora = valor.substring(0, 2);
		var minuto = valor.substring(2);
		if (hora < 24 & minuto < 60) {
			var data = new Date();
			data.setHours(hora, minuto, 00);
			return data.getTime();
		}
		return undefined;
	}

	$scope.changeTipoCredito = function () {
		$scope.novoModelo.horarioCorteCredito = null;
		$scope.novoModelo.horarioCorteEnvioBanco = null;
		$scope.novoModelo.quantidadeDiasConfCredito = null;
	}

	$scope.criar = function () {
		$scope.hideMessage();

		if ($scope.isPerfilBPO) {
			return;
		}

		if ($scope.formNovoModelo.$valid) {

			if ($scope.novoModelo.horarioCorteCredito != undefined && $scope.novoModelo.horarioCorteCredito != '') {
				$scope.novoModelo.horarioCorteCredito = validaData($scope.novoModelo.horarioCorteCredito);
				if ($scope.novoModelo.horarioCorteCredito == undefined) {
					$scope.showErrorMessage(UTF8.Horario + ' de corte de ' + UTF8.credito + ' ' + UTF8.invalido + '.');
					return;
				}
			}

			if ($scope.novoModelo.idTipoCredito === 1) {
				if ($scope.novoModelo.horarioCorteEnvioBanco != undefined && $scope.novoModelo.horarioCorteEnvioBanco != '') {
					$scope.novoModelo.horarioCorteEnvioBanco = validaData($scope.novoModelo.horarioCorteEnvioBanco);
					if ($scope.novoModelo.horarioCorteEnvioBanco == undefined) {
						$scope.showErrorMessage(UTF8.Horario + ' de envio ao banco ' + UTF8.invalido + '.');
						return;
					}
				}

			} else if ($scope.novoModelo.idTipoCredito === 2) {
				if ($scope.novoModelo.quantidadeDiasConfCredito < 0
					|| $scope.novoModelo.quantidadeDiasConfCredito > 99) {
					$scope.showErrorMessage('Favor, preencher o campo quantidade de dias para ' + UTF8.credito + ' ' + UTF8.apos + ' a ' + UTF8.conferencia);
					return;
				}
			}

			ModeloNegocioService.criar($scope.novoModelo).then(function successCallback(res) {
				if (res.data) {
					$scope.novoModelo = {};
					$scope.horarioCorteCredito = null;
					$scope.horarioCorteEnvioBanco = null;
					$scope.showSuccessMessage('Modelo de ' + UTF8.negocio + ' criado com sucesso!');
				}
			}, function errorCallback(res) {
				$scope.showErrorMessage(res.data.mensagem);
			});

		} else {
			if ($scope.novoModelo.nome == undefined || $scope.novoModelo.nome == "") {
				$scope.showErrorMessage("Favor, preencher o campo do nome");
				return;
			}

			if ($scope.novoModelo.descricao == undefined || $scope.novoModelo.descricao == "") {
				$scope.showErrorMessage('Favor, preencher o campo de ' + UTF8.descricao + '.');
				return;
			}

			if ($scope.novoModelo.idTransportadora == undefined || $scope.novoModelo.idTransportadora == "") {
				$scope.showErrorMessage('Favor, escolher a transportadora.');
				return;
			}

			if ($scope.novoModelo.idTipoCredito == undefined || $scope.novoModelo.idTipoCredito == "") {
				$scope.showErrorMessage('Favor, escolher o tipo de ' + UTF8.credito + '.');
				return;
			}

			if ($scope.novoModelo.idTipoCredito === 2) {
				if (!$scope.novoModelo.quantidadeDiasConfCredito && $scope.novoModelo.quantidadeDiasConfCredito != "0") {
					$scope.showErrorMessage('Favor, preencher o campo quantidade de dias para ' + UTF8.credito + ' ' + UTF8.apos + ' a ' + UTF8.conferencia);
					return;
				}
			}

			if ($scope.novoModelo.qtdDiasAnaliseSolicitada == undefined || $scope.novoModelo.qtdDiasAnaliseSolicitada == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 1');
				return;
			}

			if ($scope.novoModelo.qtdDiasAnaliseAndamento == undefined || $scope.novoModelo.qtdDiasAnaliseAndamento == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 2');
				return;
			}

			if ($scope.novoModelo.qtdDiasAnaliseAguarde == undefined || $scope.novoModelo.qtdDiasAnaliseAguarde == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 3');
				return;
			}
		}
	}

	$scope.pesquisarPorCriterios = function () {
		$scope.hideMessage();

		$scope.listaModelo = null;
		$scope.pag_paginaSelecionada = 1;
		filtroModeloPage = angular.copy($scope.filtroModelo);

		$scope.carregarModelosPorPagina();
	}

	$scope.carregarModelosPorPagina = function () {

		ModeloNegocioService.listaPorCriteriosPage(filtroModeloPage, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(function successCallback(res) {
			if (res.data.content == '') {
				$scope.showErrorMessage('Nenhum modelo encontrado.');
				$scope.paginacao = false;
				$scope.textPesquisa = 'Pesquisar';
			} else {
				$scope.textPesquisa = 'Pesquisar';
				$scope.listaModelo = res.data.content;
				$scope.paginacao = true;
				$scope.pag_totalRegistros = res.data.totalElements;
			}
		}, function errorCallback(res) {
			$scope.textPesquisa = 'Pesquisar';
			$scope.paginacao = false;
			$scope.showErrorMessage(res.data.mensagem);
		});

	}

	$scope.alterar = function () {
		$scope.hideMessage();

		if ($scope.isPerfilBPO) {
			return;
		}

		if ($scope.formAlteraModelo.$valid) {

			if ($scope.alteraModelo.horarioCorteCredito != undefined && $scope.alteraModelo.horarioCorteCredito != '') {
				$scope.alteraModelo.horarioCorteCredito = validaData($scope.alteraModelo.horarioCorteCredito);
				if ($scope.alteraModelo.horarioCorteCredito == undefined) {
					$scope.showErrorMessage(UTF8.Horario + ' de corte de ' + UTF8.credito + ' ' + UTF8.invalido + '.');
					return;
				}
			}

			if ($scope.alteraModelo.horarioCorteEnvioBanco != undefined && $scope.alteraModelo.horarioCorteEnvioBanco != '') {
				$scope.alteraModelo.horarioCorteEnvioBanco = validaData($scope.alteraModelo.horarioCorteEnvioBanco);
				if ($scope.alteraModelo.horarioCorteEnvioBanco == undefined) {
					$scope.showErrorMessage(UTF8.Horario + ' de envio ao banco ' + UTF8.invalido + '.');
					return;
				}
			}

			if ($scope.alteraModelo.idTipoCredito === 1) {
				if ($scope.alteraModelo.horarioCorteCredito == undefined || $scope.alteraModelo.horarioCorteCredito == '') {
					$scope.alteraModelo.horarioCorteCredito = null;
				}

				if ($scope.alteraModelo.horarioCorteEnvioBanco == undefined || $scope.alteraModelo.horarioCorteEnvioBanco == '') {
					$scope.alteraModelo.horarioCorteEnvioBanco = null;
				}

			} else if ($scope.alteraModelo.idTipoCredito === 2) {
				if ($scope.alteraModelo.quantidadeDiasConfCredito < 0
					|| $scope.alteraModelo.quantidadeDiasConfCredito > 99) {
					$scope.showErrorMessage('Favor, preencher o campo quantidade de dias para ' + UTF8.credito + ' ' + UTF8.apos + ' a ' + UTF8.conferencia);
					return;
				}
			}

			ModeloNegocioService.alterar($scope.alteraModelo).then(function successCallback(res) {
				if (res.data) {
					$scope.alteraModelo = {};
					$scope.horarioCorteCredito = null;
					$scope.horarioCorteEnvioBanco = null;
					$scope.alteraModelo.quantidadeDiasConfCredito = null;
					$scope.showSuccessMessage('Modelo de ' + UTF8.negocio + ' alterado com sucesso!');
				}
			}, function errorCallback(res) {
				$scope.showErrorMessage(res.data.mensagem);
			});

		} else {
			if ($scope.alteraModelo.nome == undefined || $scope.alteraModelo.nome == "") {
				$scope.showErrorMessage("Favor, preencher o campo do nome");
				return;
			}

			if ($scope.alteraModelo.descricao == undefined || $scope.alteraModelo.descricao == "") {
				$scope.showErrorMessage('Favor, preencher o campo de ' + UTF8.descricao + '.');
				return;
			}

			if ($scope.alteraModelo.idTransportadora == undefined || $scope.alteraModelo.idTransportadora == "") {
				$scope.showErrorMessage('Favor, escolher a transportadora.');
				return;
			}

			if ($scope.alteraModelo.idTipoCredito == undefined || $scope.alteraModelo.idTipoCredito == "") {
				$scope.showErrorMessage('Favor, escolher o tipo de ' + UTF8.credito + '.');
				return;
			}

			if ($scope.alteraModelo.idTipoCredito === 2) {
				if (!$scope.alteraModelo.quantidadeDiasConfCredito && $scope.alteraModelo.quantidadeDiasConfCredito != "0") {
					$scope.showErrorMessage('Favor, preencher o campo quantidade de dias para ' + UTF8.credito + ' ' + UTF8.apos + ' a ' + UTF8.conferencia);
					return;
				}
			}

			if ($scope.alteraModelo.qtdDiasAnaliseSolicitada == undefined || $scope.alteraModelo.qtdDiasAnaliseSolicitada == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 1');
				return;
			}

			if ($scope.alteraModelo.qtdDiasAnaliseAndamento == undefined || $scope.alteraModelo.qtdDiasAnaliseAndamento == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 2');
				return;
			}

			if ($scope.alteraModelo.qtdDiasAnaliseAguarde == undefined || $scope.alteraModelo.qtdDiasAnaliseAguarde == "") {
				$scope.showErrorMessage('Favor, inserir quantidade de dias para o SLA de atendimento 3');
				return;
			}
		}
	}
});
