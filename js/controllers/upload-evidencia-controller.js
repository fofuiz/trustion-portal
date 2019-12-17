angular.module('trustionPortal').controller('UploadEvidenciaController', 
	function($scope, $uibModalInstance, $http, ocorrencia, AtividadeService, EnvironmentService, UTF8) {

		$scope.atividade = {};
		$scope.atividade.idOcorrencia = ocorrencia.idOcorrencia;
		$scope.atividade.tipoAtividade = 'A';
		$scope.atividade.atividade = 'Upload de Evid\u00EAncia.';
		$scope.atividade.idTipoOcorrencia = ocorrencia.idTipoStatusOcorrencia;
		$scope.selectedUploadFile;


		$scope.uploadFile = function() {

			console.info('--> UploadEvidenciaController.uploadFile');
			
			if($scope.selectedUploadFile == undefined || $scope.selectedUploadFile == '') {
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = 'Favor, selecione um arquivo para enviar.';

				return;
			}

			var partes = $scope.selectedUploadFile.name.split(".");
        
			if(partes.length == 0 || partes[partes.length-1] !== "pdf"){
				console.log("extensao: " + partes[partes.length-1]);
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = 'Favor, selecionar arquivo somente no formato PDF';
				return;
			}

			AtividadeService.criar($scope.atividade).then(
				function successCallback(res) {

					var formData = new FormData();
					formData.append('file', $scope.selectedUploadFile);

			        $http.post(EnvironmentService.getEnvironment() + 'upload/atividade/' + res.data.idAtividade, formData, {
			            transformRequest: angular.identity,
			            headers: {'Content-Type': undefined}
			        }).then(function successCallback(res){
						$uibModalInstance.close();
					}, function errorCallback(res){
						if(res.data != null && res.data.hasOwnProperty('mensagem')){
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = res.data.mensagem;
						}else{
							$scope.isExibirMensagemErro = true;
							$scope.mensagemErro = UTF8.Nao + ' foi ' + UT8.possivel + ' criar a atividade ligada ao upload do arquivo. Favor, entrar em contato com o administrador do sistema.';
						}
					});
			        console.info('<-- UploadEvidenciaController.uploadFile');

				}, function errorCallback(res) {
					if(res.data != null && res.data.hasOwnProperty('mensagem')){
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = res.data.mensagem;
					}else{
						$scope.isExibirMensagemErro = true;
						$scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' criar a atividade ligada ao upload do arquivo. Favor, entrar em contato com o administrador do sistema.';
					}
				}
			);
		}

		$scope.cancelar = function() {
			$uibModalInstance.dismiss();
		}
	}
);