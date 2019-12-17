angular.module('trustionPortal').controller('LogApiController', function($scope, LogApiService, GrupoEconomicoService, EmpresaService, CofreService, CacheService, UTF8){
	
	$scope.filtroLogApi = {};
	$scope.listaStatusConsulta = [
		'Pendente',
		'Sucesso',
		'Falha'
	];
	var filtroLogApiPage = {};
	
	configurarPaginacao();
	loadPage();
	
	function loadPage(){
		$scope.hideMessage();
		var idPerfil = CacheService.usuario.data.principal.idPerfil;
		GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(function successCallback(res){
			$scope.listaGrupoEconomico = res.data;
		}, function errorCallback(res){
			$scope.showErrorMessage(res.data.mensagem);
		});
	}
	
	function configurarPaginacao() {
		$scope.paginacao = false;

		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 5;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 0;
	}
	
	$scope.carregarEmpresas = function(){
		$scope.hideMessage();
		
		if($scope.filtroLogApi.idGrupoEconomico == undefined || $scope.filtroLogApi.idGrupoEconomico == ''){
			$scope.listaEmpresa = undefined;
			return;
		}
		
		var empresa = {};
		empresa.idGrupoEconomico = $scope.filtroLogApi.idGrupoEconomico;
		EmpresaService.pesquisarPorCriterios(empresa).then(function successCallback(res){
			$scope.listaEmpresa = res.data;
		}, function errorCallback(res){
			$scope.showErrorMessage(res.data.mensagem);
		});
	}
	
	$scope.carregarCofres = function(){
		$scope.hideMessage();
		
		if($scope.filtroLogApi.idEmpresa == undefined || $scope.filtroLogApi.idEmpresa == ''){
			$scope.listaCofre = undefined;
			return;
		}
		
		var cofre = {};
		cofre.idEmpresa = $scope.filtroLogApi.idEmpresa;
		
		CofreService.pesquisarPorCriterios(cofre).then(function sucessCallback(res){
			$scope.listaCofre = res.data;		
		}, function errorCallback(res){
			$scope.showErrorMessage(res.data.mensagem);
		});
		
	}
	
	
	$scope.pesquisarPorCriterios = function(){
		$scope.hideMessage();
		
		if($scope.formListaLogApi.$valid){
			
			if($scope.dataInicial == undefined){
				$scope.showErrorMessage('Por favor, preencher a data inicial.');
				return;
			}
			if($scope.dataFinal == undefined){
				$scope.showErrorMessage('Por favor, preencher a data final.');
				return;
			}
			var dataInicialEnvio = new Date($scope.dataInicial);
			var dataFinalEnvio = new Date($scope.dataFinal);
			dataInicialEnvio.setHours(0, 0, 0);
			dataFinalEnvio.setHours(23, 59, 59);
			if(dataInicialEnvio.getTime() >= dataFinalEnvio.getTime()){
				$scope.showErrorMessage('Intervalo de datas '+UTF8.invalido+'!');
				return;
			}
			
			$scope.pag_paginaSelecionada = 1;
			$scope.filtroLogApi.dataInicial = dataInicialEnvio.getTime();
			$scope.filtroLogApi.dataFinal = dataFinalEnvio.getTime();
			filtroLogApiPage = angular.copy($scope.filtroLogApi);
			
			$scope.carregarLogsPorPagina()
		}else{
			$scope.showErrorMessage('Os filtros de data '+ UTF8.sao +' '+ UTF8.obrigatorios +'. Por favor, informe o '+ UTF8.periodo +' de pesquisa.');
		}
	}
	
	$scope.carregarLogsPorPagina = function(){
		$scope.hideMessage();		

		LogApiService.listaCriteriosPage(filtroLogApiPage, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(function successCallback(res){
			if(res.data.content == ''){
				$scope.paginacao = false;
				$scope.showErrorMessage('Nenhum registro de log encontrado.');
				$scope.listaLogApi = undefined;
			}else{
				$scope.listaLogApi = res.data.content;
				$scope.pag_totalRegistros = res.data.totalElements;
				$scope.paginacao = true;
			}
		}, function errorCallback(res){
			$scope.showErrorMessage(res.data.mensagem);
			$scope.paginacao = false;
		});
	}
});