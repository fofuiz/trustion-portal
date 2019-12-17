angular.module('trustionPortal').controller('MotivoConclusaoController', 
	function($scope, $stateParams, MotivoConclusaoService, UTF8) {

        $scope.filtroTipoMotivoConclusao = {};
        var filtroTipoMotivoConclusaoPage = {};

        $scope.motivoConclusao = {
			"idTipoMotivoConclusao": '',
			"descricao": ''
		}
        
        configurarPaginacao();

        function configurarPaginacao() {
			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;
        }

        if($stateParams.idMotivoConclusao) {
			$scope.ehEdicao = true;

			MotivoConclusaoService.pesquisarPorId($stateParams.idMotivoConclusao).then(
				function successCallback(res) {
                    $scope.motivoConclusao = res.data;
				}, function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
        }
        
        $scope.pesquisarPorCriterios = function () {
            $scope.hideMessage();
    
            $scope.listaTipoMotivoConclusao = null;
            $scope.pag_paginaSelecionada = 1;
            filtroTipoMotivoConclusaoPage = angular.copy($scope.filtroTipoMotivoConclusao);
    
            $scope.carregarMotivosConclusaoPorPagina();
        }

        $scope.carregarMotivosConclusaoPorPagina = function () {

            MotivoConclusaoService.listar(filtroTipoMotivoConclusaoPage).then(function successCallback(res) {
                if (res.data.content == '') {
                    $scope.showErrorMessage('Nenhum motivo de conclusão encontrado.');
                    $scope.paginacao = false;
                } else {
                    $scope.listaTipoMotivoConclusao = res.data;
                    $scope.paginacao = true;
                    $scope.pag_totalRegistros = res.data.totalElements;
                }
            }, function errorCallback(res) {
                $scope.paginacao = false;
                $scope.showErrorMessage(res.data.mensagem);
            });
    
        }

        function criar() {

			MotivoConclusaoService.criar($scope.motivoConclusao).then(function successCallback(res){
				$scope.showSuccessMessage('Motivo criado com sucesso!');
				$scope.motivoConclusao = {};

			}, function errorCallback(res){
				$scope.showErrorMessage(res.data.mensagem);
			});

        }
        
        function alterar() {

            MotivoConclusaoService.alterar($scope.motivoConclusao).then(
				function successCallback(res) {
					$scope.showSuccessMessage('Motivo alterado com sucesso!');

				},
				function errorCallback(res) {
					$scope.showErrorMessage(res.data.mensagem);
				}
			);
            
		}

        $scope.submitMotivoConclusao = function() {
			if($scope.ehEdicao) {
				alterar();
			}else {
				criar();
			}
		}
	}
);
