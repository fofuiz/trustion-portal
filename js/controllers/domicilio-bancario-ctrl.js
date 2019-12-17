angular.module('trustionPortal').controller('DomicilioBancarioCtrl',
	function ($scope, TrustionHelpers, valoresComboService, domicilioBancarioService, UsuarioService, $timeout) {
		
	
	$scope.listaBancos = [];
	$scope.detalheDomicilioBancario = [];
	$scope.loading = false;
	
	
	$scope.loadComboDomicilioBancario = function(){
    $scope.listaBancos = [];
    var empId = $scope.empId;
      valoresComboService.getDomiciliosBancariosAtivos(empId).then(
        function(result){
          $scope.listaBancos = result.data;
        }
      );
	};
	
	
	$scope.loadDadosDomicilioBancario = function() {
    var empId = $scope.empId;
    $scope.detalheDomicilioBancario = [];
		$scope.loading = domicilioBancarioService.getDadosDomicilioBancario(empId).then(function(result){
			$scope.detalheDomicilioBancario = result.data;
			$scope.loading = false;
		},function ( result ) {
			$scope.loading = false;
		});
	};
	

	$scope.perquisarDetalheDomicilioBancario = function(){
	var empId = $scope.empId;
		$scope.loading = domicilioBancarioService.filtrarDadosDomicilioBancario($scope.codigoBancoStr, empId).then(function(result){
			$scope.detalheDomicilioBancario = result.data;
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
      $scope.loadComboDomicilioBancario();
      $scope.loadDadosDomicilioBancario();
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