angular.module('trustionPortal').controller('ConciliacaoCartaoResumoController',
	function ($scope, TrustionHelpers, $filter, valoresComboService, conciliacaoCartaoResumoService, UsuarioService, $timeout) {

		var dataAtual = new Date();

		$scope.data = {
			mesAtual: dataAtual.getMonth()
		};
		
		$scope.comboRefs = [];
		$scope.comboAnoRefs = [];
		$scope.comboBancos = [];
		$scope.comboOperadoras = [];
		$scope.registros = [];
		$scope.loading = false;

		$scope.buscarEmpresa = function(){
      UsuarioService.buscarEmpresa().then(
        function(result){
          if(result.data.length > 0){
            $scope.empresaCaList = result.data;
          }
          else{
            showAppToastr("Empresa(s) não tem dados de cartão.");
          }
        }, function (result) {
          console.log('Error:'+result);
        }
      );
    };

        function mascaraCnpj(valor) {
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
        }


		
		$scope.pesquisarRegistros = function(){
	
			filtro = new Object();
	
			filtro.numeroBanco		= $scope.numeroBanco;
			filtro.anoMesRefStr		= $scope.anoMesRefStr;
			filtro.anoRef			= $scope.anoRef;		
			filtro.numeroAgencia 	= $scope.numeroAgencia;
			filtro.numeroConta 		= $scope.numeroConta;
			filtro.codigoOperadora 	= $scope.codigoOperadora;
			filtro.empId			= $scope.empId;
			
			$scope.loading = conciliacaoCartaoResumoService.filtrarDadosConciliacaoResumoCartao(filtro).then(function(result) {				
				$scope.registros = result.data;
				$scope.loading = false;
			} , function ( result ) {
				$scope.loading = false;
			});
		};

	
		$scope.loadComboBanco = function(){
    $scope.comboBancos = [];
		var empId = $scope.empId;
			valoresComboService.getDomiciliosBancariosAtivos(empId).then(
				function(result){
					$scope.comboBancos = result.data;
				}
			);
		};
	
		$scope.loadComboMesReferencia = function(){
			valoresComboService.getMesReferencias().then(
				function(result){
					$scope.comboRefs = result.data;
				}
			);
		};
	
		$scope.loadComboAnoReferencia = function(){
			valoresComboService.getAnosReferencias().then(
				function(result){
					$scope.comboAnoRefs = result.data;
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
		

		$scope.$watch('comboRefs',function(newValue, oldValue){
			if (newValue.length > 0) {
				$scope.anoMesRefStr = $scope.comboRefs[$scope.data.mesAtual].codigoMes;
			}
		});
	

		$scope.$watch('comboAnoRefs',function(newValue, oldValue){
			if (newValue.length > 0) {
				$scope.anoRef = $scope.comboAnoRefs[0];
			}
		});
	

		
		$scope.init = function() {
		 $scope.buscarEmpresa();
		};
	
		$scope.init();
		
		/* Exportação de Dados no Formato Excel */
		$scope.exportConciliacaoResumo = function () {
	
			var data = new Date();
			
			var month = eval(data.getMonth() + 1);
	
			if(month >=1 && month <= 9 ){
				month = "0" + month;
			}
	
			var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();
	
			var strHTML = "<table>";
	
			strHTML += '<tr bgcolor="#747476">';
			
			strHTML += '<th><font color="#FFFFFF">Refer&ecirc;ncia</th>';
			strHTML += '<th><font color="#FFFFFF">Banco</th>';
			strHTML += '<th><font color="#FFFFFF">Ag&ecirc;ncia</th>';
			strHTML += '<th><font color="#FFFFFF">Conta</th>';
			strHTML += '<th><font color="#FFFFFF">Adquirente</th>';
			strHTML += '<th><font color="#FFFFFF">R$ Cart&otilde;es</th>';
			strHTML += '<th><font color="#FFFFFF">R$ Extrato</th>';		
			strHTML += '<th><font color="#FFFFFF">R$ Conc. Cart&otilde;es</th>';
			strHTML += '<th><font color="#FFFFFF">R$ Conc. Extrato</th>';
			strHTML += '<th><font color="#FFFFFF">R$ N&atilde;o Conc. Cart&otilde;es</th>';
			strHTML += '<th><font color="#FFFFFF">R$ N&atilde;o Conc. Extrato</th>';	
			strHTML += '<th><font color="#FFFFFF">% Conc. Cart&otilde;es</th>';
			strHTML += '<th><font color="#FFFFFF">% Conc. Extrato</th>';
			strHTML += '<th><font color="#FFFFFF">% N&atilde;o Conc. Cart&otilde;es</th>';
			strHTML += '<th><font color="#FFFFFF">% N&atilde;o Conc. Extrato</th>';
	
			strHTML += "</tr>";
			
			angular.forEach($scope.registros, function(value, key) {
	
				strHTML += '<tr>';
				
				strHTML += '<td>' + $filter('date')(value.dataExtrPagamentoReferencia,'MM/yyyy')  + '</td>';
				strHTML += '<td>' + value.numeroBanco + '</td>';
				strHTML += '<td>' + value.numeroAgencia + '</td>';
				strHTML += '<td>' + value.numeroConta + '</td>';
				strHTML += '<td>' + value.nomeOperadora + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorPagamentoTotal,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorExtratoTotal,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorPagamentoConciliado,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorExtratoConciliado,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorPagamentoNaoConciliado,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.valorExtratoNaoConciliado,"R$ ",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.porcentagemPagamentoConciliada,"",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.porcentagemExtratoConciliada,"",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.porcentagemPagamentoNaoConciliada,"",2)  + '</td>';
				strHTML += '<td>' + $filter('currency')(value.porcentagemExtratoNaoConciliada,"",2)  + '</td>';
			
			});
	
			strHTML += "</table>";
	
			var blob = new Blob([strHTML], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
			});
	
			saveAs(blob, "ASConciliacao_ConciliacaoResumo_" + stringData + ".xls");
	
    };
    
    $scope.$watch('empresa', function(novoCnpjSelecionado, antigoCnpjSelecionado){
      if(novoCnpjSelecionado !== antigoCnpjSelecionado){
        var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);

        $scope.empId = empresaCa.idEmpresaCa;
        $scope.nomeEmpresa = empresaCa.razaoSocial;
        $scope.cnpj = mascaraCnpj(empresaCa.cnpj);

        $scope.loadComboBanco();
        $scope.loadComboMesReferencia();
        $scope.loadComboAnoReferencia();
        $scope.loadComboAdquirente();
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