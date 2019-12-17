angular.module('trustionPortal').controller('TransportadoraController', 
	function($scope, $stateParams, TransportadoraService, CacheService, TrustionHelpers, UTF8) {

		$scope.hideMessage();

		$scope.listaTransportadora = [];
		$scope.novaTransportadora = {};
		$scope.alteraTransportadora = {};
		$scope.filtroTransportadora = {};
		$scope.filtroTransportadoraPage = {};

		$scope.listaEmpresa = [];

		$scope.listaStatus = [
			{codigo: 'A', descricao: 'Ativo'}, 
			{codigo: 'I', descricao: 'Inativo'}
		];

		$scope.listaEnvioInformacao = [
			{codigo: 'API', descricao: 'API'}, 
			{codigo: 'Carga de Arquivo', descricao: 'Carga de Arquivo'}
		];

		configurarPaginacao();
		loadPage();

		function loadPage() {
			$scope.hideMessage();	
		}

		if($stateParams.idTransportadora) {
			
			TransportadoraService.pesquisarPorId($stateParams.idTransportadora).then(
				function successCallback(retorno) {
					$scope.alteraTransportadora = retorno.data;

				}, function errorCallback(retorno) {
					$scope.showErrorMessage(retorno.data.mensagem);
				}
			);
		}
		
		$scope.pesquisarPorCriterios = function() {

			$scope.hideMessage();
			$scope.pag_paginaSelecionada = 1;
			$scope.filtroTransportadoraPage = angular.copy($scope.filtroTransportadora);

			$scope.carregarTransportadorasPorPagina($scope.filtroTransportadora);

		}

		$scope.criar = function(){
			$scope.hideMessage();

			if($scope.novaTransportadora.email && !TrustionHelpers.validarEmail($scope.novaTransportadora.email)) {
				$scope.showErrorMessage('E-mail ' + UTF8.invalido);
				return;
			}

			if($scope.formnovaTransportadora.$valid) {
				$scope.novaTransportadora.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

				TransportadoraService.criar($scope.novaTransportadora).then(function successCallback(res){
					$scope.showSuccessMessage('Transportadora criada com sucesso!');
					$scope.novaTransportadora = {};

				}, function errorCallback(res){
					$scope.showErrorMessage(res.data.mensagem);
				});

			} else if ($scope.novaTransportadora.razaoSocial == undefined || $scope.novaTransportadora.razaoSocial == '' ||
				$scope.novaTransportadora.cnpj == undefined || $scope.novaTransportadora.cnpj == '' ||
				$scope.novaTransportadora.status == undefined || $scope.novaTransportadora.status == '' ||
				$scope.novaTransportadora.listaEnvioInformacao == undefined || $scope.novaTransportadora.listaEnvioInformacao == '') {
				$scope.showErrorMessage('Por favor, preencha os campos obrigatórios destacados com *.');
			}
		}
		
		$scope.alterar = function(){

			$scope.hideMessage();

			if($scope.novaTransportadora.email && !TrustionHelpers.validarEmail($scope.novaTransportadora.email)) {
				$scope.showErrorMessage('E-mail ' + UTF8.invalido);
				return;
			}

			$('formAlteraTransportadora.cep').focus();

			if($scope.formAlteraTransportadora.$valid) {

				$scope.alteraTransportadora.idUsuarioAlteracao = CacheService.usuario.data.principal.idUsuario;

				TransportadoraService.alterar($scope.alteraTransportadora).then(
					function successCallback(res) {
						$scope.showSuccessMessage('Transportadora alterada com sucesso!');
					},
					function errorCallback(res) {
						$scope.showErrorMessage(res.data.mensagem);
					}
				);

			} else if ($scope.alteraTransportadora.razaoSocial == undefined || $scope.alteraTransportadora.razaoSocial == '' ||
				$scope.alteraTransportadora.cnpj == undefined || $scope.alteraTransportadora.cnpj == '' ||
				$scope.alteraTransportadora.status == undefined || $scope.alteraTransportadora.status == '') {
				$scope.showErrorMessage('Por favor, preencha os campos obrigatórios destacados com *.');
			}
		}

		$scope.carregarTransportadorasPorPagina = function(filtroTransportadora) {

			TransportadoraService.pesquisarPorCriteriosPagina(
					filtroTransportadora, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data.content == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}

					$scope.listaTransportadora = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao = true;

				}, 

				function errorCallback(retorno) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
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