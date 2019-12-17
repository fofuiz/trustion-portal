angular.module('trustionPortal').controller('LinkVideoController', function($scope, $uibModalInstance, relatorio, LinkVideoService) {
	$scope.relatorio = relatorio;
	$scope.listaDetalheRelatorio = [];
	$scope.listaRelatorioExport = [];

	$scope.linkVideoList = [];    
    $scope.isExibirMensagemErro = false;

	loadPage();
	
	function loadPage() {
		
		LinkVideoService.listarLinks($scope.relatorio.numeroGtv).then(
				function successCallback(res) {
				$scope.linkVideoList = res.data.tipos;
			}, function errorCallback(res) {
				$scope.mensagemErro = 'Ocorreu um erro ao listar os links. Tente novamente mais tarde';
				$scope.isExibirMensagemErro = true;
			}
		);
	}
	
	$scope.voltar = function() {
		$uibModalInstance.close();
	}	
});