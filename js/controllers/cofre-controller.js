angular.module('trustionPortal').controller('CofreController', 
	function($scope, $stateParams, CacheService, GrupoEconomicoService, EmpresaService, ModeloNegocioService, CofreService, CacheService, UTF8, TrustionHelpers) {

		$scope.listaGrupo = [];
		$scope.listaEmpresa = [];
		$scope.listaModeloNegocio = [];
		$scope.listaCofre = [];
		$scope.lstStatus = [];

		$scope.filtroCofre = {};
		$scope.filtroCofrePage = {};
		$scope.novoCofre = {};
		$scope.alteraCofre = {};

		configurarPaginacao();
		loadPage();
		
		function loadPage() {
			
			$scope.lstStatus = ["Ativo", "Inativo"];
			$scope.hideMessage();

			var idPerfil = CacheService.usuario.data.principal.idPerfil;

			GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(
				function successCallback(res) {
					$scope.listaGrupo = res.data;
				},

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de grupo. Favor entrar em contato com o administrador do sistema.');
				}
			);
		}
		
		
		//VERIFICANDO SE É UPDATE
		if($stateParams.idCofre){
			CofreService.pesquisarPorId($stateParams.idCofre).then(
					
				function successCallback(res) {
					$scope.alteraCofre = res.data;
					$scope.carregarEmpresas(res.data.idGrupoEconomico);
					$scope.carregarModelosNegocio(res.data.idEmpresa);
				},
				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
				}
			);
		}
		
		
		//---------------------------------------CADASTRAR
		$scope.cadastraCofre = function() {
			$scope.hideMessage();
				
			if ($scope.frmCadastroCofre.$valid) {
				$scope.isDadosInvalidos = false;

				$scope.novoCofre.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;						
				
				CofreService
					.cadastra($scope.novoCofre)
					.then(
						function successCallback(res) {
							$scope.showSuccessMessage('Cofre criado com sucesso!');
							$scope.novoCofre = {};

						},
						function errorCallback(res) {
							$scope.showErrorMessage(res.data.mensagem);
						}
					);

			} else {
				if (!$scope.novoCofre.idEquipamento) {
					$scope.showErrorMessage('Favor preencher o ID do Equipamento');
					return;
				}
				
				if (!$scope.novoCofre.numSerie) {
					$scope.showErrorMessage('Favor preencher o ' + UTF8.Numero + ' de S' + UTF8.eAgudo + 'rie');
					return;
				}
				
				if (!$scope.novoCofre.idGrupoEconomico) {
					$scope.showErrorMessage('Favor escolher o Grupo');
					return;
				}

				if (!$scope.novoCofre.idEmpresa) {
					$scope.showErrorMessage('Favor escolher a Empresa');
					return;
				}

				if (!$scope.novoCofre.idModeloNegocio) {
					$scope.showErrorMessage('Favor escolher o Modelo de ' + UTF8.Negocio);
					return;
				}
				
				if (!$scope.novoCofre.status) {
					$scope.showErrorMessage('Favor escolher um Status');
					return;
				}
			}
		}
		
		//---------------------------------------ALTERAR
		$scope.alterarCofre = function() {
			$scope.hideMessage();
				
			if ($scope.frmAlteraCofre.$valid) {
				$scope.isDadosInvalidos = false;

				$scope.alteraCofre.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;						
				
				CofreService
						.alterar($scope.alteraCofre)
						.then(
							function successCallback(res) {
								$scope.showSuccessMessage('Cofre alterado com sucesso!');
								$scope.alteraCofre = {};

							},
							function errorCallback(res) {
								$scope.showErrorMessage(res.data.mensagem);
							});

			} else {
				if (!$scope.alteraCofre.idEquipamento) {
					$scope.showErrorMessage('Favor preencher o ID do Equipamento');
					return;
				}
				
				if (!$scope.alteraCofre.numSerie) {
					$scope.showErrorMessage('Favor preencher o ' + UTF8.Numero + ' de S' + UTF8.eAgudo + 'rie');
					return;
				}
				
				if (!$scope.alteraCofre.idGrupoEconomico) {
					$scope.showErrorMessage('Favor escolher o Grupo');
					return;
				}
			
				if (!$scope.alteraCofre.idEmpresa) {
					$scope.showErrorMessage('Favor escolher a Empresa');
					return;
				}

				if (!$scope.alteraCofre.idModeloNegocio) {
					$scope.showErrorMessage('Favor escolher o Modelo de ' + UTF8.Negocio);
					return;
				}
				
				if (!$scope.alteraCofre.status) {
					$scope.showErrorMessage('Favor escolher um Status');
					return;
				}
			}
		}
		
		//PESQUISAR 
		$scope.pesquisarPorCriterios = function() {

			$scope.hideMessage();
			$scope.pag_paginaSelecionada = 1;
			$scope.filtroCofrePage = angular.copy($scope.filtroCofre);
			
			$scope.carregarCofresPorPagina($scope.filtroCofre);
		}
		
		//LISTAR COMBO DE EMPRESAS E DE MODELOS DE NEGÓCIOS
		$scope.carregarEmpresas = function(idGrupoEconomico) {
			$scope.hideMessage();
			$scope.listaEmpresa = '';
			
			if(idGrupoEconomico != undefined){
				var listaGrpEcon = [{
					idGrupoEconomico: idGrupoEconomico
				}];

				EmpresaService.pesquisarPorGrpEcon(listaGrpEcon).then(
					function successCallback(res) {
						$scope.listaEmpresa = res.data;
					}, 

					function errorCallback(res) {
						$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de empresa. Favor entrar em contato com o administrador do sistema.');
					}
				);
			}

	
		}

		//LISTAR COMBO DE MODELO DE NEGÓCIO
		$scope.carregarModelosNegocio = function(idEmpresa) {
			$scope.hideMessage();
			$scope.listaModelosNegocio = '';

			if (idEmpresa) {
				ModeloNegocioService.listarPorEmpresa(idEmpresa).then(
					function successCallback(res) {
						$scope.listaModelosNegocio = TrustionHelpers.duplicateCleaning(res.data) ;
					}, 

					function errorCallback(res) {
						$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de modelos de ' + UTF8.negocio + '. Favor entrar em contato com o administrador do sistema.');
					}
				);
			}

		}

		$scope.carregarCofresPorPagina = function(filtroCofreParam) {

			CofreService.pesquisarPorCriteriosPagina(
					filtroCofreParam, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}
					
					$scope.listaCofre = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao= true;

				}, 

				function errorCallback(retorno) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
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
