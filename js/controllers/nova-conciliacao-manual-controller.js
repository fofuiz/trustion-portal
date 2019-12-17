angular.module('trustionPortal').controller('NovaConciliacaoManualController',
	function ($scope, $filter, TrustionHelpers, $window, valoresComboService, conciliacaoCartaoDetalheService, novaConciliacaoService, UsuarioService, $timeout) {

	$scope.data = {
		gridMovimentoCartao: {
			dados: [],
			popoverDados: [],
			resumoPesquisa: {
				nomeDoBanco: undefined,
				nomeDaOperadora: undefined,
				numeroDaAgencia: undefined,
				numeroDaConta: undefined,
				dataDoPagamento: undefined,
				valorInicial: 0,
				valorFinal: 0,
				dataInicial: undefined,
				dataFinal: undefined,
				totalConsulta: 0,
				totalSelecionado: 0,
				qtdLinhasSelecionadas: 0
			},
			itensPorPagina: "10",
			numeroDePaginas: 0,
			qtdeTotalDeItens: 0,
			paginaAtual: 1,
			numeroMaximoDeBotoes: 5,
			itensSelecionados: []
		},
		gridMovimentoExtrato: {
			dados: [],
			resumoPesquisa: {
				nomeDoBanco: undefined,
				nomeDaOperadora: undefined,
				numeroDaAgencia: undefined,
				numeroDaConta: undefined,
				dataDoPagamento: undefined,
				valorInicial: 0,
				valorFinal: 0,
				dataInicial: undefined,
				dataFinal: undefined,
				totalConsulta: 0,
				totalSelecionado: 0,
				qtdLinhasSelecionadas: 0
			},
			itensPorPagina: "10",
			numeroDePaginas: 0,
			qtdeTotalDeItens: 0,
			paginaAtual: 1,
			numeroMaximoDeBotoes: 5,
			itensSelecionados: []
		},
		replicacaoDeFormulario: true,
		dataGridMovimentoCartao: [],
		dataGridMovimentoExtrato: [],
		datas: {
			statusDataInicialMovimentoCartao: false,
			statusDataFinalMovimentoCartao: false,
			statusDataInicialMovimentoExtrato: false,
			statusDataFinalMovimentoExtrato: false,
			statusDataArquivoConciliacao : false,
		},
		formMovimentoCartao: {}, /* formulário movimento cartões */
		formMovimentoExtrato: {}, /* formulário movimento contábil */
		formConciliar : {},
		listaBancos: [], /* lista contendo todos os bancos ativos - retornado pelo servico valoresComboService */
		listaOperadoras: [], /* lista contendo todos as operadoras - retornado pelo servico valoresComboService */
		listaModalidades: [],
		listaMotivos: [],
		showForm: true,
		showDataGrid: false,
		diferencaMovimentoCartaoExtrato: 0,
		divMsg : false,
		divConfirma : false,
		statusMensagem : "",	
		configData: {
			formato: 'dd/MM/yyyy',
			showWeeks: false,
			text: {
				clear: 'Limpar',
				close: 'Fechar',
				current: 'Hoje'
			}
		}			
	};

	$scope.buscarEmpresa = function(){
    UsuarioService.buscarEmpresa().then(
      function success(response){
        if(response.data.length > 0){
          $scope.empresaCaList = response.data;
        }
        else{
          showAppToastr("Empresa(s) não tem dados de cartão.");
        }
      },
      function (result) {
      console.log('Error:'+result);
      }
    );
  };

  function mascaraCnpj(valor) {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
  }

	/* Exibir / Ocultar Datepickers */
	$scope.toggleDataInicialMovimentoCartao = function() {
		$scope.data.datas.statusDataInicialMovimentoCartao = !$scope.data.datas.statusDataInicialMovimentoCartao;
	};

	$scope.toggleDataFinalMovimentoCartao = function() {
		$scope.data.datas.statusDataFinalMovimentoCartao = !$scope.data.datas.statusDataInicialMovimentoCartao;
	};
	
	/* Exibir / Ocultar Datepickers Extrato*/
	$scope.toggleDataInicialMovimentoExtrato = function() {
		$scope.data.datas.statusDataInicialMovimentoExtrato = !$scope.data.datas.statusDataInicialMovimentoExtrato;
	};

	$scope.toggleDataFinalMovimentoExtrato = function() {
		$scope.data.datas.statusDataFinalMovimentoExtrato = !$scope.data.datas.statusDataFinalMovimentoExtrato;
	};

	/* Buscar os dados para conciliar */
	$scope.pesquisar = function() {

		if(!$scope.data.divMsg){
			
			$scope.shuffleForm();
			$scope.shuffleDataGrid();
			
			$window.scrollTo(0, 0);		
		}

		if ( $scope.data.formMovimentoCartao.numeroBanco != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDoBanco = $scope.encontrarNomeBanco($scope.data.formMovimentoCartao.numeroBanco);
		}

		if ( $scope.data.formMovimentoCartao.codigoOperadora != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDaOperadora = $scope.encontrarNomeOperadora($scope.data.formMovimentoCartao.codigoOperadora);
		}

		if ( $scope.data.formMovimentoCartao.valorInicial != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.valorInicial = $scope.data.formMovimentoCartao.valorInicial;
		}

		if ( $scope.data.formMovimentoCartao.valorFinal != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.valorFinal = $scope.data.formMovimentoCartao.valorFinal;
		}

		if ( $scope.data.formMovimentoCartao.dataInicial != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.dataInicial = $scope.data.formMovimentoCartao.dataInicial;
		}

		if ( $scope.data.formMovimentoCartao.dataFinal != undefined ) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.dataFinal = $scope.data.formMovimentoCartao.dataFinal;
		}		
		
		filtro = new Object();

		filtro.numeroBanco	 		= $scope.data.formMovimentoCartao.numeroBanco;
		filtro.numeroAgencia 		= $scope.data.formMovimentoCartao.numeroAgencia;
		filtro.numeroConta 	 		= $scope.data.formMovimentoCartao.numeroConta;
		filtro.codigoOperadora 		= $scope.data.formMovimentoCartao.codigoOperadora;
		filtro.valorInicial			= $scope.data.formMovimentoCartao.valorInicial;
		filtro.valorFinal			= $scope.data.formMovimentoCartao.valorFinal;
		filtro.dataInicial			= moment($scope.data.formMovimentoCartao.dataInicial, "DD/MM/YYYY").format("YYYYMMDD");
		filtro.dataFinal			= moment($scope.data.formMovimentoCartao.dataFinal, "DD/MM/YYYY").format("YYYYMMDD");
		filtro.empId				= $scope.empId;


		conciliacaoCartaoDetalheService.filtrarDetalheRegistroNaoConciliadosCartao(angular.copy(filtro)).then(
			function(result){
				$scope.data.gridMovimentoCartao.dados = result.data;
				$scope.data.gridMovimentoCartao.qtdeTotalDeItens = result.data.length;
			}
		);


		if ( $scope.data.formMovimentoExtrato.numeroBanco != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDoBanco = $scope.encontrarNomeBanco($scope.data.formMovimentoExtrato.numeroBanco);
		}

		if ( $scope.data.formMovimentoExtrato.codigoOperadora != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDaOperadora = $scope.encontrarNomeOperadora($scope.data.formMovimentoExtrato.codigoOperadora);
		}

		if ( $scope.data.formMovimentoExtrato.valorInicial != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.valorInicial = $scope.data.formMovimentoExtrato.valorInicial;
		}

		if ( $scope.data.formMovimentoExtrato.valorFinal != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.valorFinal = $scope.data.formMovimentoExtrato.valorFinal;
		}

		if ( $scope.data.formMovimentoExtrato.dataInicial != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.dataInicial = $scope.data.formMovimentoExtrato.dataInicial;
		}

		if ( $scope.data.formMovimentoExtrato.dataFinal != undefined ) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.dataFinal = $scope.data.formMovimentoExtrato.dataFinal;
		}

		
		filtro.numeroBanco	 		= $scope.data.formMovimentoExtrato.numeroBanco;
		filtro.numeroAgencia 		= $scope.data.formMovimentoExtrato.numeroAgencia;
		filtro.numeroConta 	 		= $scope.data.formMovimentoExtrato.numeroConta;
		filtro.codigoOperadora 		= $scope.data.formMovimentoExtrato.codigoOperadora;
		filtro.valorInicial			= $scope.data.formMovimentoExtrato.valorInicial;
		filtro.valorFinal			= $scope.data.formMovimentoExtrato.valorFinal;
		filtro.dataInicial			= moment($scope.data.formMovimentoExtrato.dataInicial, "DD/MM/YYYY").format("YYYYMMDD");
		filtro.dataFinal			= moment($scope.data.formMovimentoExtrato.dataFinal, "DD/MM/YYYY").format("YYYYMMDD");
		filtro.empId				= $scope.empId;

		conciliacaoCartaoDetalheService.filtrarDetalheRegistroNaoConciliadosExtrato(filtro).then(
			function(result){
				$scope.data.gridMovimentoExtrato.dados = result.data;
				$scope.data.gridMovimentoExtrato.qtdeTotalDeItens = result.data.length;
			}
		);
		
		if($scope.data.divMsg){
			$scope.atualizarSomaItens();
		}		
	};
	
	/* Voltar para a tela de formulário */
	$scope.voltar = function() {
		$scope.limparDadosConsulta();
		$scope.shuffleForm();
		$scope.shuffleDataGrid();
		$window.scrollTo(0, 0);
	};

	$scope.invalidarFormulario = function() {
		var invalidar = true;
		if ( $scope.data.formMovimentoCartao.dataInicialTela != undefined && $scope.data.formMovimentoCartao.dataFimTela != undefined ) {
			invalidar = false;
		}
		return invalidar;
	};

	$scope.limparDadosConsulta = function() {

		/* Dados de consulta */
		$scope.data.gridMovimentoCartao.dados = [];
		$scope.data.gridMovimentoExtrato.dados = [];

		/* Formulários */
		$scope.data.formMovimentoCartao = {};
		$scope.data.formMovimentoExtrato = {};

		/* Resumo da Pesquisa */
		$scope.data.gridMovimentoCartao.resumoPesquisa = {};
		$scope.data.gridMovimentoExtrato.resumoPesquisa = {};

		/* Totalizadores */
		$scope.data.gridMovimentoCartao.resumoPesquisa.totalConsulta = 0;
		$scope.data.gridMovimentoCartao.resumoPesquisa.totalSelecionado = 0;
		$scope.data.gridMovimentoCartao.resumoPesquisa.qtdLinhasSelecionadas = 0;
		$scope.data.gridMovimentoExtrato.resumoPesquisa.totalConsulta = 0;
		$scope.data.gridMovimentoExtrato.resumoPesquisa.totalSelecionado = 0;
		$scope.data.gridMovimentoExtrato.resumoPesquisa.qtdLinhasSelecionadas = 0;

		/* Diferença entre os valores: Cartao e Extrato */
		$scope.data.diferencaMovimentoCartaoExtrato = 0;

	};

	$scope.verificarDadosConciliacao = function() {
		
		var mostrarMensagem = true;
    $scope.data.statusMensagem = '';
    
		if (mostrarMensagem) {
			$scope.data.divConfirma = true;				
		} else {			
			$scope.conciliar();
		}
	}
	
	/* Conciliar os dados */
	$scope.conciliar = function() {

		$scope.data.statusMensagem = '';

		conciliacaoModel = { listaMovExtrato:[], listaMovCartao:[] };
				
		conciliacaoModel.valorTotalConciliacao = parseFloat($scope.data.diferencaMovimentoCartaoExtrato.toFixed(2));		
		
		conciliacaoModel.descDetalheOperacao 	 = $scope.data.formConciliar.descDetalheOperacao;

		
		angular.forEach($scope.data.dataGridMovimentoCartao, function(row){
			delete row.isSelected;
			conciliacaoModel.listaMovCartao.push(angular.copy(row))
		});


		angular.forEach($scope.data.dataGridMovimentoExtrato, function(row){
			delete row.isSelected;
			conciliacaoModel.listaMovExtrato.push(angular.copy(row))
		});
		
		novaConciliacaoService.getConciliar(conciliacaoModel).then(function successCallback(result){			
			$scope.data.divConfirma = false;
			$scope.data.divMsg = true;
			$scope.data.statusMensagem = result.data.mensagem;			
		}, function errorCallback(result) {
			$scope.showErrorMessage(result.data.mensagem);
		});

	};
	
	$scope.fecharDivMensagem = function(){
		$scope.data.divMsg = false;
		$scope.data.divConfirma = false;
		$scope.data.statusMensagem = "";		
	}
	
	$scope.atualizarSomaItens = function(){
		
		$scope.data.divMsg = false;
		$scope.data.divConfirma = false;
		$scope.data.statusMensagem = "";
		$scope.data.formConciliar.descDetalheOperacao = "";
		$scope.data.gridMovimentoCartao.resumoPesquisa.totalSelecionado = 0;
		$scope.data.gridMovimentoCartao.resumoPesquisa.qtdLinhasSelecionadas = 0;
		$scope.data.gridMovimentoExtrato.resumoPesquisa.totalSelecionado = 0;
		$scope.data.gridMovimentoExtrato.resumoPesquisa.qtdLinhasSelecionadas = 0;
		$scope.data.diferencaMovimentoCartaoExtrato = 0;
		$scope.data.dataGridMovimentoCartao = [];
		$scope.data.dataGridMovimentoExtrato = [];
	}

	/* Shuffle Áreas */
	$scope.shuffleForm = function() {
		$scope.data.showForm=!$scope.data.showForm;
	};

	$scope.shuffleDataGrid = function() {
		$scope.data.showDataGrid=!$scope.data.showDataGrid;
	};

	$scope.encontrarNomeBanco = function(numeroBanco) {
		return numeroBanco;
	};

	$scope.encontrarNomeOperadora = function(codigoOperadora) {
		if (codigoOperadora == "") {
			return "Todas";
		} else {
			var result = $filter('filter')($scope.data.listaOperadoras,{"codOperadora":codigoOperadora});
			
			if (result.length == 1)
				return result[0].nomeOperadora;
			else
				return 'Operadora nao localizada'
		}
	};

	/* Carregar dados dos dropdownlists */
	$scope.loadBancosAtivos = function() {
    $scope.data.listaBancos = [];
	  var empId = $scope.empId;
		valoresComboService.getDomiciliosBancariosAtivos(empId).then(
      function(result){
        $scope.data.listaBancos = result.data;
      }
		);
	};

	$scope.loadOperadoras = function() {
		valoresComboService.getAdquirentes().then(
			function(result){
				$scope.data.listaOperadoras = result.data;
			}
		);
	};

	$scope.loadModalidades = function() {
		valoresComboService.getModalidades().then(
			function(result) {
				$scope.data.listaModalidades = result.data;
			}
		);
	};

	$scope.loadMotivos = function(){
    var empId = $scope.empId;
    $scope.data.listaMotivos = [];
		valoresComboService.getMotivo(empId).then(
			function(result){
				$scope.data.listaMotivos = result.data;
			}
		);
	};	

	/* Inicialização de conteúdos */
	$scope.init = function() {
    $scope.buscarEmpresa();
  };

	$scope.init();


	$scope.selecionarLinhaGridMovimentoCartao = function(row) {
		row.isSelected = !row.isSelected;

		if (row.isSelected) {
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDoBanco = row.numeroBanco;
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDaOperadora = row.codOperadora;
			$scope.data.gridMovimentoCartao.resumoPesquisa.numeroDaAgencia = row.numeroAgencia;
			$scope.data.gridMovimentoCartao.resumoPesquisa.numeroDaConta = row.numeroConta;
			$scope.data.gridMovimentoCartao.resumoPesquisa.dataDoPagamento = row.dataExtrPagamento;
			$scope.data.gridMovimentoCartao.resumoPesquisa.totalSelecionado += Number(row.valor);
			$scope.data.diferencaMovimentoCartaoExtrato += Number(row.valor);
			$scope.data.gridMovimentoCartao.resumoPesquisa.qtdLinhasSelecionadas++;
			$scope.data.dataGridMovimentoCartao.push(angular.copy(row));
		}else{
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDoBanco = undefined;
			$scope.data.gridMovimentoCartao.resumoPesquisa.nomeDaOperadora = undefined;
			$scope.data.gridMovimentoCartao.resumoPesquisa.numeroDaAgencia = undefined;
			$scope.data.gridMovimentoCartao.resumoPesquisa.numeroDaConta = undefined;
			$scope.data.gridMovimentoCartao.resumoPesquisa.dataDoPagamento = undefined;
			$scope.data.gridMovimentoCartao.resumoPesquisa.totalSelecionado -= Number(row.valor);
			$scope.data.diferencaMovimentoCartaoExtrato -= Number(row.valor);
			$scope.data.gridMovimentoCartao.resumoPesquisa.qtdLinhasSelecionadas--;
			$scope.data.dataGridMovimentoCartao = $scope.removeItemListaMovCartaoExtrato(row.id,$scope.data.dataGridMovimentoCartao);
		 }
	};

	$scope.selecionarLinhaGridMovimentoExtrato = function(row) {
		row.isSelected = !row.isSelected;

		if (row.isSelected) {
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDoBanco = row.numeroBanco;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDaOperadora = row.codOperadora;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.numeroDaAgencia = row.numeroAgencia;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.numeroDaConta = row.numeroConta;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.dataDoPagamento = row.dataExtrPagamento;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.totalSelecionado += Number(row.valor);
			$scope.data.diferencaMovimentoCartaoExtrato -= Number(row.valor);
			$scope.data.gridMovimentoExtrato.resumoPesquisa.qtdLinhasSelecionadas++;
			$scope.data.dataGridMovimentoExtrato.push(angular.copy(row));
		}else{
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDoBanco = undefined;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.nomeDaOperadora = undefined;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.numeroDaAgencia = undefined;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.numeroDaConta = undefined;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.dataDoPagamento = undefined;
			$scope.data.gridMovimentoExtrato.resumoPesquisa.totalSelecionado -= Number(row.valor);
			$scope.data.diferencaMovimentoCartaoExtrato += Number(row.valor);
			$scope.data.gridMovimentoExtrato.resumoPesquisa.qtdLinhasSelecionadas--;
			$scope.data.dataGridMovimentoExtrato = $scope.removeItemListaMovCartaoExtrato(row.id,$scope.data.dataGridMovimentoExtrato);
		}
	};

	$scope.removeItemListaMovCartaoExtrato = function(itemParam, listaMov){
		
		var itemArray = null;

		var novoItemArray = [];

		for(var i = 0; i < listaMov.length; i++){
			itemArray = listaMov[i];
			if(itemArray != undefined && itemParam != itemArray.id){
				novoItemArray.push(angular.copy(listaMov[i]));
			}
		}
		return novoItemArray;
	};


	$scope.$watch('data.gridMovimentoCartao.itensPorPagina',function(newValue,oldValue){

		if ( newValue && ($scope.data.gridMovimentoExtrato.itensPorPagina!=newValue) ) {
			$scope.data.gridMovimentoExtrato.itensPorPagina=newValue;
		}
	});

	$scope.$watch('data.gridMovimentoExtrato.itensPorPagina',function(newValue,oldValue){

		if ( newValue && ($scope.data.gridMovimentoCartao.itensPorPagina!=newValue) ) {
			$scope.data.gridMovimentoCartao.itensPorPagina=newValue;
		}
	});

	$scope.$watch('data.gridMovimentoCartao.dados', function(newValue,oldValue){
		if ( $scope.data.gridMovimentoCartao.dados !== undefined ) {
			var total = 0;
			angular.forEach(newValue, function(value,key){
				total += Number(value.valor);
			});
			$scope.data.gridMovimentoCartao.resumoPesquisa.totalConsulta = total;			
		}
	});

	$scope.$watch('data.gridMovimentoExtrato.dados', function(newValue,oldValue){
		if( newValue !== undefined ) {
			var total = 0;
			angular.forEach(newValue, function(value,key){
				total += Number(value.valor);
			});
			$scope.data.gridMovimentoExtrato.resumoPesquisa.totalConsulta = total;
		}
	});

	/* Replicação de Dados - Seleção do botão */
	$scope.$watch('data.replicacaoDeFormulario', function(newValue,oldValue){
		if ( newValue ) {
			$scope.data.formMovimentoExtrato.numeroBanco = $scope.data.formMovimentoCartao.numeroBanco;
			$scope.data.formMovimentoExtrato.numeroAgencia = $scope.data.formMovimentoCartao.numeroAgencia;
			$scope.data.formMovimentoExtrato.numeroConta = $scope.data.formMovimentoCartao.numeroConta;
			$scope.data.formMovimentoExtrato.codigoOperadora = $scope.data.formMovimentoCartao.codigoOperadora;
			$scope.data.formMovimentoExtrato.valorInicial = $scope.data.formMovimentoCartao.valorInicial;
			$scope.data.formMovimentoExtrato.valorFinal = $scope.data.formMovimentoCartao.valorFinal;			
			$scope.data.formMovimentoExtrato.dataInicial = $scope.data.formMovimentoCartao.dataInicial;
			$scope.data.formMovimentoExtrato.dataFinal = $scope.data.formMovimentoCartao.dataFinal;
		}
	});

	/* Replicação de Dados - Banco */
	$scope.$watch('data.formMovimentoCartao.numeroBanco', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.numeroBanco = $scope.data.formMovimentoCartao.numeroBanco;
		}
	});

	/* Replicação de Dados - Agencia */
	$scope.$watch('data.formMovimentoCartao.numeroAgencia', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.numeroAgencia = $scope.data.formMovimentoCartao.numeroAgencia;
		}
	});

	/* Replicação de Dados - Conta */
	$scope.$watch('data.formMovimentoCartao.numeroConta', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.numeroConta = $scope.data.formMovimentoCartao.numeroConta;
		}
	});

	/* Replicação de Dados - Operadora */
	$scope.$watch('data.formMovimentoCartao.codigoOperadora', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.codigoOperadora = $scope.data.formMovimentoCartao.codigoOperadora;
		}
	});

	/* Replicação de Dados - Valor Inicial */
	$scope.$watch('data.formMovimentoCartao.valorInicial', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.valorInicial = $scope.data.formMovimentoCartao.valorInicial;
		}
	});

	/* Replicação de Dados - Valor Final */
	$scope.$watch('data.formMovimentoCartao.valorFinal', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.valorFinal = $scope.data.formMovimentoCartao.valorFinal;
		}
	});

	/* Replicação de Dados - Data Inicial */
	$scope.$watch('data.formMovimentoCartao.dataInicial', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.dataInicial = $scope.data.formMovimentoCartao.dataInicial;
		}
	});

	/* Replicação de Dados - Data Final */
	$scope.$watch('data.formMovimentoCartao.dataFinal', function(newValue,oldValue){
		if ( $scope.data.replicacaoDeFormulario ) {
			$scope.data.formMovimentoExtrato.dataFinal = $scope.data.formMovimentoCartao.dataFinal;
		}
	});	
	
	$scope.toggleDataArquivoConciliacao = function() {
		$scope.data.datas.statusDataArquivoConciliacao = !$scope.data.datas.statusDataArquivoConciliacao;
	};

  $scope.$watch('empresa', function(novoCnpjSelecionado, antigoCnpjSelecionado){
    if(novoCnpjSelecionado !== antigoCnpjSelecionado){
      var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);

      $scope.empId = empresaCa.idEmpresaCa;
      $scope.nomeEmpresa = empresaCa.razaoSocial;
      $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
      $scope.loadBancosAtivos();
      $scope.loadOperadoras();
      $scope.loadMotivos();
    }
  });

  /**
	 * Exibe e oculta a mensagem simulando um toastr.
	 * 
	 * @param {String} mensagem
	 * @param {String} tipoMensagem Se null o 'alert-danger' serah adotado.
	 */
	function showAppToastr(mensagem, tipoMensagem) {
		$scope.isExibirMensagemErro = true;
		$scope.mensagemErro = mensagem;
		$scope.tipoMensagem = tipoMensagem || 'alert-danger';

		$timeout(function() {
			$scope.isExibirMensagemErro = false;
		}, 3000);
	}

});