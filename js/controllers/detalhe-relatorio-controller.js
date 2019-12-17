angular.module('trustionPortal').controller('DetalheRelatorioController', 
	function($uibModal,$scope, $uibModalInstance, relatorio, DetalheRelatorioService,UTF8) {

	$scope.listaDetalheRelatorio = [];
	$scope.relatorio = relatorio;
	
	$scope.cnpjExibicao = relatorio.cnpj;
	$scope.valorTotalExibicao = relatorio.valorTotal;
	$scope.filtroGTV = relatorio.filtroGTV;
	$scope.numSerie = relatorio.numSerie;
	$scope.codigoFechamento = relatorio.codigoFechamento;
	
	var gtv = {}
	
	configurarPaginacao();
	loadPage();
	

	function loadPage() {
		$scope.pag_paginaSelecionada = 1;
		
		DetalheRelatorioService.pesquisarPorCriteriosPagina(relatorio.codigoFechamento, relatorio.numSerie, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(
			function successCallback(res) {
				$scope.listaDetalheRelatorio = res.data.content;
				
				$scope.populaGTVObjeto($scope);
				
				$scope.pag_totalRegistros = res.data.totalElements;

			}, function errorCallback(res) {

				$scope.mensagemErro = res.mensagem;
				$scope.isExibirMensagemErro = true;
			}
		);
	}
	
	$scope.populaGTVObjeto = function($scope){
		
		gtv.numSerie = $scope.listaDetalheRelatorio[0].numSerie;
		gtv.idEquipamento = $scope.listaDetalheRelatorio[0].idEquipamento;
		gtv.periodoInicialDt = $scope.listaDetalheRelatorio[0].depositoDT;
		
		return gtv;
	}
	
	$scope.carregarRelatorioPorPagina = function(codigoFechamento, numSerie) {
		
		DetalheRelatorioService.pesquisarPorCriteriosPagina(codigoFechamento, numSerie,$scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

			function successCallback(retorno) {

				if(retorno.data.content == '') {
					$scope.mensagemErro = 'Nenhum registro encontrado.';
					$scope.isExibirMensagemErro = true;
				}

				$scope.listaDetalheRelatorio =  retorno.data.content;
				$scope.pag_totalRegistros = retorno.data.totalElements;
			}, 

			function errorCallback(retorno) {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = UTF8.Nao+' foi '+UTF8.possivel+' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
			}
		);
	}
	
	$scope.modalDetalheGTV = function() {

		$uibModal.open(
			{
				animation: true,
				ariaLabelledBy: 'modal-titulo',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'partials/relatorioanaliticocreditos/modais/detalhe-gtv.html',
				controller: 'DetalheGTVController',
				windowClass: 'large-Modal',

				resolve: {
					gtv:function(){
						return gtv;
					}
				}
			}
		);
	}

	$scope.voltar = function() {
		$uibModalInstance.close();
	}
	
	function configurarPaginacao() {

		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 5;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 0;

	}

});