angular.module('trustionPortal').controller('ObservacaoOcorrenciaD1Controller', function($scope, observacao, $uibModalInstance){
    $scope.observacao = observacao;

    $scope.cancelar = function(){
        $uibModalInstance.dismiss();
    };
});