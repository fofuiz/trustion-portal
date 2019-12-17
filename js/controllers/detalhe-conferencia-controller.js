angular.module('trustionPortal').controller('DetalheConferenciaController',
	function($scope, $uibModalInstance, relatorio, UTF8, DetalheConferenciaService, DetalheComposicaoService) {

		$scope.listaDetalheConferencia = [];
		$scope.listaComposicao = [];
		$scope.listaDenominacao = [];
		$scope.listaQuantidade = [];
		$scope.listaValor = [];
		$scope.listaCompartimento = [];
		$scope.listaSeloCompartimento = [];

		loadPage();
		configurarPaginacao();

		$scope.voltar = function() {
			$uibModalInstance.close();
		}

		function loadPage() {
			DetalheConferenciaService.pesquisarPorCriterios(relatorio).then(
				function successCallback(res) {

					if (res.data == '') {
						$scope.mensagemErro = 'Nenhum registro encontrado.';
						$scope.isExibirMensagemErro = true;

					} else {

						$scope.listaDetalheConferencia = res.data;

						DetalheComposicaoService.pesquisarPorCriteriosPagina(
							$scope.listaDetalheConferencia[0], $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(

								function successCallback(res) {

									if (res.data.content == '') {
										$scope.mensagemErro = 'Nenhum registro encontrado.';
										$scope.isExibirMensagemErro = true;
									}

									$scope.listaComposicao = res.data.content;
									$scope.pag_totalRegistros = res.data.totalElements;

									populaListasComposicao($scope.listaComposicao);

								},

								function errorCallback(res) {

									$scope.mensagemErro = res.mensagem;
									$scope.isExibirMensagemErro = true;
								}
							);
					}

				}, function errorCallback(res) {

					$scope.mensagemErro = res.data.mensagem;
					$scope.isExibirMensagemErro = true;
				}
			);
		}

		$scope.carregarComposicaoPorPagina = function() {

			DetalheComposicaoService.pesquisarPorCriteriosPagina(
				$scope.listaDetalheConferencia[0], $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(

					function successCallback(retorno) {

						if (retorno.data.content == '') {
							$scope.mensagemErro = 'Nenhum registro encontrado.';
							$scope.isExibirMensagemErro = true;
						}

						$scope.listaComposicao = retorno.data.content;
						$scope.pag_totalRegistros = retorno.data.totalElements;

					},

					function errorCallback(retorno) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = +UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
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

		function populaListasComposicao(listaComposicao) {
			$scope.listaDenominacao = listaComposicao[0].denominacao;

			for (cont = 0; cont < listaComposicao[0].denominacao.length; cont++) {

				$scope.listaCompartimento[cont] = listaComposicao[0].compartimento;
				$scope.listaSeloCompartimento[cont] = listaComposicao[0].selo;

			}

			for (cont = 0; cont < listaComposicao[0].quantidade.length; cont++) {
				$scope.listaQuantidade[cont] = {
					id: cont,
					dado: listaComposicao[0].quantidade[cont]
				}
			}

			for (cont = 0; cont < listaComposicao[0].valor.length; cont++) {
				$scope.listaValor[cont] = {
					id: cont,
					dado: listaComposicao[0].valor[cont]
				}
			}
		}

	}
);	