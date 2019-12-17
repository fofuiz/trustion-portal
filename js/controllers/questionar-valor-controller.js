angular.module('trustionPortal').controller('QuestionarValorController', 
	function($scope, $state, $uibModalInstance, relatorio, TipoQuestionamentoService, OcorrenciaService, UTF8) {
	
		$scope.listaTipoQuestionamento = [];
		$scope.ocorrencia = {};
		$scope.ocorrencia.idRelatorioAnalitico = relatorio.idRelatorioAnalitico;
		$scope.ocorrencia.dataCredito = relatorio.dataCorte;
		$scope.ocorrencia.valorRegistradoCofre = relatorio.valorTotal;
		$scope.relatorio = relatorio;

		$scope.valorQuestionado = currency(relatorio.diferencaValorQuestionado, { separator: ".", decimal: "," }).format();

		function loadPage() {
			TipoQuestionamentoService.listar().then(
				function successCallback(res) {
					$scope.listaTipoQuestionamento = res.data;

				}, function errorCallback(res) {
					if(res.data != null && res.data.hasOwnProperty('mensagem')){
						exibirMensagem(res.data.mensagem);
					}else{
						exibirMensagem(UTF8.Nao+' foi '+UTF8.possivel+' listar os tipos de questionamento. Favor, entrar em contato com o administrador do sistema.');
					}
				}
			);

			$(document).ready(function(){
				$('#valor-questionamento-d0').maskMoney({thousands:'.', decimal:',', allowZero:true, allowNegative:true});
			});
		}

		loadPage();

		$scope.salvar = function() {

			if($scope.ocorrencia.idTipoQuestionamento == undefined || $scope.ocorrencia.idTipoQuestionamento == '') {
				$scope.mensagemErro = 'Favor, escolher o tipo de questionamento';
				$scope.isExibirMensagemErro = true;
				return;
			}		
		
			if($scope.ocorrencia.observacao == undefined || $scope.ocorrencia.observacao == '') {
				$scope.mensagemErro = 'Favor, preencher a ' + UTF8.observacao;
				$scope.isExibirMensagemErro = true;
				return;
			}

			$scope.ocorrencia.valorQuestionado = currency($scope.valorQuestionado, { separator: ".", decimal: "," });
			
			OcorrenciaService.criar($scope.ocorrencia).then(
				function successCallback(res) {
					$uibModalInstance.close();
					$state.go('listaOcorrencias', {idOcorrencia: res.data.idOcorrencia});

				}, function errorCallback(res) {
					$scope.mensagemErro = res.data.mensagem;
					$scope.isExibirMensagemErro = true;
				}
			);
		}

		$scope.cancelar = function() {
			$uibModalInstance.dismiss();
		}

	}
);