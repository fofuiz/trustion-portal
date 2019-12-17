angular
	.module('trustionPortal')
	.controller('RelatorioConciliacaoVendasNumerario',

    function (
		$uibModal, 
		$scope, 
		$window, 
		CacheService, 
		GrupoEconomicoService, 
		TransportadoraService, 
		EmpresaService, 
		RelatorioConciliacaoVendasNumerarioService, 
		UTF8,
		$timeout, 
		$compile
	) {

		$scope.alert = '';
		$scope.deletedElements = [];
		$scope.disableReset = false;
		$scope.isVisibleBottomSheet = false;

		$scope.visibleCols = [
			{ visible: true, id:'col_A', title: 'Empresa'},
			{ visible: true, id:'col_B', title: 'CNPJ'},
			{ visible: true, id:'col_C', title: 'GTV'},
			{ visible: true, id:'col_D', title: 'Sigla da Loja'},
			{ visible: true, id:'col_E', title: 'Data Recolhimento'},
			{ visible: true, id:'col_F', title: 'Valor Declarado'},
			{ visible: true, id:'col_G', title: 'Valor Conferido'},
			{ visible: true, id:'col_H', title: 'Data Conciliação'},
			{ visible: true, id:'col_I', title: 'Valor Total Vendas'},
			{ visible: true, id:'col_J', title: 'Diferença'},
			{ visible: true, id:'col_K', title: 'Datas Vendas Conciliadas'},
			{ visible: true, id:'col_L', title: 'Quantidade de Coletas por Semana'},
			{ visible: true, id:'col_M', title: 'Status'},
			{ visible: true, id:'col_N', title: 'Vídeos'}
		];
		

		$scope.isOpen = false;

		$scope.demo = {
		  isOpen: false,
		  count: 0,
		  selectedDirection: 'left'
		};
		
        $scope.isExibirMensagemErro = false;
		$scope.mensagemErro = '';
		$scope.isExibirMensagemSucesso = false;
		$scope.mensagemSucesso = '';

		$scope.listaGrupoTranspOpc = [];
		$scope.listaGrupoTranspSel = [];
		$scope.listaGrupoTranspMem = [];
		
		$scope.listaGrupoEconOpc = [];
		$scope.listaGrupoEconSel = [];
		$scope.listaGrupoEconMem = [];
		
		$scope.listaEmpresaOpc = [];
		$scope.listaEmpresaSel = [];
		$scope.listaEmpresaMem = [];

        $scope.lstRegPorPag = [10, 15, 25, 30];
        $scope.registrosPorPag = $scope.lstRegPorPag[1];

        $scope.filtroRelatorio = {};
        $scope.filtroRelatorioPage = {};

        $scope.listaRelatorio = [];

        $scope.tipoCreditoD0 = 'D0';
		$scope.tipoCreditoDN = 'DN';
		$scope.label = "OKFRHOK";

        configurarPaginacao();
        loadPage();

        function loadPage() {
			/*
			setTimeout(function() {
				
				var $div = $("#novonode");
				var clone = $div.clone();				
				var $target = $("#thCols");
				$div.remove();
			  
				angular.element($target).injector().invoke(function($compile) {
				  var $scope = angular.element($target).scope();
				  $target.append($compile(clone)($scope));
				  
				  $scope.$apply();
				});
			  }, 100);
			  */

			carregarTransportadoras();

			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;            
            $scope.itemList = angular.copy($scope.visibleCols);
		}

		$scope.toggleFiltro = function(isCollapsedFilter){
			return $scope.isCollapsedFilter = !isCollapsedFilter;
		}
		
		function memorizarListas() {
			$scope.listaGrupoTranspMem = $scope.listaGrupoTranspOpc.slice();
			$scope.listaGrupoEconMem = $scope.listaGrupoEconOpc.slice();
			$scope.listaEmpresaMem = $scope.listaEmpresaOpc.slice();
		}
		
		function restaurarListas() {
			$scope.listaGrupoTranspOpc = $scope.listaGrupoTranspMem.slice();
			$scope.listaGrupoEconOpc = $scope.listaGrupoEconMem.slice();
			$scope.listaEmpresaOpc = $scope.listaEmpresaMem.slice();
		}
		
		$scope.restringirTranspGrupoEconEmpresa = function() {
			if ($scope.listaGrupoTranspMem.length > 0) {
				
				// Restaurar opcoes
				restaurarListas()
				
				// Eliminar opcoes
				eliminarGruposEconomicosPelasTransportadoras();			
				eliminarGruposEconomicosPelasEmpresas();
				eliminarEmpresasPelosGruposEconomicos();
				eliminarTransportadorasPelasEmpresas();
				eliminarEmpresasPelasTransportadoras();
				eliminarTransportadorasPelosGruposEconomicos();
				
			}
		}

		function eliminarTransportadorasPelosGruposEconomicos() {
			// restringir opcoes de "transportadoras" para os "grupos economicos" selecionados
			if ($scope.listaGrupoEconSel.length > 0) {
				var elementosCorretosF = [];
				for (var i = 0; i < $scope.listaGrupoEconSel.length; i++) {
					for (var index = 0; index < $scope.listaGrupoTranspOpc.length; index++) {
						for (var j = 0; j < $scope.listaGrupoTranspOpc[index].outrasEmpresas.length; j++) {
							if ($scope.listaGrupoTranspOpc[index].outrasEmpresas[j].idGrupoEconomico === $scope.listaGrupoEconSel[i].idGrupoEconomico
								&& elementosCorretosF.indexOf($scope.listaGrupoTranspOpc[index]) < 0) {
								elementosCorretosF.push($scope.listaGrupoTranspOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoTranspOpc = elementosCorretosF.slice();
			}
		}
		
		function eliminarGruposEconomicosPelasTransportadoras() {
			// restringir opcoes de "grupos economicos" para as "transportadoras" selecionadas
			if ($scope.listaGrupoTranspSel.length > 0) {
				var elementosCorretosA = [];
				for (var index = 0; index < $scope.listaGrupoEconOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspSel.length; i++) {
						for (var m = 0; m < $scope.listaGrupoTranspSel[i].outrasEmpresas.length; m++) {
							if ($scope.listaGrupoEconOpc[index].idGrupoEconomico === $scope.listaGrupoTranspSel[i].outrasEmpresas[m].idGrupoEconomico
								&& elementosCorretosA.indexOf($scope.listaGrupoEconOpc[index]) < 0) {
								elementosCorretosA.push($scope.listaGrupoEconOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoEconOpc = elementosCorretosA.slice();
			}
		}
		
		function eliminarGruposEconomicosPelasEmpresas() {
			// restringir opcoes de "grupos economicos" para as "empresas" selecionadas
			if ($scope.listaEmpresaSel.length > 0) {
				var elementosCorretosB = [];
				for (var index = 0; index < $scope.listaGrupoEconOpc.length; index++) {
					for (var i = 0; i < $scope.listaEmpresaSel.length; i++) {
						if ($scope.listaGrupoEconOpc[index].idGrupoEconomico === $scope.listaEmpresaSel[i].idGrupoEconomico
							&& elementosCorretosB.indexOf($scope.listaGrupoEconOpc[index]) < 0) {
							elementosCorretosB.push($scope.listaGrupoEconOpc[index]);
						}
					}
				}
				$scope.listaGrupoEconOpc = elementosCorretosB.slice();
			}
		}
		
		function eliminarEmpresasPelosGruposEconomicos() {
			// restringir opcoes de "empresas" para os "grupos economicos" selecionados
			if ($scope.listaGrupoEconSel.length > 0) {
				var elementosCorretosC = [];
				for (var index = 0; index < $scope.listaEmpresaOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoEconSel.length; i++) {
						if ($scope.listaEmpresaOpc[index].idGrupoEconomico === $scope.listaGrupoEconSel[i].idGrupoEconomico
							&& elementosCorretosC.indexOf($scope.listaEmpresaOpc[index]) < 0) {
							elementosCorretosC.push($scope.listaEmpresaOpc[index]);
						}
					}
				}
				$scope.listaEmpresaOpc = elementosCorretosC.slice();
			}
		}
		
		function eliminarTransportadorasPelasEmpresas() {
			// restringir opcoes de "transportadoras" para as "empresas" selecionadas
			if ($scope.listaEmpresaSel.length > 0) {
				var elementosCorretosD = [];
				for (var index = 0; index < $scope.listaGrupoTranspOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspOpc[index].outrasEmpresas.length; i++) {
						for (var m = 0; m < $scope.listaEmpresaSel.length; m++) {
							if ($scope.listaGrupoTranspOpc[index].outrasEmpresas[i].idGrupoEconomico === $scope.listaEmpresaSel[m].idGrupoEconomico
								&& elementosCorretosD.indexOf($scope.listaGrupoTranspOpc[index]) < 0) {
								elementosCorretosD.push($scope.listaGrupoTranspOpc[index]);
							}
						}
					}
				}
				$scope.listaGrupoTranspOpc = elementosCorretosD.slice();
			}
		}
		
		function eliminarEmpresasPelasTransportadoras() {
			// restringir opcoes de "empresas" para os "transportadoras" selecionados
			if ($scope.listaGrupoTranspSel.length > 0) {
				var elementosCorretosE = [];
				for (var index = 0; index < $scope.listaEmpresaOpc.length; index++) {
					for (var i = 0; i < $scope.listaGrupoTranspSel.length; i++) {
						for (var m = 0; m < $scope.listaGrupoTranspSel[i].outrasEmpresas.length; m++) {
							if ($scope.listaEmpresaOpc[index].idGrupoEconomico == $scope.listaGrupoTranspSel[i].outrasEmpresas[m].idGrupoEconomico
								&& elementosCorretosE.indexOf($scope.listaEmpresaOpc[index]) < 0) {
								elementosCorretosE.push($scope.listaEmpresaOpc[index]);
							}
						}
					}
				}
				$scope.listaEmpresaOpc = elementosCorretosE.slice();
			}
		}

		
		function carregarTransportadoras() {

			var idPerfil = CacheService.usuario.data.principal.idPerfil;
			TransportadoraService.listarPorPerfilETipoCredito(idPerfil, $scope.tipoCreditoD0).then(function successCallback(res){
				$scope.listaGrupoTranspOpc = res.data;
				$scope.carregarGruposEconomicosOutros();
			}, function errorCallback(res){
				$scope.isExibirMensagemErro = true;
				$scope.mensagemErro = UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de transportadoras. Favor, entrar em contato com o administrador do sistema.';
			});
		}
		
		$scope.carregarGruposEconomicosOutros = function(){
			var idPerfil = CacheService.usuario.data.principal.idPerfil;

			GrupoEconomicoService.listaPorPerfilUsuario(idPerfil).then(
				function successCallback(res) {
					$scope.listaGrupoEconOpc = res.data;
					$scope.carregarEmpresas();
				}, 
	
				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de grupo '+UTF8.economico+'. Favor, entrar em contato com o administrador do sistema.';
				}
			);
		}


		$scope.carregarEmpresas = function() {
			
			var selGrupos = undefined;
			
			if(($scope.listaGrupoEconSel == undefined || $scope.listaGrupoEconSel == '') && ($scope.listaGrupoEconOpc != undefined || $scope.listaGrupoEconOpc != '')) {
				$scope.listaEmpresaOpc = [];
				$scope.listaEmpresaSel = [];
				selGrupos = $scope.listaGrupoEconOpc.slice();
			} else {
				selGrupos = $scope.listaGrupoEconSel.slice();
			}

			EmpresaService.pesquisarPorGrpEconD0(selGrupos).then(
				function successCallback(res) {
					$scope.listaEmpresaOpc = res.data;
					memorizarListas();
				}, 

				function errorCallback(res) {
					$scope.isExibirMensagemErro = true;
					$scope.mensagemErro = UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.';
				}
			);

		}

        //  ->> CÓDIGO ABAIXO IMPLEMENTADO

        // Pesquisar Relatorio de vídeos
        $scope.pesquisarRelatorioGtvVideo = function () {

            $scope.isExibirMensagemErro = false;
            $scope.mensagemErro = '';
            $scope.isExibirMensagemSucesso = false;
            $scope.mensagemSucesso = '';

            if ($scope.formRelatorioGtvVideo.$valid) {

                //Validando data
                if (!validarDatasPeriodo()) {
                    return;
                }


                //VALIDANDO FILTROS DA TELA

                //Transportadora 
                /*
				if ($scope.listaGrupoTranspSel.length == 0) {
					$scope.filtroRelatorio.transportadoras = [];
				} else {
					$scope.filtroRelatorio.transportadoras = $scope.listaGrupoTranspSel;
				}

                //Grupo
				if ($scope.listaGrupoEconSel.length == 0) {
					$scope.filtroRelatorio.grupoEmpresas = [];
				} else {
					$scope.filtroRelatorio.grupoEmpresas = $scope.listaGrupoEconSel;
				}

                //Empresas
				if ($scope.listaEmpresaSel.length == 0) {
					$scope.filtroRelatorio.empresas = [];
				} else {
					$scope.filtroRelatorio.empresas = $scope.listaEmpresaSel;
                }*/

                //GTV
                if ($scope.gtv == null) {
                    $scope.filtroRelatorio.gtv = null;
                } else {
                    if ($scope.gtv.length == 0) {
                        $scope.filtroRelatorio.gtv = null;
                    } else {
                        $scope.filtroRelatorio.gtv = convertStringToInt($scope.gtv);
                    }
                }

                //Datas
                $scope.filtroRelatorio.dataInicial = $scope.dataInicialEnvio.getTime();
                $scope.filtroRelatorio.dataFinal = $scope.dataFinalEnvio.getTime();

                //Montando Objeto
                $scope.filtroRelatorio.registrosComDiferenca = 0;//$scope.registrosComDiferenca;
                $scope.pag_registrosPorPagina = $scope.registrosPorPag;
                $scope.pag_paginaSelecionada = 1;
                $scope.filtroRelatorioPage = angular.copy($scope.filtroRelatorio);

                $scope.carregarRelatorioPorPagina($scope.filtroRelatorioPage);

                $scope.toggleFiltro();

            } else {
                if (!$scope.dataInicial) {
                    $scope.isExibirMensagemErro = true;
                    $scope.mensagemErro = 'Favor, preencher a data inicial.';
                    return;
                }

                if (!$scope.dataFinal) {
                    $scope.isExibirMensagemErro = true;
                    $scope.mensagemErro = 'Favor, preencher a data final.';
                    return;
                }
            }

        }

        $scope.carregarRelatorioPorPagina = function (filtroRelatorio) {

            RelatorioConciliacaoVendasNumerarioService.pesquisarPorCriteriosPagina(
                filtroRelatorio, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(
                    function successCallback(retorno) {
                        if (retorno.data.content == '' || retorno.data == '') {
                            $scope.mensagemErro = 'Nenhum registro encontrado.';
                            $scope.isExibirMensagemErro = true;
                        }

                        $scope.listaRelatorio = retorno.data.content;
                        $scope.pag_totalRegistros = retorno.data.totalElements;
						$scope.paginacao = true;
						
						window.setTimeout(() => {				
							sortTable();
						}, 200);

                        return;
                    },
                    function errorCallback(retorno) {
                        if (retorno.data != null && retorno.data.hasOwnProperty('mensagem')) {
                            $scope.isExibirMensagemErro = true;
                            $scope.mensagemErro = retorno.data.mensagem;
                        } else {
                            $scope.isExibirMensagemErro = true;
                            $scope.mensagemErro = UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.';
                        }
                        $scope.listaRelatorio = [];
                        $scope.pag_totalRegistros = 0;
                    }
                );
        }

        function configurarPaginacao() {
			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;
        }
        
        $scope.moveItem = function(items, from, to) {
			angular.forEach(items, function(item) {
				var idx = from.indexOf(item);
				from.splice(idx, 1);
				to.push(item);
			});
		};

        function validarDatasPeriodo() {
            $scope.dataInicialEnvio = new Date($scope.dataInicial);
            $scope.dataFinalEnvio = new Date($scope.dataFinal);

            $scope.dataInicialEnvio.setHours(0, 0, 0, 0);
            $scope.dataFinalEnvio.setHours(23, 59, 59, 0);

            var diferenca = Math.round(($scope.dataFinalEnvio.getTime() - $scope.dataInicialEnvio.getTime()) / 86400011);

            if (diferenca > 90) {
                $scope.isExibirMensagemErro = true;
                $scope.mensagemErro = 'Favor, preencher as datas com o máximo de 90 dias, no momento você selecionou ' + diferenca + ' dias.';
                return false;
            }

            if (diferenca < 0) {
                $scope.isExibirMensagemErro = true;
                $scope.mensagemErro = 'Favor, preencher a data corretamente, data final é menor que a data inicial.';
                return false;
            }

            return true;
        }

        function convertStringToInt(value) {
            return Number(value);
		}

		$scope.alertar = () => {
			console.log('ok FRH');
		}

		// Sprint03
		$scope.modalDetalhesGtvBananinhas = function(item) {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/conciliacaoVendasNumerario/modais/detalhes-gtv-bananinhas.html',
					controller: 'DetalhesGtvBananinhasController',
					windowClass: 'large-Modal',

					resolve: {
						relatorio:function(){
							return item;
						}
					}
				}
			);
		}

		// Sprint04
		$scope.modalLinkVideo = function(item) {

			$uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-titulo',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'partials/conciliacaoVendasNumerario/modais/link-video.html',
					controller: 'LinkVideoController',
					windowClass: 'large-Modal',

					resolve: {
						relatorio:function(){
							return item;
						}
					}
				}
			);
		}

		var seta = document.getElementById('seta');

		document.addEventListener("dragstart", function(event) {			
			event.dataTransfer.setData("draggedColId", event.target.id);
		});

		document.addEventListener("dragenter", function(event) {				
			if (event.target.id) {
				if (event.target.id.indexOf('col_')>-1) {						
					if (event.target.tagName === 'TH') {						
						event.target.style.borderLeft = "dashed 2px green";
						seta.style.visibility = 'visible';
						seta.style.left = event.target.offsetLeft+'px';
					}					
				}
			}
		});

		document.addEventListener("dragleave", function(event) {				
			if (event.target.id) {
				if (event.target.id.indexOf('col_')>-1) {						
					if (event.target.tagName === 'TH') {
						event.target.style.borderLeft = '';
					}					
				}
			}
		});
		
		// Precisa manter o dragover
		document.addEventListener("dragover", function(event) {
			event.preventDefault();
		});

		document.addEventListener("drop", function(event) {
			
			event.target.style.borderLeft = '';
			var droppedCol= null;

			if (event.target.id) {
				if (event.target.id.indexOf('col_')>-1) {
					if (event.target.tagName !== 'TH') {
						var k = 0;
						do {
							var parent = event.target.parentElement;
							if (parent && parent.id) {
								if (parent.tagName === 'TH' &&  parent.id.indexOf('col_')>-1) {
									droppedCol= parent;
									break;
								}
							}else {
								break;
							}
							k++;
						}
						while (k < 5);
					} else {				
						droppedCol= event.target;
					}					
				}
			}
			 
			if (droppedCol) {
				var thDragElem = document.getElementById(event.dataTransfer.getData('draggedColId'));
				var thDropElem = document.getElementById(droppedCol.id);
				thDropElem.insertAdjacentElement('beforebegin', thDragElem);
				
				var i = 0;								
				$scope.listaRelatorio.forEach(item => {
					dragElem = document.getElementById(thDragElem.id + "_" + i);
					dropElem = document.getElementById(thDropElem.id + '_' + i)
					dropElem.insertAdjacentElement('beforebegin', dragElem);
					i++;
				});				
				
				var colMap = [...document.getElementById('thCols').childNodes]
				.filter(node => node.tagName === 'TH')
				.map(thElem => thElem.id);
				$window.localStorage.setItem('colMap', JSON.stringify(colMap));
			}

			seta.style.visibility = 'hidden';
			seta.style.left = '0px';
			seta.style.top = '0px';
			event.preventDefault();
		});

		$scope.resetToDefault = () => { 						
			$('#disableReset').css({"visibility":"hidden"});
			$window.localStorage.setItem('colMap', '["col_A","col_B","col_C","col_D","col_E","col_F","col_G","col_H","col_I","col_J","col_K","col_L","col_M","col_N"]');
			sortTable();
			window.setTimeout(() => {
				$('#disableReset').css({"visibility":"visible"});
			}, 1000);
		}

		function sortTable(filtro = false) {

			var clone = {};
			var thCols = $('#thCols');
			var tdCols = {};
			var elem = {};			
			var colMap = $window.localStorage.getItem('colMap');
			var id = '';
			var clone;
			var cloneItem;
			var cloneItemIndex;

			if (!colMap) {
				colMap = [...document.getElementById('table').childNodes]
				.filter(node => node.tagName === 'TH')
				.map(thElem => thElem.id);
				$window.localStorage.setItem('colMap', JSON.stringify(colMap));
			} else {
				colMap = JSON.parse(colMap);
			}
			
			var colMapLen = colMap.length;
			for(var i = 0; i < colMapLen; i++){
				id = colMap[i];
				elem = $('#'+id);
				if (elem) {
					if (!filtro) {
						var clone = elem.clone();				
						elem.remove();
						thCols.append(clone);						
					} else {
						var isVisible = $scope.visibleCols.find(item => item.id === colMap[i]).visible;
						if (isVisible) {
							if ([...elem].length>0) {									
								clone = elem.clone();
								elem.remove();
								thCols.append(clone);
								angularDomInject(thCols, clone);
							} else {									
								cloneItemIndex = $scope.deletedElements.findIndex(item => item.id === id);
								clone = $scope.deletedElements[cloneItemIndex].elem;									
								thCols.append(clone);
								angularDomInject(thCols, clone);
								$scope.deletedElements.splice(cloneItemIndex,1);
							}
						} else {							
							$scope.deletedElements.push({id, elem: angular.copy(elem)});
							elem.remove();

						}
					}
				}
			}

			j = 0;
			$scope.listaRelatorio.forEach(item => {
				tdCols = $('#tdCols_'+j);			
				colMapLen = colMap.length;
				for(var k = 0; k < colMapLen; k++){
					id = colMap[k] + '_' +j;
					elem = $('#'+id);
					if (elem) {
						if (!filtro) {
							var clone = elem.clone();				
							elem.remove();
							tdCols.append(clone);
							angularDomInject(tdCols, clone);
						} else {
							var isVisible = $scope.visibleCols.find(item => item.id === colMap[k]).visible;
							if (isVisible) {
								if ([...elem].length>0) {									
									clone = elem.clone();				
									elem.remove();
									tdCols.append(clone);
									angularDomInject(tdCols, clone);
								} else {									
									cloneItemIndex = $scope.deletedElements.findIndex(item => item.id === id);
									clone = $scope.deletedElements[cloneItemIndex].elem;									
									tdCols.append(clone);
									angularDomInject(tdCols, clone);
									$scope.deletedElements.splice(cloneItemIndex,1);
								}
							} else {
								$scope.deletedElements.push({id, elem: angular.copy(elem)});
								elem.remove();
							}
						}
					}
				}
				j++;
			});			
		};

		angularDomInject = (target, child) => {
			window.setTimeout(() => {
				angular.element(target).injector().invoke(function($compile) {
					var $scope = angular.element(target).scope();
					target.append($compile(child)($scope));				
					$scope.$apply();
				});
			}, 200);
		}

		$scope.showGridBottomSheet = function() {	
			$scope.isVisibleBottomSheet = true;
		};

        $scope.showHeaderAvaliableCols = () => {
            return $scope.itemList.filter(item => !item.visible).length > 0;
		}
		
		$scope.bottomSheetClose = () => {
			$scope.isVisibleBottomSheet = false;
			$scope.visibleCols = $scope.itemList;	
			var filtro = true;
			sortTable(filtro);
		};
		
        $scope.removeItem = (title) => {
            var itemToRemove = $scope.itemList.find(item => item.title === title);
            itemToRemove.visible = !itemToRemove.visible;
        }

        $scope.addItem = (title) => {
            var itemToAdd = $scope.itemList.find(item => item.title === title);
            itemToAdd.visible = !itemToAdd.visible;
        }
    });