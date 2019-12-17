angular.module('trustionPortal').controller('QuestionarValorD1Controller', function($scope, $uibModalInstance, $filter, $state, relatorio, TipoQuestionamentoService, OcorrenciaD1Service, UTF8){
	
	$scope.listaTipoQuestionamento = [];
	$scope.ocorrencia = {};
	$scope.ocorrencia.idRelatorioAnalitico = relatorio.idRelatorioAnalitico;
	$scope.relatorio = relatorio;
	$scope.valorQuestionamento = currency(relatorio.diferencaValorQuestionado, { separator: ".", decimal: "," }).format();

	function exibirMensagem(mensagem){
		$scope.isExibirMensagemErro = true;
		$scope.mensagemErro = mensagem;
	}
	
	function ocultarMensagem(){
		$scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
	}

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
	}

	loadPage();
	
	$(document).ready(function(){
		$('#valor-questionamento').maskMoney({thousands:'.', decimal:',', allowZero:true, allowNegative:true});
	});
	
	$scope.salvar = function(){
		ocultarMensagem();
		
		if($scope.ocorrencia.idTipoQuestionamento == undefined || $scope.ocorrencia.idTipoQuestionamento == '') {
			exibirMensagem('Favor, escolher o tipo de questionamento');
			return;
		}
	
		if($scope.valorQuestionamento == undefined || $scope.valorQuestionamento == '') {
			exibirMensagem('Favor, preencher o valor questionado');
			return;
		}
	
		if($scope.ocorrencia.observacao == undefined || $scope.ocorrencia.observacao == '') {
			exibirMensagem('Favor, preencher a ' + UTF8.observacao);
			return;
		}
		
		$scope.ocorrencia.valorQuestionado = currency($scope.valorQuestionamento, { separator: ".", decimal: "," });

		OcorrenciaD1Service.criar($scope.ocorrencia).then(function successCallback(res){
			$uibModalInstance.close();
			$state.go('listaOcorrencias', {idOcorrencia: res.data.idOcorrencia});
			
		}, function errorCallback(res){
			if(res.data != null && res.data.hasOwnProperty('mensagem')){
				exibirMensagem(res.data.mensagem);
			}else{
				exibirMensagem(UTF8.Nao+' foi '+UTF8.possivel+' efetuar o cadastro. Favor, entrar em contato com o administrador do sistema.');
			}
		});
	}
	
	$scope.cancelar = function() {
		$uibModalInstance.close();
	}
});