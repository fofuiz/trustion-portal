angular.module('trustionPortal').controller('DepositoController', function($scope, $filter, GrupoEconomicoService, EmpresaService, CofreService, DepositoService, CacheService, UTF8,$sce){
	$scope.minData = moment().subtract(90, 'day');
	$scope.maxData = moment().add(1, 'day');
	moment.locale("pt-br");
	
	$scope.textPesquisa = 'Pesquisar';
	$scope.desabilitaBtPesquisa = false;

	var status = 'Ativo';
	
	function configurarPaginacao() {
		$scope.paginacao = false;

		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 5;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 1;
	}
	configurarPaginacao();
	
	$scope.filtroDeposito = {};
	
	function carregaGrupoEconomico(){
		$scope.isExibirMensagemErro = false;
		var grupo = {}
		var idPerfil = CacheService.usuario.data.principal.idPerfil;

		GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(function successCallback(res){
			$scope.listaGrupoEconomico = res.data;
		}, function errorCallback(res){
			$scope.isExibirMensagemErro = true;
			$scope.mensagem = res.data.mensagem;
		});
	}
	
	carregaGrupoEconomico();
	
	$scope.carregaEmpresa = function(){
		$scope.isExibirMensagemErro = false;
		if($scope.filtroDeposito.grupoEconomico != undefined && $scope.filtroDeposito.grupoEconomico.idGrupoEconomico != ''){
			var empresas = [{
				idGrupoEconomico: $scope.filtroDeposito.grupoEconomico.idGrupoEconomico
			}];
			EmpresaService.pesquisarPorGrpEconD0(empresas).then(function successCallback(res){
					$scope.listaEmpresa = res.data;
			}, function errorCallback(res){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = res.data.mensagem;
			});
		}else{
			$scope.listaEmpresa = [];
		}
	}
	
	$scope.carregaCofre = function(){
		$scope.isExibirMensagemErro = false;
		if($scope.filtroDeposito.empresa != undefined && $scope.filtroDeposito.empresa.idEmpresa != ''){
			var cofre = {};
			cofre.idEmpresa = $scope.filtroDeposito.empresa.idEmpresa;
			cofre.status = status;
			CofreService.pesquisarPorCriterios(cofre).then(function successCallback(res){
				$scope.listaCofre = res.data;
			}, function errorCallback(res){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = res.data.mensagem;
			});
		}else{
			$scope.listaCofre = [];
		}
	}	

	//PESQUISA DEPOSITO NA API
	$scope.pesquisaDeposito = function(){
		
		if($scope.desabilitaBtPesquisa){
			return;
		}

		$scope.isExibirMensagemErro = false;
		
		if($scope.formListaDeposito.$valid){
			if($scope.dataInicial == undefined){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = 'Favor, preencher a data inicial';
				return;
			}
			if($scope.dataFinal == undefined){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = 'Favor, preencher a data final';
				return;
			}
			var dataInicialEnvio = new Date($scope.dataInicial);
			var dataFinalEnvio = new Date($scope.dataFinal);
			dataInicialEnvio.setHours(0,0,0);
			dataFinalEnvio.setHours(23,59,59);
			if(dataInicialEnvio.getTime() >= dataFinalEnvio.getTime()){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = 'Intervalo de datas '+UTF8.invalido;
				return;
			}
			
			var deposito = {};
			deposito.cnpjCliente = $scope.filtroDeposito.empresa.cnpj + '';
			deposito.equipamentoID = $scope.filtroDeposito.cofre.idEquipamento+'';
			deposito.equipamentoNumeroSerial = $scope.filtroDeposito.cofre.numSerie;
			deposito.dataInicio = dataInicialEnvio.getFullYear() +'-'+('0' + (dataInicialEnvio.getMonth()+1)).slice(-2)+'-'+('0' + dataInicialEnvio.getDate()).slice(-2);
			deposito.dataFinal = dataFinalEnvio.getFullYear() +'-'+ ('0' + (dataFinalEnvio.getMonth()+1)).slice(-2)+'-'+('0' + dataFinalEnvio.getDate()).slice(-2);
			
			registros = [];
			
			$scope.textPesquisa = 'Pesquisando...';
			$scope.desabilitaBtPesquisa = true;
			DepositoService.listarDeposito(deposito).then(function successCallback(res){
				if(res.data != ''){
					for(i = 0; i<res.data.length;i++){
						registros[i] = {};
						registros[i].grupoEconomico = $scope.filtroDeposito.grupoEconomico.nome;
						registros[i].empresa = $scope.filtroDeposito.empresa.razaoSocial;
						registros[i].cnpj = $scope.filtroDeposito.empresa.cnpj;
						registros[i].DepositoDT = $filter('date')(res.data[i].depositoDT, 'dd/MM/yyyy HH:mm:ss');
						registros[i].ValorTotal = validValorTotal(res.data[i].valorTotal);
						registros[i].TipoDeposito = res.data[i].tipoDeposito;
						registros[i].EquipamentoID = res.data[i].equipamentoID;
						registros[i].equipamento = res.data[i].equipamentoNumeroSerial;
						registros[i].sequencia = res.data[i].sequencia;
						registros[i].fechamento = res.data[i].idfechamento;
						registros[i].depositante = res.data[i].depositante;
						}
					$scope.textPesquisa = 'Pesquisar';
					$scope.desabilitaBtPesquisa = false;
					$scope.listaDeposito = registros;
					$scope.pag_totalRegistros = registros.length;
					$scope.paginacao = true;
				}else{
					$scope.listaDeposito = [];
					$scope.textPesquisa = 'Pesquisar';
					$scope.desabilitaBtPesquisa = false;
					$scope.mensagem = ''+UTF8.Nao+' '+UTF8.ha+' '+UTF8.depositos+' no '+UTF8.periodo+' informado.';
					$scope.isExibirMensagemErro = true;
				}
			}, function errorCallback(res){
				$scope.paginacao = false;
				$scope.listaDeposito = [];
				$scope.textPesquisa = 'Pesquisar';
				$scope.desabilitaBtPesquisa = false;
				$scope.mensagem = res.data.mensagem;
				$scope.isExibirMensagemErro = true;
			});

		}else{
			if($scope.filtroDeposito.grupoEconomico == undefined || $scope.filtroDeposito.grupoEconomico == ""){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = "Favor, escolher um grupo";
				return;
			}
			
			if($scope.filtroDeposito.empresa == undefined || $scope.filtroDeposito.empresa == ""){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = "Favor, escolher uma empresa";
				return;
			}
			
			if($scope.filtroDeposito.cofre == undefined || $scope.filtroDeposito.cofre == ""){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = "Favor, escolher um equipamento";
				return;
			}
			
			if($scope.dataInicial == undefined || $scope.dataInicial == ""){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = "Favor, escolher a data inicial";
				return;
			}
			
			if($scope.dataFinal == undefined || $scope.dataFinal == ""){
				$scope.isExibirMensagemErro = true;
				$scope.mensagem = "Favor, escolher a data final";
				return;
			}
		}
	}

	$scope.exportar = function(){
		var separadorLinha = '\n';
		var separadorCampo = ';';
		var registrosExport = '';
		registrosExport = 'Grupo ' + UTF8.Economico + separadorCampo +  'Empresa' + separadorCampo + 'Equipamento' + separadorCampo + 'CNPJ' + separadorCampo + 'Data ' + UTF8.Deposito + separadorCampo + 'Depositante' + separadorCampo + UTF8.Sequencia + separadorCampo +'Valor de ' + UTF8.Deposito + separadorCampo + 'Tipo de ' + UTF8.Deposito + separadorCampo + 'Fechamento' + separadorCampo + 'Id do Equipamento' + separadorLinha;
		for(i = 0; i<registros.length;i++){
			registrosExport += registros[i].grupoEconomico;
			registrosExport += separadorCampo;
			registrosExport += registros[i].empresa;
			registrosExport += separadorCampo;
			registrosExport += registros[i].equipamento;
			registrosExport += separadorCampo;
			registrosExport += registros[i].cnpj;
			registrosExport += separadorCampo;
			registrosExport += registros[i].DepositoDT;
			registrosExport += separadorCampo;
			registrosExport += registros[i].depositante;
			registrosExport += separadorCampo;
			registrosExport += registros[i].sequencia;
			registrosExport += separadorCampo;
			registrosExport += registros[i].ValorTotal;
			registrosExport += separadorCampo;
			registrosExport += registros[i].TipoDeposito;
			registrosExport += separadorCampo;
			registrosExport += registros[i].fechamento;
			registrosExport += separadorCampo;
			registrosExport += registros[i].EquipamentoID;
			registrosExport += separadorLinha;
		}
		
		var csvContent = registrosExport, 
		textEncoder = new CustomTextEncoder('windows-1252', {NONSTANDARD_allowLegacyEncoding: true}),
		fileName = 'deposito-consulta-'+new Date().toLocaleDateString("pt-BR")+'.csv';
		
		var csvContentEncoded = textEncoder.encode([csvContent]);
        var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=windows-1252;'});
        saveAs(blob, fileName);
	}


	function validValorTotal(valor){
		if(valor){
			return $filter("currency")(valor, "R$ ");
		}else{
			return "R$ 0,00";
		}
	}


});