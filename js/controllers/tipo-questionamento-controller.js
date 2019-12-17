angular.module('trustionPortal').controller('TipoQuestionamento', function($scope, $stateParams, TipoQuestionamentoService){

    var pesquisaTipoQuestionamento = function(payload) {
        TipoQuestionamentoService.listar(payload).then(function successCallback(response) {
            var tiposQuestionamentos = response.data;

            if(!tiposQuestionamentos || tiposQuestionamentos.length === 0) {
                $scope.tiposQuestionamentos = [];
                $scope.showInfoMessage('Nenhum registro encontrado.')
                return;
            }

            $scope.tiposQuestionamentos = tiposQuestionamentos;

        }, function errorCallback(response) {
            $scope.showErrorMessage('Erro ao Pesquisar.');
        });
    }

    var prepararEdicao = function(idTipoQuestionamento) {
        TipoQuestionamentoService.listarPorId(idTipoQuestionamento).then(function successCallback(response) {
            var tipoQuestionamento = response.data;

            if (tipoQuestionamento) {
                $scope.tipoQuestionamento = tipoQuestionamento;
            } else {
                $scope.showInfoMessage("Tipo de questionamento não encontrado");
                $scope.tipoQuestionamento = {};
            }

        }, function errorCallback(response) {
            $scope.showErrorMessage('Erro ao Pesquisar.');
        });
    }

    var salvar = function() {
        $scope.hideMessage();
        var payload = angular.copy($scope.tipoQuestionamento);

        if($scope.frmTipoQuestinamento.$valid) {

            TipoQuestionamentoService.criar(payload).then(function successCallback(response) {
                $scope.showSuccessMessage('Tipo de questionamento criado com sucesso!');
                $scope.tipoQuestionamento = {};
            }, function errorCallback(response) {
                $scope.showErrorMessage('Erro ao Salvar.');
            });
        } else {
            $scope.showErrorMessage('Campos com * são obrigatórios.');
        }
    }

    var atualizar = function() {
        var tipoQuestionamento = angular.copy($scope.tipoQuestionamento);
        var payload = {
            "idTipoQuestionamento": tipoQuestionamento.idTipoQuestionamento,
            "descricao": tipoQuestionamento.descricao
        }

        TipoQuestionamentoService.atualizar(payload).then(function successCallback(response) {
            $scope.showSuccessMessage('Tipo de questionamento atualizado com sucesso!');
        }, function errorCallback(response) {
            $scope.showErrorMessage('Erro ao atualizar.');
        });
    }

    var loadPage = function() {
        $scope.hideMessage();
        $scope.ehCriacao = true;

        if($stateParams.idTipoQuestionamento) {
            $scope.ehCriacao = false;
            prepararEdicao($stateParams.idTipoQuestionamento);
        }
    }

    $scope.formTipoQuestionamentoSubmit = function() {
        if ($scope.ehCriacao) {
            salvar();
        } else {
            atualizar();
        }
    }

    $scope.pesquisaTipoQuestionamento = function() {
        $scope.hideMessage();

        var payload = angular.copy($scope.tipoQuestionamento);
        pesquisaTipoQuestionamento(payload);
    }

    

    loadPage();
});