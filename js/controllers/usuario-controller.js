angular.module('trustionPortal').controller('UsuarioController', 
	function($scope, $stateParams, TrustionHelpers, UsuarioService, CacheService, GrupoEconomicoService, EmpresaService, PerfilService, NotificacaoService, TransportadoraService, UTF8) {

		var transportadorasUsuarioLogado; //usado quando o perfil do usuario logado eh M
		var usuarioLogadoDetalhes;

		$scope.listaUsuario = [];
		$scope.novoUsuario = {};
		$scope.alteraUsuario = {};
		$scope.filtroUsuario = {};
		$scope.filtroUsuarioPage = {};

		$scope.listaGrupoEconomico = [];
		$scope.listaGrupoEmpresas = []; //usado na view.
		var listaGrupoEmpresas = []; //usado para operacoes no controller sem interferir na view.
		$scope.listaPerfilCadastro = [];
		$scope.listaPerfilPesquisa = [];
		$scope.listaEmpresa = [];
		$scope.listaNotificacoes = [];
		$scope.listaTransportadoras = [];

		$scope.listaStatus = [
			{codigo: 'A', descricao: 'Ativo'}, 
			{codigo: 'I', descricao: 'Inativo'},
			{codigo: 'S', descricao: 'Suspenso'}
		];

		$scope.usuario = {
			"idUsuarioCriacao": '',
			"email": '',
			"nroTelefone": '',
			"login": '',
			"idPerfil": '',
			"empresasTransportadoras": []
		}

		$scope.idPerfil = CacheService.usuario.data.principal.idPerfil;

		configurarPaginacao();
		loadPage();

		/**
		 * se o parametro existir na sessao, eh edicao de usuario,
		 * pesquisa o usuario selecionado e preenche o formulario para edicao.
		 */
		if($stateParams.idUsuario) {
			$scope.ehEdicao = true;

			UsuarioService.pesquisarPorId($stateParams.idUsuario).then(
				function successCallback(retorno) {
					$scope.usuario = testPayload(retorno.data);

					if(!$scope.usuario.empresasTransportadoras) {
						$scope.selecionarNotificacaoInfoPerfil();
					}

					$scope.usuario.empresasTransportadoras.forEach(empresaTransportadora => {

						if(empresaTransportadora.notificacoes.length > 0) {
							empresaTransportadora.receberNotificacoes = true;
						}
					});

					// usado no combobox Grupo Empresa:
					carregarListaGrupoEmpresas($scope.usuario.empresasTransportadoras.length);

				}, function errorCallback(retorno) {
					$scope.showErrorMessage(retorno.data.mensagem);
				}
			);
		}

	function testPayload(payload){
			if (payload.empresasTransportadoras == null){
				return changePayload(payload);
				// return payload;
			}else{
				return payload;
			}

	}

	function changePayload(payload){
		if (payload.hasOwnProperty('transportadoraList') && payload.transportadoraList != null){
			let transportadoras = payload.transportadoraList;
			payload.empresasTransportadoras  = addId(transportadoras, 'idTransportadora', 'transportadora');

		} else if(payload.hasOwnProperty('empresaList') && payload.empresaList != null){
			let empresas = payload.empresaList;
			payload.empresasTransportadoras  = addId(empresas, 'idEmpresa', 'empresa');
		}

		return payload;
	}

	function addId(lista, parametro, key){
		let x = [];
		for( let i in lista){
			x.push({
				"receberNotificacoes": false,
				"idGrupoEmpresa": lista[i]["idGrupoEconomico"] ,
				[key] : lista[i][parametro],
				"notificacoes": []
					});
		}
		return x;
	}



		function loadPage() {
			$scope.hideMessage();
			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

			//carrega o combo grupo empresa
			GrupoEconomicoService.lista(grupo).then(
				function successCallback(res) {
					listaGrupoEmpresas = res.data;
					$scope.listaGrupoEmpresas[0] = angular.copy(listaGrupoEmpresas);
				}, 

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de grupo '+UTF8.economico+'. Favor, entrar em contato com o administrador do sistema.');
				}
			);
			
			PerfilService.listarTodosCadastro().then(
				function successCallback(res) {
					$scope.listaPerfilCadastro = res.data;
				}, 

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de perfil cadastro. Favor, entrar em contato com o administrador do sistema.');
				}
			);

			PerfilService.listarTodosPesquisa().then(
				function successCallback(res) {
					$scope.listaPerfilPesquisa = res.data;
				}, 

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de perfil pesquisa. Favor, entrar em contato com o administrador do sistema.');
				}
			);

			NotificacaoService.listarNotificacoes().then(function successCallback(res){
				$scope.listaNotificacoes = res.data;
			}, function errorCallback(res){
				$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de notificações. Favor, entrar em contato com o administrador do sistema.');
			});

                                    //inicializa a transportadora do usuario logado.
                                    UsuarioService.pesquisarPorId(CacheService.usuario.data.principal.idUsuario).then(function successCallback(res){
                                    transportadorasUsuarioLogado = res.data.transportadoraList;
			usuarioLogadoDetalhes = res.data;
                                    inicializarTransportadora();

				if(usuarioLogadoDetalhes.idPerfil === 1) {
					//1 = administrador
					listarTodasTransportadoras();
				}else {
					if(usuarioLogadoDetalhes.transportadoraList) {
						getTransportadora(usuarioLogadoDetalhes.transportadoraList[0].idTransportadora)
					}
				}
                
            }, function errorCallback(res){
                $scope.showErrorMessage(UTF8.Nao + ' foi' + UTF8.possivel + ' obter a empresa do ' + UTF8.usuario);
            });

		}

		function listarTodasTransportadoras() {
			
			var filtroTransportadora = {
				"status" : "A"
			};

			TransportadoraService.pesquisarPorCriterios(filtroTransportadora).then(

				function success(res) {

					$scope.listaTransportadoras = res.data;

				},

				function error(err) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de transportadoras. Favor, entrar em contato com o administrador do sistema.');
				}

			);

		}

		function getTransportadora(idTransportadora) {
		   	// carrega a lista de transportadoras ativas do usuario logado
			var transportadora = {

				"status" : "A"

			};
			if(idTransportadora) {
				transportadora.idTransportadora = idTransportadora;
			}
			TransportadoraService.pesquisarPorCriterios(transportadora).then(function successCallback(res){
				$scope.listaTransportadoras = res.data;
			}, function errorCallback(res){
				$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de transportadoras. Favor, entrar em contato com o administrador do sistema.');
			});
	   };



		/**
		 * Carrega a lista do combobox Grupo Empresa.
		 * @param {Number} qtdCarregar quantidade de grupo 'bpo' que foi adicionado no formulario.
		 */
		function carregarListaGrupoEmpresas(qtdCarregar) {
			var grupo = {};
			grupo.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

			GrupoEconomicoService.lista(grupo).then(
				function successCallback(res) {
					
			listaGrupoEmpresas = res.data;

			//Criando vetor com idGrupoEmpresa selecionados (excluindo undefineds e nulls).
			var gruposEmpresas = $scope.usuario.empresasTransportadoras.map(item => {
				
				return item.idGrupoEmpresa;
				
			}).filter(item => {
				return item;
			});
			
			//Se há esse grupo de empresa no usuário logado, tentamos pré-selecioná-los se estiverem disponíveis.
			if(usuarioLogadoDetalhes.empresasTransportadoras && usuarioLogadoDetalhes.empresasTransportadoras.length > 0) {
				
				for(var i = 0; i < usuarioLogadoDetalhes.empresasTransportadoras.length; i++) {
					
					if($scope.usuario.empresasTransportadoras[i] && $scope.usuario.empresasTransportadoras[i].idGrupoEmpresa) {
						continue;
					}
					
					if($scope.usuario.empresasTransportadoras[i] && gruposEmpresas.indexOf(usuarioLogadoDetalhes.empresasTransportadoras[i].idGrupoEmpresa) === -1) {
						$scope.usuario.empresasTransportadoras[i].idGrupoEmpresa =  usuarioLogadoDetalhes.empresasTransportadoras[i].idGrupoEmpresa;
					}
				}
				
			}
			
			for(var i = 0; i < qtdCarregar; i++) {

				$scope.listaGrupoEmpresas[i] = angular.copy(listaGrupoEmpresas).filter((grupoEmpresa) => {

					return gruposEmpresas.indexOf(grupoEmpresa.idGrupoEconomico) == -1 ||  $scope.usuario.empresasTransportadoras[i].idGrupoEmpresa == grupoEmpresa.idGrupoEconomico;

				});

			}
                    
            //Se há grupo selecionado, carregamos as empresas. Senão limpamos as empresas.
			$scope.usuario.empresasTransportadoras.forEach((notificacaoInfo, index) => {
				
				if(notificacaoInfo.idGrupoEmpresa) {
					$scope.carregarEmpresas(index, notificacaoInfo.idGrupoEmpresa);
				} else {
					notificacaoInfo.empresas = [];
					$scope.listaEmpresa[index] = [];
				}
																
			});
		}, 

		function errorCallback(res) {
			$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de grupo empresas. Favor, entrar em contato com o administrador do sistema.');
		}
			);
			
		}



		/**
		 * Cria um novo usuario.
		 */
		function criar() {

			if(!TrustionHelpers.validarEmail($scope.usuario.email)) {
				$scope.showErrorMessage('E-mail ' + UTF8.invalido);
				return;
			}
			
			//FIXME: Usando idPerfil fixo.
			//Validando Grupo Empresa / Empresa ou Transportadora
			if($scope.usuario.idPerfil == 2 || $scope.usuario.idPerfil == 4) {
				
				var validationMessage = 'Favor informe a Transportadora';
				
					if(! $scope.usuario.empresasTransportadoras || $scope.usuario.empresasTransportadoras.length <= 0) {
					$scope.showErrorMessage(validationMessage);
					return;
				} 
				
				for(var i = 0; i < $scope.usuario.empresasTransportadoras.length; i++) {
					if(! $scope.usuario.empresasTransportadoras[i].transportadora) {
						$scope.showErrorMessage(validationMessage);
						return;
					}
				}
				
			} else {
				
				var validationMessage = 'Favor informe o Grupo Empresa e Empresa';
				
				if(! $scope.usuario.empresasTransportadoras || $scope.usuario.empresasTransportadoras.length <= 0) {
					$scope.showErrorMessage(validationMessage);
					return;
				} 
				
				for(var i = 0; i < $scope.usuario.empresasTransportadoras.length; i++) {
					if(! $scope.usuario.empresasTransportadoras[i].empresas || $scope.usuario.empresasTransportadoras[i].empresas.length <= 0 || ! $scope.usuario.empresasTransportadoras[i].idGrupoEmpresa) {
						$scope.showErrorMessage(validationMessage);
						return;
					}
				}
				
			}
			// Término de Validação de Grupo Empresa / Empresa ou Transportadora
                                    
			if($scope.formNovoUsuario.$valid) {
				$scope.usuario.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

				UsuarioService.criar($scope.usuario).then(function successCallback(res){
					$scope.showSuccessMessage(UTF8.Usuario+' criado com sucesso!');
					$scope.usuario = {};

				}, function errorCallback(res){
					$scope.showErrorMessage(res.data.mensagem);
				});

			} else {

				if($scope.usuario.nome == undefined || $scope.usuario.nome == ''){
					$scope.showErrorMessage('Favor informe o nome.');
					return;
				}
				
				if($scope.usuario.login == undefined || $scope.usuario.login == ''){
					$scope.showErrorMessage('Favor informe o login.');
					return;
				}

				if($scope.usuario.idPerfil == undefined || $scope.usuario.idPerfil == ''){
					$scope.showErrorMessage('Favor informe o perfil.');
					return;
				}
				
				if(! $scope.usuario.empresasTransportadoras[0].empresas  || $scope.usuario.empresasTransportadoras[0].empresas.length <= 0) {
					$scope.showErrorMessage('Favor informe a empresa');
					return;
				}
			}
		}



		/**
		 * Altera um usuario.
		 */
		function alterar() {
			
			if(!TrustionHelpers.validarEmail($scope.usuario.email)) {
				$scope.showErrorMessage('E-mail ' + UTF8.invalido);
				return;
			}

			//Validando Grupo Empresa / Empresa ou Transportadora
			if($scope.usuario.idPerfil == 2 || $scope.usuario.idPerfil == 4) {
				
				var validationMessage = 'Favor informe a Transportadora';
				
					if(! $scope.usuario.empresasTransportadoras || $scope.usuario.empresasTransportadoras.length <= 0) {
					$scope.showErrorMessage(validationMessage);
					return;
				} 
				
				for(var i = 0; i < $scope.usuario.empresasTransportadoras.length; i++) {
					if(! $scope.usuario.empresasTransportadoras[i].transportadora) {
						$scope.showErrorMessage(validationMessage);
						return;
					}
				}
				
			} else {
				
				var validationMessage = 'Favor informe o Grupo Empresa e Empresa';
				
				if(! $scope.usuario.empresasTransportadoras || $scope.usuario.empresasTransportadoras.length <= 0) {
					$scope.showErrorMessage(validationMessage);
					return;
				} 
				
				for(var i = 0; i < $scope.usuario.empresasTransportadoras.length; i++) {
					if(! $scope.usuario.empresasTransportadoras[i].empresas || $scope.usuario.empresasTransportadoras[i].empresas.length <= 0 || ! $scope.usuario.empresasTransportadoras[i].idGrupoEmpresa) {
						$scope.showErrorMessage(validationMessage);
						return;
					}
				}
				
			}
			// Término de Validação de Grupo Empresa / Empresa ou Transportadora

			if($scope.formNovoUsuario.$valid) {
				$scope.usuario.idUsuarioAlteracao = CacheService.usuario.data.principal.idUsuario;

				UsuarioService.alterar($scope.usuario).then(
					function successCallback(res) {
						$scope.showSuccessMessage(UTF8.Usuario+' alterado com sucesso!');

					},
					function errorCallback(res) {
						$scope.showErrorMessage(res.data.mensagem);
					}
				);

			} else {

				if($scope.usuario.nome == undefined || $scope.usuario.nome == ''){
					$scope.showErrorMessage('Favor, informe o nome.');
					return;
				}
				

				if($scope.usuario.status == undefined || $scope.usuario.status == ''){
					$scope.showErrorMessage('Favor, informe o status.');
					return;
				}
			}
		}



		/**
		 * Se o usuario logado tiver o perfil 2 'Master Transportadora', seleciona
		 * a empresa do usuario logado no combo 'Transportadora'.
		 */
		function inicializarTransportadora() {

			var empresasTransportadorasAux = {
				"receberNotificacoes": false,
				"transportadora": '',
				"notificacoes": []
			};

			/*
			Se for criacao de usuario, o combo transportadora eh carregado de acordo com o perfil do
			usuario logado, e no combo jah vem marcado a transportadora do usuario logado.
			*/
			if(!$scope.ehEdicao) {

				if(usuarioLogadoDetalhes.transportadoraList) {
					empresasTransportadorasAux.transportadora = usuarioLogadoDetalhes.transportadoraList[0].idTransportadora;
				}

				$scope.usuario.empresasTransportadoras.push(empresasTransportadorasAux);
			}

			/*
			Se for edicao de usuario o combo transportadora fica selecionado a
			transportadora do usario selecionado para edicao.
			*/
			if($scope.ehEdicao) {

				if(!$scope.usuario.empresasTransportadoras[0]) {
					$scope.usuario.empresasTransportadoras.push(
						{
							"receberNotificacoes": false,
							"transportadora": $scope.usuario.transportadoraList && $scope.usuario.transportadoraList[0] ? $scope.usuario.transportadoraList[0].idTransportadora : null,
							"notificacoes": []
						}
					);
				}
			}
			//Pegamos transportadoras sem passar parâmetro.
			//O serviço serviço já está filtrando por usuário logado.
			getTransportadora();
                                    
		}



		function inicializarEmpresa() {
                                    
            $scope.usuario.empresasTransportadoras.push({
				"receberNotificacoes": false,
				"idGrupoEmpresa": null,
				"empresas": [],
				"notificacoes": [],
				"registroNovo": true
			});

			var lengthAux = $scope.usuario.empresasTransportadoras.length - 1;

			$scope.carregarEmpresas(lengthAux, $scope.usuario.empresasTransportadoras[lengthAux].idGrupoEmpresa);
            
		}


		function pegarEmpresa() {
			var empresasTransportadorasAux = {
				"receberNotificacoes": false,
				"idGrupoEmpresa": usuarioLogadoDetalhes.idGrupoEconomico,
				"empresas": [],
				"notificacoes": []
			};

			if(usuarioLogadoDetalhes.empresaList) {

				usuarioLogadoDetalhes.empresaList.forEach(empresa => {
					empresasTransportadorasAux.empresas.push(empresa.idEmpresa);
				});
				
			}

			return empresasTransportadorasAux;
		}


		
		//pesquisa da tela lista-usuario.html
		$scope.pesquisarPorCriterios = function() {

			if($scope.filtroUsuario.email && !TrustionHelpers.validarEmail($scope.filtroUsuario.email)) {
				$scope.showErrorMessage('E-mail ' + UTF8.invalido);
				return;
			}

			var payloadFormatado = formatarJsonPesquisaUsuario(angular.copy($scope.filtroUsuario));

			$scope.pag_paginaSelecionada = 1;
			$scope.filtroUsuarioPage = payloadFormatado;
			$scope.carregarUsuariosPorPagina(payloadFormatado);

		}



		//formata o json como o servico pesquisar usuario espera.
		function formatarJsonPesquisaUsuario(jsonFormatar) {
			var jsonFormatado = jsonFormatar;
			var objetoAux = {};
			
			if (jsonFormatar.idTransportadora) {
				objetoAux['transportadora'] = jsonFormatar.idTransportadora;
			}

			if (jsonFormatar.idEmpresa) {
				objetoAux['empresas'] = [];
				objetoAux.empresas.push(jsonFormatar.idEmpresa);
			}

			if (Object.keys(objetoAux).length) {
				jsonFormatado.empresasTransportadoras = [];
				jsonFormatado.empresasTransportadoras.push(objetoAux);
			}
			
			delete jsonFormatado['idEmpresa'];
      		delete jsonFormatado['idTransportadora'];

			return jsonFormatado;
		}



		/**
		 * Verifica se eh criacao ou edicao de usuario quando o formulario eh submetido
		 * e chama a funcao correspondente a acao.
		 */
		$scope.submitFormUsuario = function() {
			if($scope.ehEdicao) {
				alterar();
			}else {
				criar();
			}
		}



		/**
		 * Carrega o combobox empresa sempre que um novo bloco bpo eh adicionado no formulario.
		 * 
		 * @param {Number} listaEmpresaIndex index do bloco bpo.
		 * @param {Number} idGrupoEmpresa id do grupo empresa para retornar apenas empresas desse grupo.
		 */
		$scope.carregarEmpresas = function(listaEmpresaIndex, idGrupoEmpresa) {
				 
			var empresa = {};
			
                        if(usuarioLogadoDetalhes.empresaList) {
                            var empresasLogado = usuarioLogadoDetalhes.empresaList.map(item => {
				return item.idEmpresa;
                            });
                        }

			var empresasSelecionadas = $scope.usuario.empresasTransportadoras.map(empresaTransportadora => {
				return empresaTransportadora.idGrupoEmpresa;
			});

			if(!idGrupoEmpresa && usuarioLogadoDetalhes.idPerfil !== 1 && usuarioLogadoDetalhes.idPerfil !== 6) {
				
				var filtered = usuarioLogadoDetalhes.empresasTransportadoras.map(empresaTransportadora => {
					
					return empresaTransportadora.idGrupoEmpresa;
					
				}).filter(grupoEmpresa => {
					
					return empresasSelecionadas.indexOf(grupoEmpresa) == -1;
					
				});

				idGrupoEmpresa = filtered.length > 0 ? filtered[0] : null;//usuarioLogadoDetalhes.empresasTransportadoras[0].idGrupoEmpresa;
				$scope.usuario.empresasTransportadoras[listaEmpresaIndex].idGrupoEmpresa = idGrupoEmpresa;
				
			}

			if(! idGrupoEmpresa){
				$scope.listaEmpresa[listaEmpresaIndex] = [];
				return;
			}

			empresa["idGrupoEconomico"] = idGrupoEmpresa;

			//caution: bugfix
			if ($scope.usuario.empresasTransportadoras) {
				var usuarioEmpresasAux = angular.copy($scope.usuario.empresasTransportadoras[listaEmpresaIndex].empresas);
			}
			//end caution: bugfix
            
			EmpresaService.pesquisarPorCriterios(empresa).then(
				function successCallback(res) {
					
					//caution: bugfix
					if(!$scope.ehEdicao && !$scope.usuario.empresasTransportadoras[listaEmpresaIndex].empresas) {
						$scope.usuario.empresasTransportadoras[listaEmpresaIndex].empresas = usuarioEmpresasAux;
					}
					//end caution: bugfix
                                    
					$scope.listaEmpresa[listaEmpresaIndex] = res.data;
					                                    
				},
				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.');
				}
			);
		}




		// usado na tela lista-usuario.html
		$scope.carregarEmpresasFiltro = function(idGrupoEmpresa) {
			var empresa = {
				idGrupoEconomico: idGrupoEmpresa
			};

			if(!idGrupoEmpresa) {
				$scope.listaEmpresa = [];
				return;
			}

			EmpresaService.pesquisarPorCriterios(empresa).then(
				function successCallback(res) {
					$scope.listaEmpresa = res.data;
				}, 

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' obter a lista de empresa. Favor, entrar em contato com o administrador do sistema.');
				}
			);
		}




		/**
		 * Cria um JSON de notificacao vazio no formato especifico para cada perfil.
		 * 
		 * 1 - administrador
		 * 2 - master transportadora
		 * 3 - master cliente
		 * 4 - operador transportadora
		 * 5 - operador cliente
		 * 6 - bpo
		 * 7 - master cliente cartao
		 * 8 - master cliente numerario
		 * 9 - operador cliente cartao
		 *10 - operador cliente numerario
		 *11 - master cliente venda numerario
		 *12 - operador cliente venda numerario
		 */
		$scope.selecionarNotificacaoInfoPerfil = function () {
			var perfil = $scope.usuario.idPerfil;

			$scope.listaEmpresa = [];
			$scope.usuario.empresasTransportadoras = [];

			switch (perfil) {
				case 2:
				case 4:
					inicializarTransportadora();
					break;
				case 3:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
					inicializarEmpresa();
					break;
			}
		}

		$scope.carregarUsuariosPorPagina = function(filtroUsuario) {
			UsuarioService.pesquisarPorCriteriosPagina(
				
				filtroUsuario, $scope.pag_paginaSelecionada-1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if(retorno.data.content == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}

					$scope.listaUsuario = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao = true;

				}, 

				function errorCallback(retorno) {
					$scope.showErrorMessage(UTF8.Nao+' foi '+UTF8.possivel+' efetuar a pesquisa. Favor, entrar em contato com o administrador do sistema.');
				}
				
			);
		}



		/**
		 * - Exibe a lista de notificacoes quando selecionado.
		 * - Desmarca todos os checkbox de notificacoes do index passado quando desmarcar o checkbox.
		 * 
		 * @param {number} index index da empresasTransportadoras para desmarcar receber notificacoes.
		 */
		$scope.receberNotificacoesChange = function(index) {

			if(!$scope.usuario.empresasTransportadoras[index].receberNotificacoes) {
				$scope.usuario.empresasTransportadoras[index].notificacoes = [];
			}
		}



		/**
		 * Adiciona um JSON de notificacao vazio.
		 * Somente alguns perfis podem adicionar varias notificacoes.
		 */
		$scope.adicionarEmpresaTransportadora = function() {
			inicializarEmpresa();
			carregarListaGrupoEmpresas($scope.usuario.empresasTransportadoras.length);
		}



		$scope.desativarBtnAdicionar = function() {
			var desativar = false;

			desativar = $scope.usuario.empresasTransportadoras.some(empresaTransportadora => {
				return empresaTransportadora.idGrupoEmpresa === '' || undefined === empresaTransportadora.empresas || empresaTransportadora.empresas.length === 0;
			});

			return desativar;
		}



		function configurarPaginacao() {
			$scope.pag_desabilitado = false;
			$scope.pag_tamanho = 5;
			$scope.pag_registrosPorPagina = 5;
			$scope.pag_totalRegistros = 0;
			$scope.pag_paginaSelecionada = 0;
		}
	}
);
