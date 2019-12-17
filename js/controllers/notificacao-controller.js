angular.module('trustionPortal').controller('NotificacaoController', 
		function($scope, $state, $stateParams, NotificacaoService,UsuarioService, CacheService, GrupoEconomicoService,EmpresaService,TipoNotificacaoService,UTF8) {

	
		$scope.listaGrupoEconomico = [];
		$scope.listaEmpresa = [];
		$scope.listaTipoNotificacao = [];
		$scope.listaNotificacao = [];
		$scope.statusListaNotificacao = [
			"Ativo",
			"Inativo"
		];
		
		$scope.filtroNotificacao = {};
		$scope.filtroNotificacaoPage = {};
		
		$scope.novoNotificacao = {};
		$scope.novoNotificacao.usuarioDTO= {};
		$scope.alteraNotificacao = {};
	
		configurarPaginacao();
		loadPage();
	
		function loadPage() {

			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';
			
			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
			
			GrupoEconomicoService
					.lista(grupo)
					.then(
							function successCallback(res) {
								$scope.listaGrupoEconomico = res.data;
							},

							function errorCallback(res) {
								$scope.isExibirMensagemErro = true;
								$scope.mensagemErro = UTF8.Nao+' foi possivel obter a lista de grupo economico. Favor, entrar em contato com o administrador do sistema.';
							});
			
			
			TipoNotificacaoService
			.pesquisarPorCriterios()
			.then(
					function successCallback(res) {
						$scope.listaTipoNotificacao = res.data;
					},

					function errorCallback(res) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = UTF8.Nao+' foi possivel obter a lista de tipo de '+UTF8.notificacoes+'. Favor, entrar em contato com o administrador do sistema.';
					});

		}
		
		//VERIFICANDO SE É UPDATE
		if($stateParams.idNotificacao){
			NotificacaoService.pesquisarPorId($stateParams.idNotificacao).then(
					
					function successCallback(res) {
						$scope.alteraNotificacao = res.data;
						$scope.carregarEmpresasTelaAltera();
						$scope.carregarComboLoginAltera();
						//$scope.alteraNotificacao.idUsuario = res.data.usuario.idUsuario;
						$scope.preencherCamposLoginAndEmail($scope.alteraNotificacao.usuarioDTO.idUsuario);
					},
					function errorCallback(res) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
					}
			);
		}
		
		//---------------------------------------CADASTRAR
		
		$scope.cadastraNotificacao = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';
				
			if ($scope.frmCadastroNotificacao.$valid) {
				$scope.isDadosInvalidos = false;

				$scope.novoNotificacao.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;						
				
				console.log(JSON.stringify($scope.novoNotificacao));
				NotificacaoService
						.cadastra($scope.novoNotificacao)
						.then(
								function successCallback(res) {
									$scope.isExibirMensagemSucesso = true;
									$scope.mensagemSucesso = UTF8.Notificacao+' criada com sucesso!';
									$scope.novoNotificacao = {};

								},
								function errorCallback(res) {
									$scope.isExibirMensagemErro = true;
									$scope.mensagemErro = res.data.mensagem;
								});

			} else {
				$scope.isExibirMensagemErro = true;
				if ($scope.novoNotificacao.idGrupoEconomico == undefined || $scope.novoNotificacao.idGrupoEconomico == '') {
					$scope.mensagemErro = 'Favor, escolher o Grupo '+UTF8.Economico;
					return;
				}

				if ($scope.novoNotificacao.idEmpresa == undefined || $scope.novoNotificacao.idEmpresa == '') {
					$scope.mensagemErro = 'Favor, escolher a Empresa';
					return;
				}
				
				if ($scope.novoNotificacao.idTipoNotificacao == undefined|| $scope.novoNotificacao.idTipoNotificacao == '') {
					$scope.mensagemErro = 'Favor, escolher o Tipo de '+UTF8.Notificacao;
					return;
				}
				
				if ($scope.novoNotificacao.usuarioDTO.idUsuario == undefined|| $scope.novoNotificacao.usuarioDTO.idUsuario == '') {
					$scope.mensagemErro = 'Favor, escolher o Login';
					return;
				}

				if ($scope.novoNotificacao.status == undefined|| $scope.novoNotificacao.status == '') {
					$scope.mensagemErro = 'Favor, selecionar um Status';
					return;
				}
			}
		}
		
		//---------------------------------------ALTERAR
		$scope.alterarNotificacao = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';
			
			if($scope.frmAlteraNotificacao.$valid) {				
				
				console.log(JSON.stringify($scope.alteraNotificacao));
				
				var notificacaoParam = {};
				notificacaoParam.usuarioDTO = {};
				
				notificacaoParam.idNotificacao = $scope.alteraNotificacao.idNotificacao;
				notificacaoParam.idGrupoEconomico = $scope.alteraNotificacao.idGrupoEconomico;
				notificacaoParam.idEmpresa = $scope.alteraNotificacao.idEmpresa;
				notificacaoParam.idTipoNotificacao = $scope.alteraNotificacao.idTipoNotificacao;
				notificacaoParam.usuarioDTO.idUsuario = $scope.alteraNotificacao.usuarioDTO.idUsuario;
				notificacaoParam.status = $scope.alteraNotificacao.status;

				
				NotificacaoService.alteraNotificacao(notificacaoParam).then(
						function successCallback(res) {
							$scope.isExibirMensagemSucesso = true;
							$scope.mensagemSucesso = UTF8.Notificacao+' alterada com sucesso!';
							$scope.alteraNotificacao = {};

						},
						function errorCallback(res) {
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = res.data.mensagem;
						});
			}else{
				$scope.isExibirMensagemErro = true;
				if ($scope.alteraNotificacao.idGrupoEconomico == undefined || $scope.alteraNotificacao.idGrupoEconomico == '') {
					$scope.mensagemErro = 'Favor, escolher o Grupo '+UTF8.Economico;
					return;
				}

				if ($scope.alteraNotificacao.idEmpresa == undefined || $scope.alteraNotificacao.idEmpresa == '') {
					$scope.mensagemErro = 'Favor, escolher a Empresa';
					return;
				}
				
				if ($scope.alteraNotificacao.idTipoNotificacao == undefined|| $scope.alteraNotificacao.idTipoNotificacao == '') {
					$scope.mensagemErro = 'Favor, escolher o Tipo de '+UTF8.Notificacao;
					return;
				}
				
				if ($scope.alteraNotificacao.usuarioDTO.idUsuario == undefined|| $scope.alteraNotificacao.usuarioDTO.idUsuario == '') {
					$scope.mensagemErro = 'Favor, escolher o Login';
					return;
				}

				if ($scope.alteraNotificacao.status == undefined|| $scope.alteraNotificacao.status == '') {
					$scope.mensagemErro = 'Favor, selecionar um Status';
					return;
				}
			}
		}	
		
		//PESQUISAR 
		$scope.pesquisarPorCriterios = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			$scope.isExibirMensagemSucesso = false;
			$scope.mensagemSucesso = '';
			$scope.pag_paginaSelecionada = 1;
			$scope.filtroNotificacaoPage = angular.copy($scope.filtroNotificacao);
			
			$scope.carregarNotificacoesPorPagina($scope.filtroNotificacao);
		}
		
		
		
		
		
		
		
		
		
		//LISTAGENS ABAIXO
		
		
		
		//LISTAR COMBO EMPRESAS
		$scope.carregarEmpresas = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';

			var empresa = {};

			if($scope.filtroNotificacao.idGrupoEconomico == undefined || $scope.filtroNotificacao.idGrupoEconomico == ''){
				empresa.idGrupoEconomico = $scope.filtroNotificacao.idGrupoEconomico;

			} else {
				empresa.idGrupoEconomico = $scope.filtroNotificacao.idGrupoEconomico;
			}

			EmpresaService.pesquisarPorCriterios(empresa).then(
				function successCallback(res) {
					$scope.listaEmpresa = res.data;
					console.log('<-- UsuarioController.loadPage.listaEmpresa - carregado -->');
				}, 

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi possivel obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}
		//LISTAR COMBO EMPRESAS
		$scope.carregarEmpresasTelaCadastro = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';

			$scope.novoNotificacao.nome = '';
			$scope.novoNotificacao.email = '';
			
			var empresa = {};

			if($scope.novoNotificacao.idGrupoEconomico == undefined || $scope.novoNotificacao.idGrupoEconomico == ''){
				empresa.idGrupoEconomico = $scope.novoNotificacao.idGrupoEconomico;

			} else {
				empresa.idGrupoEconomico = $scope.novoNotificacao.idGrupoEconomico;
			}

			EmpresaService.pesquisarPorCriterios(empresa).then(
				function successCallback(res) {
					$scope.listaEmpresa = res.data;
					console.log('<-- UsuarioController.loadPage.listaEmpresa - carregado -->');
				}, 

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					//$scope.mensagemErro = 'N�o foi possivel obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}
		
		$scope.carregarEmpresasTelaAltera = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			
			$scope.alteraNotificacao.nome = '';
			$scope.alteraNotificacao.email = '';		
			var empresa = {};

			if($scope.alteraNotificacao.idGrupoEconomico == undefined || $scope.alteraNotificacao.idGrupoEconomico == ''){
				empresa.idGrupoEconomico = $scope.alteraNotificacao.idGrupoEconomico;

			} else {
				empresa.idGrupoEconomico = $scope.alteraNotificacao.idGrupoEconomico;
			}

			EmpresaService.pesquisarPorCriterios(empresa).then(
				function successCallback(res) {
					$scope.listaEmpresa = res.data;
					console.log('<-- UsuarioController.loadPage.listaEmpresa - carregado -->');
				}, 

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					//$scope.mensagemErro = 'N�o foi possivel obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}
		
		
		//LISTA COMBO LOGINS
		$scope.carregarComboLogin = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			var usuarioFiltro = {};
			
			if($scope.novoNotificacao.idGrupoEconomico == undefined || $scope.novoNotificacao.idGrupoEconomico == ''){
				usuarioFiltro.idGrupoEconomico = $scope.novoNotificacao.idGrupoEconomico;

			} else {
				usuarioFiltro.idGrupoEconomico = $scope.novoNotificacao.idGrupoEconomico;
			}
			
			if($scope.novoNotificacao.idEmpresa == undefined || $scope.novoNotificacao.idEmpresa == ''){
				usuarioFiltro.idEmpresa = $scope.novoNotificacao.idEmpresa;

			} else {
				usuarioFiltro.idEmpresa = $scope.novoNotificacao.idEmpresa;
			}
			
			UsuarioService.pesquisarPorCriterios(usuarioFiltro).then(
					function successCallback(retorno) {
						$scope.listaUsuario = retorno.data;
						console.log('<-- UsuarioController.pesquisarPorCriterios');
					}, 
					
					function errorCallback(retorno) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
					}
				);
			
		}
		
		$scope.carregarComboLoginAltera = function() {
			$scope.isExibirMensagemErro = false;
			$scope.mensagemErro = '';
			var usuarioFiltro = {};
			
			if($scope.alteraNotificacao.idGrupoEconomico == undefined || $scope.alteraNotificacao.idGrupoEconomico == ''){
				usuarioFiltro.idGrupoEconomico = $scope.alteraNotificacao.idGrupoEconomico;

			} else {
				usuarioFiltro.idGrupoEconomico = $scope.alteraNotificacao.idGrupoEconomico;
			}
			
			if($scope.alteraNotificacao.idEmpresa == undefined || $scope.alteraNotificacao.idEmpresa == ''){
				usuarioFiltro.idEmpresa = $scope.alteraNotificacao.idEmpresa;

			} else {
				usuarioFiltro.idEmpresa = $scope.alteraNotificacao.idEmpresa;
			}
			
			UsuarioService.pesquisarPorCriterios(usuarioFiltro).then(
					function successCallback(retorno) {
						$scope.listaUsuario = retorno.data;
						console.log('<-- UsuarioController.pesquisarPorCriterios');
					}, 
					
					function errorCallback(retorno) {
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
					}
				);
			
		}
		
		//POPULA CAMPO NOME DO USU�RIO E EMAIL
		$scope.preencherCamposLoginAndEmail = function(id) {
			$scope.novoNotificacao.nome = '';
			$scope.novoNotificacao.email = '';
			$scope.alteraNotificacao.nome = '';
			$scope.alteraNotificacao.email = '';
			
			console.log(id);
			
			if(id != undefined){
				UsuarioService.pesquisarPorId(id).then(
					function successCallback(res) {
						$scope.novoNotificacao.nome = res.data.nome;
						$scope.novoNotificacao.email = res.data.email;
						$scope.alteraNotificacao.nome = res.data.nome;
						$scope.alteraNotificacao.email = res.data.email;
					}, 
	
					function errorCallback(res) {
						//$scope.isExibirMensagemErro = true;
						//$scope.mensagemErro = 'N�o foi possivel obter Login e email. Favor, entrar em contato com o administrador do sistema.';
					}
				);	
			}else{
				return;
			}
			
		}
		
		$scope.carregarNotificacoesPorPagina = function(filtroNotificacaoParam) {

			console.log('--> NotificacaoController.carregarUsuariosPorPagina');
			console.log('$scope.pag_paginaSelecionada: ' + $scope.pag_paginaSelecionada);
			console.log('$scope.pag_registrosPorPagina: ' + $scope.pag_registrosPorPagina);

			NotificacaoService.pesquisarPorCriteriosPagina(
					filtroNotificacaoParam, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data.content == '') {
						$scope.mensagemErro = 'Nenhum registro encontrado.';
						$scope.isExibirMensagemErro = true;
					}

					$scope.listaNotificacao = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao = true;

				}, 

				function errorCallback(retorno) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi possivel efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
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