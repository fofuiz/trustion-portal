angular.module('trustionPortal').controller('DetalhesGtvBananinhasController', function($scope, $filter, $uibModalInstance, relatorio, DetalhesGtvBananinhasService,UTF8) {
	$scope.relatorio = relatorio;
	$scope.listaDetalheRelatorio = [];
	$scope.listaRelatorioExport = [];
	$scope._gtv = ($scope.relatorio.gtv) ? $scope.relatorio.gtv : ($scope.relatorio.numeroGtv) ? $scope.relatorio.numeroGtv : false;
	
	configurarPaginacao();
	loadPage();
	
	function loadPage() {
		$scope.pag_paginaSelecionada = 1;				

		DetalhesGtvBananinhasService.listarNumerarioBananinhas(
			$scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina, $scope._gtv).then(
				function successCallback(res) {
				$scope.listaDetalheRelatorio = res.data.content;

				//$scope.populaPackObjeto($scope);
				$scope.pag_totalRegistros = res.data.totalElements;

			}, function errorCallback(res) {
				$scope.mensagemErro = "Nenhum registro encontrado, as cargas podem estar sendo processadas.";
				$scope.isExibirMensagemErro = true;
			}
		);
	}
	
	$scope.carregarRelatorioPorPagina = function() {

		DetalhesGtvBananinhasService.listarNumerarioBananinhas($scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina, $scope._gtv).then(

			function successCallback(retorno) {
				if(retorno.data.content == '') {
					$scope.mensagemErro = 'Nenhum registro encontrado.';
					$scope.isExibirMensagemErro = true;
				}

				$scope.listaDetalheRelatorio =  retorno.data.content;
				$scope.pag_totalRegistros = retorno.data.totalElements;

			}, function errorCallback(res) {
				$scope.mensagemErro = "Nenhum registro encontrado, as cargas podem estar sendo processadas.";
				$scope.isExibirMensagemErro = true;
			}
		);
	} 

	$scope.voltar = function() {
		$uibModalInstance.close();
	}
	
	function configurarPaginacao() {
		$scope.pag_desabilitado = false;
		$scope.pag_tamanho = 5;
		$scope.pag_registrosPorPagina = 10;
		$scope.pag_totalRegistros = 0;
		$scope.pag_paginaSelecionada = 0;
	}

	$scope.carregarRelatorioParaExportar = function (exportValid) {
		DetalhesGtvBananinhasService.listarNumerarioBananinhasExportar($scope._gtv).then(
			function successCallback(retorno) {
				if(retorno.data.content == '') {
					$scope.mensagemErro = 'Nenhum registro encontrado.';
					$scope.isExibirMensagemErro = true;
				}

				$scope.listaRelatorioExport = retorno.data;

			}, function errorCallback(res) {
				$scope.mensagemErro = "Nenhum registro encontrado, as cargas podem estar sendo processadas.";
				$scope.isExibirMensagemErro = true;
			}
		);
	}

	$scope.exportarXLS = function () {
		console.log("Exportando XLS...");
		$scope.carregarRelatorioParaExportar(true);

		var data = new Date();
		var month = eval(data.getMonth() + 1);
		
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}

		var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();

		var strHTML = "<table>";
		strHTML += montarCabecalhoXLS(strHTML);
		
		setTimeout(function() {
			for (let index = 0; index < $scope.listaRelatorioExport.length; index++) {
				
				//Valores das colunas
				var packDeclarada = validValorToVazio($scope.listaRelatorioExport[index].packDeclarada);
				var packProcessada = validValorToVazio($scope.listaRelatorioExport[index].packProcessada);
				var vlrDeclaradoSoma = validValorToVazio($scope.listaRelatorioExport[index].vlrDeclaradoSoma);
				var vlrConferidoSoma = validValorToVazio($scope.listaRelatorioExport[index].vlrConferidoSoma);
				var diferencaSoma = validValorToVazio($scope.listaRelatorioExport[index].diferencaSoma);
				var numeroPack = validValorToVazio($scope.listaRelatorioExport[index].numeroPack);
				var vlrDeclarado = validValorToVazio($scope.listaRelatorioExport[index].vlrDeclarado);
				var vlrConferido = validValorToVazio($scope.listaRelatorioExport[index].vlrConferido);
				var diferencaPorPack = validValorToVazio($scope.listaRelatorioExport[index].diferencaPorPack);
				var cedulaFalsa = validValorToVazio($scope.listaRelatorioExport[index].cedulaFalsa);

				strHTML += '<tr>';
				strHTML += '<td>' + packDeclarada + '</td>';
				strHTML += '<td>' + packProcessada + '</td>';
				strHTML += '<td>' + vlrDeclaradoSoma + '</td>';
				strHTML += '<td>' + vlrConferidoSoma + '</td>';
				strHTML += '<td>' + diferencaSoma + '</td>';
				strHTML += '<td>' + numeroPack + '</td>';
				strHTML += '<td>' + vlrDeclarado + '</td>';
				strHTML += '<td>' + vlrConferido + '</td>';
				strHTML += '<td>' + diferencaPorPack + '</td>';
				strHTML += '<td>' + cedulaFalsa + '</td>';

				strHTML += '</tr>';
			}

			strHTML += "</table>";

			var blob = new Blob([strHTML], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
			});

			saveAs(blob, "RelatorioNumerarioBananinhas_" + stringData + ".xls");
			
		}, 1000);
	}

	function montarCabecalhoXLS(strHTML){
		strHTML += '<tr bgcolor="#747476">';
		strHTML += '<th><font color="#FFFFFF">Pack Declarada</th>';
		strHTML += '<th><font color="#FFFFFF">Pack Processada</th>';
		strHTML += '<th><font color="#FFFFFF">Valor Declarado Somado</th>';
		strHTML += '<th><font color="#FFFFFF">Valor Conferido Somado</th>';
		strHTML += '<th><font color="#FFFFFF">Diferenca Somado</th>';
		strHTML += '<th><font color="#FFFFFF">Numero Pack</th>';
		strHTML += '<th><font color="#FFFFFF">Valor Declarado</th>';
		strHTML += '<th><font color="#FFFFFF">Valor Conferido</th>';
		strHTML += '<th><font color="#FFFFFF">Diferenca Por Pack</th>';
		strHTML += '<th><font color="#FFFFFF">Cedula Falsa</th>';
		strHTML += "</tr>";
		return strHTML;
	}

	function validValorToVazio(valor){
		if(valor){
			return valor;
		} else{
			return "";
		}
	}

});