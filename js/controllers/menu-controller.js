angular.module('trustionPortal').controller('MenuController', function($scope, $rootScope, $state, $http, $rootScope, CacheService){
	
	//retira a imagem da tela de login
	$rootScope.imageback = '';

	if(CacheService.usuario == null){
		$state.go('login');
	}else{
		if(CacheService.usuario.data.principal.idPerfil){
			
			$scope.usuario = true;
			$scope.grupoEconomico = true;
			$scope.empresa = true;
			$scope.tipoServico = true;
			$scope.relatorioAnaliticoCreditos = true;
			$scope.relatorioAnaliticoExtrato = true;
			$scope.modeloNegocio = true;
			$scope.trilhaAuditoria = true;
			$scope.relatoriod0 = true;
			$scope.relatoriod1 = true;
			$scope.notificacoes = true;
			$scope.cofres = true;
			$scope.deposito = true;
			$scope.ocorrencia = true;
			$scope.logApi = true;
			$scope.stringHistorico = true;
			$scope.submenu = true;
			$scope.submenuNumerario = true;
			$scope.submenuCartao = true;
			$scope.periodoResumoNumerario = true;
			$scope.periodoResumoCartao = true;
			$scope.resumo = true;
			$scope.transportadora = true;
			$scope.cartoes = true;
			$scope.categoria = true;
			$scope.tipoQuestionamento = true;
			$scope.motivoConclusao = true;
			$scope.cadastroVideos = false;

			//Administrador
			if(CacheService.usuario.data.principal.idPerfil == 1){
				$scope.deposito = false;
				$scope.periodoResumoCartao = false;
				$scope.cartoes = false;
				
			}else if(CacheService.usuario.data.principal.idPerfil == 2){//Master Transportadora
				$scope.grupoEconomico = false;
				$scope.transportadora = false;
				$scope.modeloNegocio = false;
				$scope.empresa = false;
				$scope.periodoResumoCartao = false;
				$scope.cartoes = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				
			}else if(CacheService.usuario.data.principal.idPerfil == 3){//Master Cliente
				$scope.transportadora = false;
				$scope.empresa = false;
				$scope.grupoEconomico = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenuNumerario = true;
				$scope.relatorioAnaliticoCreditos = true;
				$scope.relatorioAnaliticoExtrato = true;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;

			}else if(CacheService.usuario.data.principal.idPerfil == 4){//Operador Transportadora
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.trilhaAuditoria = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenuNumerario = false;
				$scope.periodoResumoCartao = false;
				$scope.cartoes = false;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				
			}else if(CacheService.usuario.data.principal.idPerfil == 5){//Operador Cliente
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.trilhaAuditoria = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenuNumerario = false;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				
			}else if(CacheService.usuario.data.principal.idPerfil == 6){//BPO
        		$scope.modeloNegocio = false;
				$scope.cartoes = true;
				$scope.cadastroVideos = true;

			}else if(CacheService.usuario.data.principal.idPerfil == 7){//Master Cliente Cartao
				console.log("Usuario Master Cliente Cartao");
				$scope.transportadora = false;
				$scope.empresa = false;
				$scope.grupoEconomico = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				$scope.submenuNumerario = false;
				$scope.periodoResumoNumerario = false;
			
			} else if(CacheService.usuario.data.principal.idPerfil == 8){//Master Cliente Numerario
				console.log("Usuario Master Cliente Numerario");
				$scope.transportadora = false;
				$scope.empresa = false;
				$scope.grupoEconomico = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				$scope.submenuCartao = false;
				$scope.cartoes = false;

			}else if(CacheService.usuario.data.principal.idPerfil == 9){//Operador Cliente Cartao
				console.log('Usuário Operador Cliente Cartao');
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.trilhaAuditoria = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				$scope.submenuNumerario = false;
				$scope.periodoResumoNumerario = false;

			}else if(CacheService.usuario.data.principal.idPerfil == 10){//Operador Cliente Numerario
				console.log('Usuário Operador Cliente Numerario');
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.trilhaAuditoria = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				$scope.submenuCartao = false;
				$scope.cartoes = false;

			}else if(CacheService.usuario.data.principal.idPerfil == 11){// Master Cliente Venda Numerario (BK)
				console.log('Usuário Master Cliente Venda Numerario');
				$scope.transportadora = false;
				$scope.empresa = false;
				$scope.grupoEconomico = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenuNumerario = true;
				$scope.conciliaVendaNumerarioMenu = true;
				$scope.conciliaVendaNumerarioSubMenu = true;
				$scope.relatorioAnaliticoCreditos = true;
				$scope.relatorioAnaliticoExtrato = true;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;

			}else if(CacheService.usuario.data.principal.idPerfil == 12){// Operador Cliente Venda Numerario (BK)
				console.log('Usuário Operador Cliente Venda Numerario');
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.trilhaAuditoria = false;
				$scope.tipoServico = false;
				$scope.modeloNegocio = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenuNumerario = true;
				$scope.conciliaVendaNumerarioMenu = true;
				$scope.conciliaVendaNumerarioSubMenu = true;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;

			}else{				
				$scope.usuario = false;
				$scope.grupoEconomico = false;
				$scope.empresa = false;
				$scope.tipoServico = false;
				$scope.relatorioAnaliticoCreditos = false;
				$scope.relatorioAnaliticoExtrato = false;
				$scope.modeloNegocio = false;
				$scope.trilhaAuditoria = false;
				$scope.notificacoes = false;
				$scope.cofres = false;
				$scope.logApi = false;
				$scope.stringHistorico = false;
				$scope.submenu = false;
				$scope.submenuNumerario = false;
				$scope.submenuCartao = false;
				$scope.periodoResumoNumerario = false;
				$scope.periodoResumoCartao = false;
				$scope.cartoes = false;
				$scope.transportadora = false;
				$scope.tipoQuestionamento = false;
				$scope.motivoConclusao = false;
				
			}
		}else{
			$state.go('login');
		}
	}
	
	$rootScope.$on('reloadMenuRelatorio', function(event, recarregar){
		if(recarregar){
			submenusRelatorioAnalitico();
		}
	});
});
