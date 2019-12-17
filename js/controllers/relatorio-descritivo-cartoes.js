angular
	.module('trustionPortal')
	.controller('RelatorioDescritivoCartoesController', 

    function (		
		$scope, 
        RelatorioDescritivoCartoesService,
	) {
        moment.locale("pt-br");
        $scope.maxData = moment().subtract(1, 'day');
        moment.locale("pt-br");

        $scope.isQuerying = false;        
        $scope.reportList = [];
        $scope.reportListBlob = [];
        $scope.headerList = [];
        
        $scope.dataInicial;
        $scope.dataFinal;
        $scope.isOpen = false;

        $scope.lstRegPorPag = [10, 15, 25, 30];
        $scope.registrosPorPag = $scope.lstRegPorPag[1];

        $scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
        $scope.mensagemSucesso = '';
        $scope.searched = false;
     
        onInit = () => {            
            configurarPaginacao();            
        };
        onInit();

        function validarDatasPeriodo() {
            $scope.dataInicialEnvio = new Date($scope.dataInicial);
            $scope.dataFinalEnvio = new Date($scope.dataFinal);
            $scope.dataInicialEnvio.setHours(0, 0, 0, 0);
            $scope.dataFinalEnvio.setHours(23, 59, 59, 0);

            var diferenca = Math.round(($scope.dataFinalEnvio.getTime() - $scope.dataInicialEnvio.getTime()) / 86400011);

            if (diferenca > 30) {
                $scope.isExibirMensagemErro = true;
                $scope.mensagemErro = 'Preencha as datas com o máximo de 30 dias, no momento você selecionou ' + diferenca + ' dias.';
                return false;
            }
            if (diferenca < 0) {
                $scope.isExibirMensagemErro = true;
                $scope.mensagemErro = 'A data final é anterior à data inicial';
                return false;
            }
            return true;
        }

        $scope.clickGetCardReport = () => {

            $scope.searched = true;
            $scope.isExibirMensagemErro = false;
            $scope.mensagemErro = '';
            $scope.isExibirMensagemSucesso = false;
            $scope.mensagemSucesso = '';
            $scope.pag_registrosPorPagina = $scope.registrosPorPag;
            $scope.pag_paginaSelecionada = 1;            
            $scope.headerList = [];  

            if ($scope.formCardReport.$valid) {
                if (validarDatasPeriodo()) {
                    getCardReport();
                } else {
                    if (!$scope.dataInicial) {
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = 'Preencha a data inicial';
                        return;
                    }

                    if (!$scope.dataFinal) {
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = 'Preencha a data final';
                        return;
                    }
                }
            }
        };        

        prepareHeaders = () => {
            $scope.headerList.push({title: 'Adquirente', key: 'somaAdq', detail: 'adquirenteDetalhes', style: "{'width':'25%', 'text-align':'center'}"});
            $scope.headerList.push({title: 'Bkoffice', key: 'somaBk', detail: 'bkofficeDetalhes', style: "{'width':'25%', 'text-align':'center'}"});
            $scope.headerList.push({title: 'Skytef', key: 'somaSky', detail: 'skytefDetalhes', style: "{'width':'25%', 'text-align':'center'}"});
            $scope.headerList.push({title: 'Data', key: 'dataConcil', detail: false, style: "{'width':'10%', 'text-align':'center'}"});
            $scope.headerList.push({title: 'Status', key: 'status', detail: false, style: "{'width':'15%', 'text-align':'center'}"});                    
        };

        getCardReport = (blob = false) => {
            if (!blob) {
                $scope.isQuerying = true;
                var responseSubject = RelatorioDescritivoCartoesService
                                        .getCardReport( 
                                            $scope.dataInicialEnvio.getTime(), 
                                            $scope.dataFinalEnvio.getTime(), 
                                            $scope.pag_paginaSelecionada - 1, 
                                            $scope.pag_registrosPorPagina );
                responseSubject.then(
                    (response) => {
                        $scope.isQuerying = false;                    
                        $scope.reportList = (response && response.data) ? response.data.content : [];
                        $scope.paginacao = true;
                        prepareHeaders();
                    }, (error) => {
                        $scope.isQuerying = false;                    
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = 'Ocorreu um erro durante a pesquisa, tente novamente mais tarde.';
                    }
                );

            } else {
                var responseSubject = RelatorioDescritivoCartoesService
                                        .getCardReportBlob( 
                                            $scope.dataInicialEnvio.getTime(), 
                                            $scope.dataFinalEnvio.getTime(), 
                                            $scope.pag_paginaSelecionada - 1, 
                                            $scope.pag_registrosPorPagina );
                responseSubject.then(
                    (response) => {                        
                        $scope.reportListBlob = (response && response.data) ? response.data.content : [];
                    }, (error) => {
                        $scope.isQuerying = false;                    
                        $scope.isExibirMensagemErro = true;
                        $scope.mensagemErro = 'Ocorreu um erro ao exportar, tente novamente mais tarde.';
                    }
                );
            }
        };

        function configurarPaginacao() {
			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;
        }

        $scope.setCustomItem = (type, payload) => {
            if (type === 'dataConcil') {                
                return ('0' + payload.dayOfMonth).slice(-2) + '/' + ('0' + payload.monthValue).slice(-2) + '/' + payload.year;
            }
            if (type === 'status') {
                return (payload) ? 'CONCILIADO' : 'NÃO CONCILIADO';
            }
        }

		$scope.exportXls = function () {
    
            var getBlob = true;
            getCardReport(getBlob);

			var data = new Date();
			var month = eval(data.getMonth() + 1);
			
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
	
			var stringData = data.getDate() + '/' + month + '/' + data.getFullYear();
	
			var strHTML = "<table>";
			strHTML += getTotalSumHeader(strHTML);

			setTimeout(function() {
				for (let index = 0; index < $scope.reportList.length; index++) {
					
					var somaAdq = validateEmpty($scope.reportList[index].somaAdq);
					var somaBk = validateEmpty($scope.reportList[index].somaBk);
                    var somaSky = validateEmpty($scope.reportList[index].somaSky);
					var dataConcil = validateEmpty($scope.setCustomItem('dataConcil', $scope.reportList[index].dataConcil));
					var status = validateEmpty($scope.setCustomItem('status', $scope.reportList[index].status));
	
					strHTML += '<tr>';
					strHTML += '<td>' + somaAdq + '</td>';
					strHTML += '<td>' + somaBk + '</td>';
					strHTML += '<td>' + somaSky + '</td>';
					strHTML += '<td>' + dataConcil + '</td>';
					strHTML += '<td>' + status + '</td>';
                    	
					strHTML += '</tr>';
				}
	
				strHTML += "</table>";
	
				var blob = new Blob([strHTML], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;content=text/html;charset=utf-8"
				});
	
				saveAs(blob, "RelatorioDescritivoCartoes_" + stringData + ".xls");
				
			}, 1000);
		}

		function getTotalSumHeader(strHTML){
			strHTML += '<tr bgcolor="#747476">';
			strHTML += '<th><font color="#FFFFFF">Adquirente</th>';
			strHTML += '<th><font color="#FFFFFF">BK Office</th>';
			strHTML += '<th><font color="#FFFFFF">Skytef</th>';
			strHTML += '<th><font color="#FFFFFF">Data</th>';
			strHTML += '<th><font color="#FFFFFF">Status</th>';
			strHTML += "</tr>";
			return strHTML;
		}
	
		function validateEmpty(valor){
			if(valor){
				return valor;
			} else{
				return "";
			}
		}

    });