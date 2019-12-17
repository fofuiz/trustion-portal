angular.module('trustionPortal').controller('regraClienteAdquirenteCtrl',
	function ($scope, TrustionHelpers ,valoresComboService, regraClienteAdquirenteService, UsuarioService, $timeout) {
		
	$scope.comboBancos = [];
	$scope.comboOperadoras = [];
	$scope.listaRegraClienteAdquirente = [];
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
    $scope.comboOperadoras = [];
		valoresComboService.getAdquirentes().then(
			function(result){
				$scope.comboOperadoras = result.data;
			}
		);
	};
	
	$scope.loadRegraClienteAdquirente = function() {		
		$scope.loading = regraClienteAdquirenteService.getRegraClienteAdquirente().then(function(result){				
			$scope.listaRegraClienteAdquirente = result.data;
			$scope.loading = false;
		},function ( result ) {
			$scope.loading = false;
		});
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

	
	$scope.pesquisarRegraClienteAdquirente = function(){
		regraClienteAdquirenteModel = {};
		regraClienteAdquirenteModel.empId = $scope.empId;
		regraClienteAdquirenteModel.codigoBancoStr = $scope.numeroBanco;
		regraClienteAdquirenteModel.codigoAquirenteStr = $scope.codigoOperadora;

		$scope.loading = regraClienteAdquirenteService.filtrarRegraClienteAdquirente(regraClienteAdquirenteModel).then(function(result){				
			$scope.listaRegraClienteAdquirente = result.data;
			$scope.loading = false;
		},function ( result ) {
			$scope.loading = false;
		});
	};
	

	$scope.init = function() {
	    $scope.buscarEmpresa();
	};

  $scope.init();

  $scope.$watch('empresa', function(novoCnpjSelecionado, antigoCnpjSelecionado){
    if(novoCnpjSelecionado !== antigoCnpjSelecionado){
      var empresaCa = TrustionHelpers.buscaEmpresa(novoCnpjSelecionado, $scope.empresaCaList);

      $scope.empId = empresaCa.idEmpresaCa;
      $scope.nomeEmpresa = empresaCa.razaoSocial;
      $scope.cnpj = mascaraCnpj(empresaCa.cnpj);
      $scope.loadComboBanco();
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