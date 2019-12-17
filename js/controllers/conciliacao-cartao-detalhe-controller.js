angular.module('trustionPortal').controller('ConciliacaoCartaoDetalheController',
	function ($scope, $filter, valoresComboService, TrustionHelpers, conciliacaoCartaoDetalheService, UsuarioService, $stateParams, $timeout) {

	$scope.data = {
		datas: {
			statusDataInicial: false,
			statusDataFinal: false
		},
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
	
	$scope.comboBancos = [];
	$scope.comboOperadoras = [];
	$scope.comboMovimentos = [
		{codigoMovimento:'', descricaoMovimento:'Todos'},
		{codigoMovimento:'1', descricaoMovimento:'Extrato'},
		{codigoMovimento:'2', descricaoMovimento:'Cartoes'}
	];
	
	$scope.comboStatus =  [
		{statusConciliacao:'', descricaoStatus:'Todos'},
		{statusConciliacao:'S', descricaoStatus:'Conciliado'},
		{statusConciliacao:'N', descricaoStatus:'Pendente'}
	];
	
	
	$scope.registros = [];
	$scope.registrosDetalhesExtrato = [];
	$scope.registrosDetalhesCartao = [];
	$scope.loading = false;

	$scope.loadComboBanco = function(){
    var empId = $scope.empId;
    $scope.comboBancos = [];
		valoresComboService.getDomiciliosBancariosAtivos(empId).then(
			function(result){
				$scope.comboBancos = result.data;
			}
		);
	};

	$scope.loadComboAdquirente = function(){
		valoresComboService.getAdquirentes().then(
			function(result){
				$scope.comboOperadoras = result.data;
			}
		);
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



	$scope.pesquisarRegistros = function(){
		
		if ($scope.dataExtratoPagamentoReferencia == undefined || $scope.dataExtratoPagamentoReferencia.length == 0) {
			if ($scope.dataFinal == undefined || $scope.dataFinal == undefined) {
				return;
			} else {
				if ($scope.dataInicial.length == 0 || $scope.dataFinal.length == 0) {
					return;			
				}
			}
		}
		
		filtro = new Object();

		filtro.numeroBanco	 		= $scope.numeroBanco;
		filtro.numeroAgencia 		= $scope.numeroAgencia;
		filtro.numeroConta 	 		= $scope.numeroConta;
		filtro.codigoOperadora 		= $scope.codigoOperadora;
		filtro.codigoMovimento 		= $scope.codigoMovimento;
		filtro.statusConciliado		= $scope.statusConciliacao;
		filtro.nomeArquivo 			= $scope.nomeArquivo;
		filtro.valorInicial			= $scope.valorInicial;
		filtro.valorFinal			= $scope.valorFinal;
		filtro.empId				= $scope.empId;
		
		if ($scope.dataExtratoPagamentoReferencia.length > 0) {
			filtro.dataInicial			= $scope.dataExtratoPagamentoReferencia + '01';
			filtro.dataFinal 			= $scope.dataExtratoPagamentoReferencia + '31';
		} else {
			filtro.dataInicial			= moment($scope.dataInicial, 'DD/MM/YYYY').format("YYYYMMDD")
			filtro.dataFinal 			= moment($scope.dataFinal, 'DD/MM/YYYY').format("YYYYMMDD")
		}
		
		$scope.dataExtratoPagamentoReferencia = '';
		
		$scope.loading = conciliacaoCartaoDetalheService.filtrarDadosConciliacaoDetalheCartao(filtro).then(function(result) {				
			$scope.registros = result.data;
			$scope.loading = false;
			$scope.id = "";
		} , function ( result ) {
			$scope.loading = false;
		});
	};

	$scope.obterDetalhe = function(id, nroGrupoConciliado, codigoMovimento) {
		filtro = new Object();
		filtro1 = new Object();

		if (codigoMovimento == '1') { // Extrato
        			filtro.id = id;
        			filtro.nroGrupoConciliado = nroGrupoConciliado;
        			filtro.empId = $scope.empId;

        			conciliacaoCartaoDetalheService.obterDetalheExtrato(filtro).then(function(result) {
        					$scope.registrosDetalhesExtrato = result.data;

                            filtro1.id = id;
                            filtro1.nroGrupoConciliado = nroGrupoConciliado;
                            filtro1.empId = $scope.empId;

                            conciliacaoCartaoDetalheService.obterDetalheCartao(filtro1).then(function(result) {
                                    $scope.registrosDetalhesCartao = result.data;
                                    $('#myModal').modal('show');
                                } , function ( result ) {
                            })

        				} , function ( result ) {
        			});
        		} else { // Cartao
        			filtro.id = id;
        			filtro.nroGrupoConciliado = nroGrupoConciliado;
        			filtro.empId = $scope.empId;

        			conciliacaoCartaoDetalheService.obterDetalheExtrato(filtro).then(function(result) {
        					$scope.registrosDetalhesExtrato = result.data;

                            filtro1.id = id;
                            filtro1.nroGrupoConciliado = nroGrupoConciliado;
                            filtro1.empId = $scope.empId;

                            conciliacaoCartaoDetalheService.obterDetalheCartao(filtro1).then(function(result) {
                                    $scope.registrosDetalhesCartao = result.data;
                                    $('#myModal').modal('show');
                                } , function ( result ) {
                            })
        				} , function ( result ) {
        			});
        		}
        	}

	$scope.$watch('comboMovimentos',function(newValue, oldValue){
		if (newValue.length > 0) {
			$scope.codigoMovimento = $scope.comboMovimentos[0].codigoMovimento;
		}
	});

	/* Exibir / Ocultar Datepickers */
	$scope.toggleDataInicial = function() {
		$scope.data.datas.statusDataInicial = !$scope.data.datas.statusDataInicial;
	};

	$scope.toggleDataFinal = function() {
		$scope.data.datas.statusDataFinal = !$scope.data.datas.statusDataFinal;
	};

	$scope.init = function() {

		loadData = false;

		if ($stateParams.origemRequisicao != "cartaoResumo") {
                $stateParams.numBanco = "";
                $stateParams.numAg = "";
                $stateParams.numConta = "";
                $stateParams.codOperadora = "";
                $stateParams.dataExtratoPagamentoReferencia = "";
		} else {
			loadData = true;
		}

		$stateParams.origemRequisicao = "";
		
		$scope.numeroBanco =  $stateParams.numBanco;
		$scope.numeroAgencia = $stateParams.numAg;
		$scope.numeroConta = $stateParams.numConta;
		$scope.codigoOperadora = $stateParams.codOperadora;
		$scope.dataExtratoPagamentoReferencia = $stateParams.dataExtratoPagamentoReferencia;
		
		if ($scope.dataExtratoPagamentoReferencia.length == 7) {
			$scope.dataExtratoPagamentoReferencia = $scope.dataExtratoPagamentoReferencia.substring(3) + 
				$scope.dataExtratoPagamentoReferencia.substring(0, 2);
		}

    $scope.buscarEmpresa();

	};

	$scope.init();
	
	
	/* Exportação de Dados no Formato Excel */
	$scope.exportConciliacaoDetalhada = function () {

		var data = new Date();
		
		var month = eval(data.getMonth() + 1);

		if(month >=1 && month <= 9 ){
			month = "0" + month;
		}

		var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

		var strHTML = "<table>";

		strHTML += '<tr bgcolor="#747476">';
		
		strHTML += '<th><font color="#FFFFFF">Movimento</th>';
		strHTML += '<th><font color="#FFFFFF">Grupo Concilia&ccedil;&atilde;o</th>';
		strHTML += '<th><font color="#FFFFFF">Banco</th>';
		strHTML += '<th><font color="#FFFFFF">Ag&ecirc;ncia</th>';
		strHTML += '<th><font color="#FFFFFF">Conta</th>';
		strHTML += '<th><font color="#FFFFFF">Data de Lan&ccedilamento</th>';
		strHTML += '<th><font color="#FFFFFF">Valor</th>';		
		strHTML += '<th><font color="#FFFFFF">Adquirente</th>';
		strHTML += '<th><font color="#FFFFFF">Produto</th>';
		strHTML += '<th><font color="#FFFFFF">Tipo Concilia&ccedil;&atilde;o</th>';
		strHTML += '<th><font color="#FFFFFF">Status</th>';
		strHTML += '<th><font color="#FFFFFF">Descri&ccedil;&atilde;o Hist&oacuterico</th>';
		strHTML += '<th><font color="#FFFFFF">Descri&ccedil;&atilde;o Documento</th>';
		strHTML += '<th><font color="#FFFFFF">Arquivo</th>';	

		strHTML += "</tr>";
		
		angular.forEach($scope.registros, function(value, key) {

			strHTML += '<tr>';
	
		    strHTML += '<td>' + value.descricaoMovimento + '</td>';
		    strHTML += '<td>' + value.nroGrupoConciliado + '</td>';
		    strHTML += '<td>' + value.numeroBanco + '</td>';
		    strHTML += '<td>' + value.numeroAgencia + '</td>';
		    strHTML += '<td>' + value.numeroConta + '</td>';
		    strHTML += '<td>' + $filter('date')(value.dataExtrPagamento,'dd/MM/yyyy')  + '</td>';
		    strHTML += '<td>' + $filter('currency')(value.valor,"R$ ",2)  + '</td>';
		    strHTML += '<td>' + value.nomeOperadora + '</td>';
		    strHTML += '<td>' + value.nomeProduto + '</td>';
		    
			if(value.tipo != null){
				strHTML += '<td>' +  value.tipo + '</td>';	
			}else{
				strHTML += '<td>' + '</td>';
			}
			
		    strHTML += '<td>' + value.status + '</td>';
		    
			if(value.dscExtrHistorico != null){
				strHTML += '<td>' +  value.dscExtrHistorico + '</td>';	
			}else{
				strHTML += '<td>' + '</td>';
			}
			
			if(value.dscExtrDocumento != null){
				strHTML += '<td>' +  value.dscExtrDocumento + '</td>';	
			}else{
				strHTML += '<td>' + '</td>';
			}
			
			if(value.nomeArquivoOrigem != null){
				strHTML += '<td>' +  value.nomeArquivoOrigem + '</td>';	
			}else{
				strHTML += '<td>' + '</td>';
			}

		});

		strHTML += "</table>";

		var blob = new Blob([strHTML], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
		});

		saveAs(blob, "ASConciliacao_ConciliacaoDetalhada_" + stringData + ".xls");

  };
  
  $scope.$watch('empresa', function(novoCnpjSelecionado, antigoCnpjSelecionado){
    if(novoCnpjSelecionado !== antigoCnpjSelecionado){
      var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);

      $scope.empId = empresaCa.idEmpresaCa;
      $scope.nomeEmpresa = empresaCa.razaoSocial;
      $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
      $scope.loadComboBanco();
      $scope.loadComboAdquirente();
      if (loadData)
        $scope.pesquisarRegistros();
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
		$scope.appToastr = true;

		$timeout(function() {
			$scope.appToastr = false;
			$scope.isExibirMensagemErro = false;
		}, 3000);
	}

});