angular.module('trustionPortal').controller('CategoriaController', 
	function($scope, $state, $stateParams, CategoriaService, CacheService, UTF8) {

		$scope.hideMessage();

		$scope.listaCategoria = [];
		$scope.novaCategoria = {};
		$scope.alteraCategoria = {};
		$scope.filtroCategoria = {};
		$scope.filtroCategoriaPage = {};

		$scope.listaStatus = [
			{codigo: 'A', descricao: 'Ativo'}, 
			{codigo: 'I', descricao: 'Inativo'}
		];

		$scope.listaTipoCategoria = [
			{codigo: 1, descricao: 'Motivo da Conclusão'}, 
			{codigo: 2, descricao: 'Tipo de questionamento'}
		];

		configurarPaginacao();
		loadPage();

		function loadPage() {
			
			$scope.hideMessage();		
			
			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
			
		}
		
		if($stateParams.idCategoria) {
			
			CategoriaService.pesquisarPorId($stateParams.idCategoria).then(
				function successCallback(retorno) {
					$scope.alteraCategoria = retorno.data;

				}, function errorCallback(retorno) {
					$scope.showErrorMessage(retorno.data.mensagem);
				}
			);
		}
		
		$scope.pesquisarPorCriterios = function() {

			$scope.hideMessage();

			$scope.pag_paginaSelecionada = 1;
			$scope.filtroCategoriaPage = angular.copy($scope.filtroCategoria);

			$scope.carregarCategoriaPorPagina($scope.filtroCategoria);

		}

		$scope.criar = function(){

			$scope.hideMessage();

			if($scope.formNovaCategoria.$valid) {

				$scope.novaCategoria.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

				CategoriaService.criar($scope.novaCategoria).then(function successCallback(res){
					$scope.showSuccessMessage('Categoria criada com sucesso!');
					$scope.novaCategoria = {};

				}, function errorCallback(res){
					$scope.showErrorMessage(res.data.mensagem);
				});

			} else {

				if($scope.novaCategoria.idTipoCategoria == undefined || $scope.novaCategoria.idTipoCategoria == ''){
					$scope.showErrorMessage('Por favor, informe o Tipo de Categoria.');

                } else if($scope.novaCategoria.descricao == undefined || $scope.novaCategoria.descricao == ''){
					$scope.showErrorMessage('Por favor, informe a Descrição.');

				} else if($scope.novaCategoria.status == undefined || $scope.novaCategoria.status == ''){
					$scope.showErrorMessage('Por favor, informe o Status.');
				}
			}
		}

		$scope.alterar = function(){

			$scope.hideMessage();

			if($scope.formAlteraCategoria.$valid) {

				$scope.alteraCategoria.idUsuarioAlteracao = CacheService.usuario.data.principal.idUsuario;

				CategoriaService.alterar($scope.alteraCategoria).then(
					function successCallback(res) {
						$scope.showSuccessMessage('Categoria alterada com sucesso!');

					},

					function errorCallback(res) {
						$scope.showErrorMessage(res.data.mensagem);
					}
				);

			} else {

				if($scope.alteraCategoria.idTipoCategoria == undefined || $scope.alteraCategoria.idTipoCategoria == ''){
					$scope.showErrorMessage('Por favor, informe o Tipo de Categoria.');

                } else if($scope.alteraCategoria.descricao == undefined || $scope.alteraCategoria.descricao == ''){
					$scope.showErrorMessage('Por favor, informe a Descrição.');

                } else if($scope.alteraCategoria.status == undefined || $scope.alteraCategoria.status == ''){
					$scope.showErrorMessage('Por favor, informe o Status.');
				}
				
			}
		}

		$scope.carregarCategoriaPorPagina = function(filtroCategoria) {

			CategoriaService.pesquisarPorCriteriosPagina(
					filtroCategoria, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data.content == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}

					$scope.listaCategoria = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao = true;

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