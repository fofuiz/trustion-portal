angular.module('trustionPortal').controller('DetalheGTVController', 
	function($scope, $uibModalInstance,gtv, DetalheGTVService, UTF8) {
	
		$scope.listaDetalheGTV = [];
		$scope.gtv = gtv;
		
		configurarPaginacao();
		loadPage();
		
		function loadPage() {
			$scope.pag_paginaSelecionada = 1;
			
			DetalheGTVService.pesquisarPorCriteriosPagina(gtv,$scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(
				function successCallback(res) {
					
					if(res.data.content == '') {
						$scope.mensagemErro = 'Nenhum registro encontrado.';
						$scope.isExibirMensagemErro = true;
					}
					
					$scope.listaDetalheGTV = res.data.content;
					$scope.pag_totalRegistros = res.data.totalElements;
					
				}, function errorCallback(res) {

					$scope.mensagemErro = res.mensagem;
					$scope.isExibirMensagemErro = true;
				}
			);
		}
	
		$scope.voltar = function() {
			$uibModalInstance.close();
		}
		
		$scope.carregarRelatorioPorPagina = function(gtv) {

			DetalheGTVService.pesquisarPorCriteriosPagina(gtv,$scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data.content == '') {
						$scope.mensagemErro = 'Nenhum registro encontrado.';
						$scope.isExibirMensagemErro = true;
					}

					$scope.listaDetalheGTV = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;

				}, 

				function errorCallback(retorno) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi '+UTF8.possivel+' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
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