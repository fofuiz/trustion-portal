angular.module('trustionPortal').controller('TipoServicoController', 
	function($scope, $state, $stateParams, TipoServicoService, CacheService, GrupoEconomicoService,UTF8) {

	
	$scope.listaGrupoEconomico = [];
	$scope.filtroTipoServico = {};
	$scope.filtroTipoServicoPage = {};	
	$scope.novoTipoServico = {};
	$scope.alteraTipoServico = {};

	configurarPaginacao();
	loadPage();
	
	
	function loadPage() {

		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';
		
		GrupoEconomicoService
				//.listarTodos()
				.listaTransportadoras()
				.then(
						function successCallback(res) {
							$scope.listaGrupoEconomico = res.data;
							console
									.log('<-- EmpresaController.loadPage.listaGrupoEconomico - carregado -->');
						},

						function errorCallback(res) {
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = UTF8.Nao+' foi possivel obter a lista de grupo '+UTF8.economico+'. Favor, entrar em contato com o administrador do sistema.';
						});

	}
	
	
	//VERIFICANDO SE É UPDATE
	if($stateParams.idTipoServico){
		TipoServicoService.pesquisarPorId($stateParams.idTipoServico).then(
				
				function successCallback(res) {
					$scope.alteraTipoServico = res.data;
				},
				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
				}
		);
	}
	
	//---------------------------------------CADASTRAR
	$scope.cadastraTipoServico = function() {
		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';
			
		if ($scope.formTipoServico.$valid) {
			$scope.isDadosInvalidos = false;

			$scope.novoTipoServico.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;						
			
			TipoServicoService
					.cadastra($scope.novoTipoServico)
					.then(
							function successCallback(res) {
								$scope.isExibirMensagemSucesso = true;
								$scope.mensagemSucesso = 'Tipo '+UTF8.Servico+' criado com sucesso!';
								$scope.novoTipoServico = {};

							},
							function errorCallback(res) {
								$scope.isExibirMensagemErro = true;
								$scope.mensagemErro = res.data.mensagem;
							});

		} else {
			$scope.isExibirMensagemErro = true;
			if ($scope.novoTipoServico.nomeServico == undefined || $scope.novoTipoServico.nomeServico == '') {
				$scope.mensagemErro = 'Favor, preencher o Nome do '+UTF8.Servico;
				return;
			}

			if ($scope.novoTipoServico.idGrupoEconomico == undefined || $scope.novoTipoServico.idGrupoEconomico == '') {
				$scope.mensagemErro = 'Favor, escolher o Grupo '+UTF8.Economico;
				return;
			}
			
			if ($scope.novoTipoServico.descServico == undefined
					|| $scope.novoTipoServico.descServico == '') {
				$scope.mensagemErro = 'Favor, preencher a '+UTF8.Descricao+' do '+UTF8.Servico+' '+UTF8.Economico;
				return;
			}
		}
	}
	
	//---------------------------------------ALTERAR
	$scope.alterarTipoServico = function() {
		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';
		
		if($scope.formAlteraTipoServico.$valid) {
			$scope.alteraTipoServico.idUsuarioAlteracao = CacheService.usuario.data.principal.idUsuario;
			
			TipoServicoService.alterar($scope.alteraTipoServico).then(
					function successCallback(res) {
						$scope.isExibirMensagemSucesso = true;
						$scope.mensagemSucesso = 'Tipo '+UTF8.Servico+' '+UTF8.Economico+' alterado com sucesso!';
						$scope.alteraTipoServico = {};

					},
					function errorCallback(res) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = res.data.mensagem;
					});
		}else{
			$scope.isExibirMensagemErro = true;
			if ($scope.alteraTipoServico.nomeServico == undefined || $scope.novoTipoServico.nomeServico == '') {
				$scope.mensagemErro = 'Favor, preencher o Nome do '+UTF8.Servico;
				return;
			}

			if ($scope.alteraTipoServico.idGrupoEconomico == undefined || $scope.novoTipoServico.idGrupoEconomico == '') {
				$scope.mensagemErro = 'Favor, escolher o Grupo '+UTF8.Economico;
				return;
			}
			
			if ($scope.alteraTipoServico.descServico == undefined|| $scope.novoTipoServico.descServico == '') {
				$scope.mensagemErro = 'Favor, preencher a '+UTF8.Descricao+' do '+UTF8.Servico+' '+UTF8.Economico;
				return;
			}
		}
	}	
	
	//---------------------------------------CONSULTAR
	$scope.pesquisarPorCriterios = function() {

		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';
		$scope.pag_paginaSelecionada = 1;
		$scope.filtroTipoServicoPage = angular.copy($scope.filtroTipoServico);
		
		$scope.carregarTipoServicosPorPagina($scope.filtroTipoServico);
	}
	
	$scope.carregarTipoServicosPorPagina = function(filtroTipoServicoParam) {

		console.log('--> TipoServicoController.carregarUsuariosPorPagina');
		console.log('$scope.pag_paginaSelecionada: ' + $scope.pag_paginaSelecionada);
		console.log('$scope.pag_registrosPorPagina: ' + $scope.pag_registrosPorPagina);

		TipoServicoService.pesquisarPorCriteriosPagina(
				filtroTipoServicoParam, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

			function successCallback(retorno) {

				if(retorno.data == '') {
					$scope.mensagemErro = 'Nenhum registro encontrado.';
					$scope.isExibirMensagemErro = true;
				}

				$scope.listaTipoServico = retorno.data.content;
				$scope.pag_totalRegistros = retorno.data.totalElements;
				$scope.paginacao = true;

			}, 

			function errorCallback(retorno) {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = +UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
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
	
	}
);