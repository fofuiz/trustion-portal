angular.module('trustionPortal').controller('ObservacaoOcorrenciaController', function($scope, observacao, $uibModalInstance){
	$scope.observacao = observacao;
	
	$scope.cancelar = function(){
		$uibModalInstance.dismiss();
	};
});