angular.module('trustionPortal').controller('RegistrosNaoProcessadosController', function($scope, $filter, UsuarioService, valoresComboService, registrosNaoProcessadosService) {

	$scope.paginaAtual = 1;
	$scope.itensPorPagina = 25;
	$scope.numeroMaximoDeBotoes = 5;
	$scope.numeroDePaginas = 10;
	$scope.qtdeTotalDeItens = 0; // serah atribuido o length do response
	
	

	$scope.buscarEmpresa = function(){
		UsuarioService.buscarEmpresa().then(
			function(result){
				$scope.empId = result.data.idEmpresaCa;
				$scope.nomeEmpresa = result.data.razaoSocial;
				$scope.cnpj = mascaraCnpj(result.data.cnpj);
			},function (result) {
				console.log('Error:'+result);
		});
	};

    function mascaraCnpj(valor) {
		return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
	}

	function carregarComboOpcaoExtrato() {
		valoresComboService.carregarComboOpcaoExtrato().then(function(response) {
			$scope.tiposLancamentos = response.data;
		});
	}
	


	/**
	 * Pesquisa os registros nao processados.
	 * Obs: a paginacao estah sendo feita no front.
	 */
	$scope.pesquisaRegistrosNaoProcessados = function() {
		var payload = new Object();

		$scope.isExibirMensagemErro = false;
		$scope.showTable = false;

		if(!$scope.tipoLancamento) {
			$scope.mensagemErro = "Tipo Lançamento é obrigatório.";
			$scope.isExibirMensagemErro = true;
			return;
		}

		payload.dataInicial = moment($scope.dataInicial).format("YYYY-MM-DD");
		payload.dataFinal = moment($scope.dataFinal).format("YYYY-MM-DD");
		payload.listaEmpresas = $scope.empId;
		payload.opcaoExtrato = $scope.tipoLancamento;
		payload.codOperadora = $scope.codOperadora;

		registrosNaoProcessadosService.buscarRegistrosNaoProcessados(payload).then(function success(response){
			
			if(response.data.length > 0) {
				$scope.resgitrosNaoProcessados = response.data;
				$scope.qtdeTotalDeItens = response.data.length;
				$scope.showTable = true;
			}else {
				$scope.mensagemErro = "Nenhum registro encontrado.";
				$scope.isExibirMensagemErro = true;
			}
			
		}, function error(response) {
			$scope.mensagemErro = "Erro ao realizar a pesquisa.";
			$scope.isExibirMensagemErro = true;
			$scope.showTable = false;
		});
	}



	function init() {
		$scope.dataInicial = moment().date(1);
		$scope.dataFinal = moment();
		$scope.operadoras = [
			{
				"codOperadora": 2,
				"nomeOperadora": "CIELO"
			}
		];
		$scope.codOperadora = $scope.operadoras[0].codOperadora;
		$scope.buscarEmpresa();
		carregarComboOpcaoExtrato();
	}

	

	init();

});