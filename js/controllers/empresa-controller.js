angular.module('trustionPortal').controller('EmpresaController', function ($http,$scope, $state, $stateParams, $rootScope, $q, $timeout, EmpresaService, CacheService, GrupoEconomicoService, ModeloNegocioService, ListaBancoService, UTF8, TrustionHelpers) {

	$scope.listaGrupoEconomico = [];
	$scope.filtroEmpresaPage = {};
	$scope.lstStatus = [];
	$scope.dadosBancarios = [];
	$scope.ListaBanco = [];
	$scope.empresas = [];

	var usuarioLogado = CacheService.usuario.data
	var reader = new FileReader();

	reader.onload = function () {
		$scope.fileContent = reader.result;
		$scope.$apply();
	}

	

	configurarPaginacao();
	loadPage();

	function loadPage() {
		$scope.hideMessage();
		pesquisarBancos();
		$scope.lstStatus = ["Ativo", "Inativo"];

		var grupo = {}
		grupo.idUsuarioCriacao = usuarioLogado.principal.idUsuario;


		//carrega os segmentos de mercado
		EmpresaService.listarSegmentosMercado().then(function success(response){
			$scope.segmentosMercado = response.data;
		});

		GrupoEconomicoService
			.listaPorPerfilUsuario(usuarioLogado.principal.idPerfil)
			.then(
				function successCallback(res) {
					$scope.listaGrupoEconomico = res.data;
				},

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de grupo de empresa. Favor entrar em contato com o administrador do sistema.');
				}
			);
		carregarTodosModelosNegocios ();
	}
	//VERIFICANDO SE É UPDATE
	if ($stateParams.empresaId) {
		EmpresaService.pesquisarPorId($stateParams.empresaId).then(

			function successCallback(res) {
				pesquisarBancos();

				empresaModeloNegociosAux = [];
				if(res.data.empresaModeloNegocios) {
					res.data.empresaModeloNegocios.forEach(idModelo => {
						empresaModeloNegociosAux.push(idModelo.idModeloNegocio);
					});
				}
				$scope.id = res.data.idEmpresa;
				$scope.razaoSocial = res.data.razaoSocial;
				$scope.cnpj = res.data.cnpj;
				$scope.idGrupoEconomico = res.data.idGrupoEconomico;
				$scope.idModeloNegocio = empresaModeloNegociosAux;
				$scope.segmentoMercado = res.data.idEmpresaSegmento;
				$scope.endereco = res.data.endereco;
				$scope.cidade = res.data.cidade;
				$scope.estado = res.data.estado;
				$scope.cep = res.data.cep;
				$scope.status = res.data.status;
				$scope.dataCriacao = res.data.dataCriacao;
				$scope.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
				$scope.dadosBancarios = res.data.dadosBancarios;
				$scope.siglaLoja = res.data.siglaLoja;
				carregarTodosModelosNegocios();
			},
			function errorCallback(res) {
				$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
			}
		);
	}

	//---------------------------------------PESQUISAR
	$scope.pesquisarPorCriterios = function () {

		var empresa = {};
		empresa.razaoSocial = $scope.razaoSocial;
		empresa.cnpj = $scope.cnpj;

		if($scope.idModeloNegocio){
			empresa.empresaModeloNegocios = [];
			empresa.empresaModeloNegocios.push({"idModeloNegocio": $scope.idModeloNegocio});
		}

		empresa.idGrupoEconomico = $scope.idGrupoEconomico;
		empresa.status = $scope.status;
		$scope.hideMessage();
		$scope.pag_paginaSelecionada = 1;
		$scope.filtroEmpresaPage = angular.copy(empresa);
		$scope.carregarEmpresasPorPagina($scope.filtroEmpresaPage);
	}

	/**
	 * Adiciona os dados da conta no array de contas da empresa.
	 */
	$scope.addConta = function () {

		if(validarConta()) {
			
			if(!$scope.dadosBancarios) {
				$scope.dadosBancarios = [];
			}

			$scope.dadosBancarios.push({ "idBanco": $scope.banco.codigoBanco, "descricao": $scope.banco.descricao, "agencia": $scope.agencia, "conta": $scope.conta, "dv": $scope.dv });
			$scope.agencia = '';
			$scope.conta = '';
			$scope.dv = '';
		}
	}

	var empresasNaoSalvas = [];
	var salvouEmpresas = false;
	/**
	 * Chama o servico de cadastrar empresa para cada empresa que estah no array.
	 * A empresa que nao for criada eh coloca em um array contendo as empresas que nao foram criadas.
	 * 
	 * @param {Array} arraySalvar Array com as empresas para salvar.
	 */
	function salvarEmpresas(arraySalvar) {
		var empresaSalvar;
		salvouEmpresas = false;

		if(arraySalvar.length === 0 ) {
			salvouEmpresas = true;
			return;
		}

		empresaSalvar = arraySalvar.shift();

		EmpresaService.cadastra(empresaSalvar).then(function successCallback(res) {
			salvarEmpresas(arraySalvar);

		},function errorCallback(res) {
			empresasNaoSalvas.push(empresaSalvar);
			salvarEmpresas(arraySalvar);
		});
	}

	/**
	 * Fica verificando se terminou de salvar todas as empresas do array.
	 */
	function finalizaSalvarEmpresas() {
		var salvouEmpresasAux = salvouEmpresas;

		$timeout(function() {

			if (salvouEmpresasAux) {
				atualizarFormularioEmpresas();
			} else {
				finalizaSalvarEmpresas();
			}

		}, 600);
	}

	/**
	 * Atualiza as informacoes na tela.
	 * - Se todas as empresas do array foram salvas, limpa o array de empresas e o formulario.
	 * - Se alguma empresa nao foi criada, exibe a lista das empresas que nao foram criadas.
	 */
	function atualizarFormularioEmpresas() {

		if(empresasNaoSalvas.length > 0) {
			$scope.showErrorMessage( empresasNaoSalvas.length + ' empresas não foram salvas.');

			empresasNaoSalvas.forEach(empresaNaoSalva => {
				var idModeloNegocioAux = [];

				empresaNaoSalva.empresaModeloNegocios.forEach(modeloNeg => {
					idModeloNegocioAux.push(modeloNeg.idModeloNegocio);
				});

				empresaNaoSalva.idModeloNegocio = idModeloNegocioAux;
				delete empresaNaoSalva['empresaModeloNegocios'];
			});

			$scope.empresas = [];
			$scope.empresas = empresasNaoSalvas;
			$scope.falhaSalvarEmpresa = true;
		}

		if(!empresasNaoSalvas || empresasNaoSalvas.length === 0) {
			$scope.showSuccessMessage('Empresa(s) criada(s) com sucesso!');
			$scope.falhaSalvarEmpresa = false;
			$scope.limpaEmpresa();
			$scope.empresas = [];
			var recarregar = true;
			$rootScope.$emit('reloadMenuRelatorio', recarregar);
		}
	}

	/**
	 * Pega cada empresa que estah no array de empresas para ser criadas e chama o servico de criar empresa.
	 */
	$scope.cadastraEmpresa = function () {
		var empresasSalvar = [];
		empresasNaoSalvas = [];
		if(!$scope.empresas || $scope.empresas.length === 0) {
			$scope.showErrorMessage('Por favor, adicione pelo menos uma empresa, clicando em Adicionar/Atualizar, antes de salvar.');
			return ;
		}

		empresasSalvar = angular.copy($scope.empresas);

		empresasSalvar.forEach(empresaAux => {
			empresaAux.empresaModeloNegocios = formatarEmpresaModeloNegocios(empresaAux.idModeloNegocio);
			empresaAux.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;
			delete empresaAux['idModeloNegocio'];
		});

		salvarEmpresas(empresasSalvar);
		finalizaSalvarEmpresas();
	}

	//---------------------------------------ALTERAR
	$scope.alterarEmpresa = function () {
		var dadosConta = { "banco": $scope.banco, "agencia": $scope.agencia, "conta": $scope.conta, "dv": $scope.dv };
		$scope.hideMessage();

		if (null == dadosConta.banco  || typeof dadosConta.banco == 'undefined' || dadosConta.banco.codigoBanco == '' ) {

			if ($scope.dadosBancarios.length === 0) {
				$scope.showErrorMessage('Favor selecionar banco.');
				return;
			}
		}

		if (typeof dadosConta.agencia == 'undefined' || dadosConta.agencia == '') {

			if ($scope.dadosBancarios.length === 0) {
				$scope.showErrorMessage('Favor preencher agência.');
				return;
			}
		}

		if (typeof dadosConta.conta == 'undefined' || dadosConta.conta == '') {

			if ($scope.dadosBancarios.length === 0) {
				$scope.showErrorMessage('Favor preencher conta.');
				return;
			}
		}

		if (typeof dadosConta.dv == 'undefined' || dadosConta.dv == '') {
			
			if ($scope.dadosBancarios.length === 0) {
				$scope.showErrorMessage('Favor preencher os dados ' + UTF8.bancario + 's corretamente.');
				return;
			}
		}
		//TODO ARRUMAR QUANDO O BANCO FOR UNDEFINED'
		if ($scope.dadosBancarios.length > 0) {
			if (!(dadosConta.banco == null || dadosConta.banco == undefined || dadosConta.agencia == "" || dadosConta.conta == "" || dadosConta.dv == "")) {
				$scope.dadosBancarios.push({ "idBanco": $scope.banco.codigoBanco, "descricao": $scope.banco.descricao, "agencia": $scope.agencia, "conta": $scope.conta, "dv": $scope.dv });
			}
		}

		if ($scope.dadosBancarios.length == 0 && (dadosConta.banco != null || dadosConta.banco == undefined || dadosConta.agencia != "" || dadosConta.conta != "" || dadosConta.dv != "")) {
			$scope.dadosBancarios.push({ "idBanco": $scope.banco.codigoBanco, "descricao": $scope.banco.descricao, "agencia": $scope.agencia, "conta": $scope.conta, "dv": $scope.dv });
		}

		$scope.agencia = '';
		$scope.conta = '';
		$scope.dv = '';
		if ($scope.frmAlteraEmpresa.$valid) {

			var empresaJson = $scope.popularEmpresa($scope);
			empresaJson.idEmpresa = $scope.id;
			empresaJson.idUsuarioCriacao = CacheService.usuario.data.principal.idUsuario;

			EmpresaService.altera(empresaJson)
				.then(
					function successCallback(res) {
						$scope.showSuccessMessage('Empresa alterada com sucesso!');
					},
					function errorCallback(res) {
						$scope.showErrorMessage(res.data.mensagem);
					}
				);

		} else {
			
			if ($scope.razaoSocial == undefined
				|| $scope.razaoSocial == '') {
				$scope.showErrorMessage('Favor preencher a ' + UTF8.Razao + ' Social');
				return;
			}

			if ($scope.cnpj == undefined || $scope.cnpj == '') {
				$scope.showErrorMessage('Favor preencher o CNPJ');
				return;
			}
			if ($scope.idModeloNegocio == undefined
				|| $scope.idModeloNegocio == '') {
				$scope.showErrorMessage('Favor escolher o Modelo de ' + UTF8.Negocio);
				return;
			}
			if ($scope.idGrupoEconomico == undefined
				|| $scope.idGrupoEconomico == '') {
				$scope.showErrorMessage('Favor escolher o Grupo ' + UTF8.Economico);
				return;
			}
			if ($scope.status == undefined || $scope.status == '') {
				$scope.showErrorMessage('Favor escolher o Status');
				return;
			}
		}

	}

	//---------------------------------------LIMPAR
	$scope.limpaEmpresa = function (empresa) {
		$scope.limpaCamposEmpresa();
		$scope.idModeloNegocio = null;
		$scope.idGrupoEconomico = null;
		$scope.modeloNegocio = null;
		
	}

	$scope.limpaCamposEmpresa = function () {
		$scope.razaoSocial = null;
		$scope.cnpj = null;
		$scope.siglaLoja = null;
	    $scope.segmentoMercado = null;
		$scope.endereco = null;
		$scope.cidade = null;
		$scope.estado = null;
		$scope.cep = null;
		$scope.status = null;
		$scope.dadosBancarios = [];
		$scope.banco = null;
		$scope.agencia = null;
		$scope.conta = null;
		$scope.dv = null;
	}	

	//---------------------------------------POPULAR
	$scope.popularEmpresa = function ($scope) {
		var empresa = {}
		empresa.razaoSocial = $scope.razaoSocial;
		empresa.cnpj = $scope.cnpj;
		empresa.idGrupoEconomico = $scope.idGrupoEconomico;
		empresa.empresaModeloNegocios = formatarEmpresaModeloNegocios($scope.idModeloNegocio);
		empresa.idEmpresaSegmento = $scope.segmentoMercado;
		empresa.siglaLoja = $scope.siglaLoja;
		empresa.endereco = $scope.endereco;
		empresa.cidade = $scope.cidade;
		empresa.estado = $scope.estado;
		empresa.cep = $scope.cep;
		empresa.status = $scope.status;
		empresa.dadosBancarios = $scope.dadosBancarios;

		return empresa;
	}

	function formatarEmpresaModeloNegocios(idsModelosNegocios) {
		var modeloNegocioAux = {};
		var idsModelosNegociosAux = [];

		idsModelosNegocios.forEach(idModelo => {
			modeloNegocioAux = {};
			modeloNegocioAux.idModeloNegocio = idModelo;
			idsModelosNegociosAux.push(modeloNegocioAux);
		});

		return idsModelosNegociosAux;
	}

	$scope.carregarEmpresasPorPagina = function (filtroTipoEmpresaParam) {

		EmpresaService.pesquisarPorCriteriosPagina(
			filtroTipoEmpresaParam, $scope.pag_paginaSelecionada - 1, $scope.pag_registrosPorPagina).then(

				function successCallback(retorno) {

					if (retorno.data == '') {
						$scope.showErrorMessage('Nenhum registro encontrado.');
					}

					$scope.listaEmpresa = retorno.data.content;
					$scope.pag_totalRegistros = retorno.data.totalElements;
					$scope.paginacao = true;

				},

				function errorCallback(retorno) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' efetuar a pesquisa. Favor entrar em contato com o administrador do sistema.');
				}
			);
	}

	$scope.exibirCamposEmpresa = function() {
		$scope.exibirCamposIncluirEmpresa = !$scope.exibirCamposIncluirEmpresa;
		$scope.limpaCamposEmpresa();
	}

	/**
	 * Popula o formulario com os campos da empresa com os dados da empresa clicada para editar.
	 * 
	 * @param {JSON} empresa 
	 */
	$scope.editarEmpresa = function(empresa) {
		empresa = angular.copy(empresa);
		$scope.idGrupoEconomico = empresa.idGrupoEconomico;
		$scope.idModeloNegocio = empresa.idModeloNegocio;
		$scope.razaoSocial = empresa.razaoSocial;
		$scope.cnpj = empresa.cnpj;
		$scope.siglaLoja = empresa.siglaLoja;
		$scope.segmentoMercado = empresa.segmentoMercado;
		$scope.endereco = empresa.endereco;
		$scope.cidade = empresa.cidade;
		$scope.estado = empresa.estado;
		$scope.cep = empresa.cep;
		$scope.status = empresa.status;
		$scope.dadosBancarios = empresa.dadosBancarios;
		$scope.exibirCamposIncluirEmpresa = true;
	}

	/**
	 * Remove a empresa da tabela de empresas.
	 * 
	 * @param {string} cnpj 
	 */
	$scope.removerEmpresa = function(cnpj) {
		$scope.empresas = $scope.empresas.filter(empresa => {
			return empresa.cnpj != cnpj;
		});
		if($scope.empresas.length === 0) {
			$scope.falhaSalvarEmpresa = false;
		}
		$scope.showMessage('info', 'Empresa removida da lista');
	}

	/**
	 * Adiciona a empresa no array de empresas.
	 */
	$scope.adicionarEmpresa = function() {
		var empresa = {};

		if(!validarFormularioEmpresa()) {
			return;
		}

		empresa.idGrupoEconomico = $scope.idGrupoEconomico; //grupo de empresa
		empresa.idModeloNegocio = $scope.idModeloNegocio;
		empresa.razaoSocial = $scope.razaoSocial;
		empresa.cnpj = $scope.cnpj;
		empresa.siglaLoja = $scope.siglaLoja;
		empresa.segmentoMercado = $scope.segmentoMercado;
		empresa.endereco = $scope.endereco;
		empresa.cidade = $scope.cidade;
		empresa.estado = $scope.estado;
		empresa.cep = $scope.cep;
		empresa.status = $scope.status;
		empresa.dadosBancarios = $scope.dadosBancarios;

		/**
		 * Valida a empresa
		 */
		EmpresaService.valida(empresa).then(function successCallback(res) {

			var temEmpresa = $scope.empresas.some(function (empresaAux) {
				return empresaAux.cnpj == empresa.cnpj;
			});
	
			if (temEmpresa) {
				// atualiza a empresa
				$scope.empresas.forEach((empresaAux, index) => {
					if(empresaAux.cnpj == empresa.cnpj) {
						$scope.empresas[index] = empresa
					}
				});
	
				$scope.showMessage('info', 'Empresa atualizada, lembre-se de clicar em "Salvar" para salvar as empresas que estão na lista.');
			} else {
				// adiciona a empresa
				$scope.empresas.push(empresa);
				$scope.showMessage('info', 'Empresa adicionada, lembre-se de clicar em "Salvar" para salvar as empresas que estão na lista.');
				$scope.exibirCamposIncluirEmpresa = false;
			}

		},function errorCallback(res) {
			$scope.showErrorMessage(res.data.mensagem);
			return;
		});
	}

	/**
	 * Valida as informacoes da conta.
	 */
	function validarConta() {
		var dadosConta = { "banco": $scope.banco, "agencia": $scope.agencia, "conta": $scope.conta, "dv": $scope.dv };

		if(!dadosConta.banco) {
			$scope.showErrorMessage('Favor selecionar a banco');
			return false;
		}

		if(!dadosConta.agencia) {
			$scope.showErrorMessage('Favor preencher a agência.');
			return false;
		}

		if(!dadosConta.conta) {
			$scope.showErrorMessage('Favor preencher a conta');
			return false;
		}

		if(!dadosConta.dv) {
			$scope.showErrorMessage('Favor preencher o dígito.');
			return false;
		}

		return true;
	}

	function validarFormularioEmpresa() {
			
			if(!$scope.idGrupoEconomico) {
				$scope.showErrorMessage('Selecione um Grupo de Empresa.');
				return false;
			}

			if(!$scope.idModeloNegocio) {
				$scope.showErrorMessage('Selecione pelo menos um Modelo de ' + UTF8.Negocio + '.');
				return false;
			}

			if (!$scope.razaoSocial) {
				$scope.showErrorMessage('Favor preencher a ' + UTF8.Razao + ' Social');
				return false;
			}

			if (!$scope.cnpj) {
				$scope.showErrorMessage('Favor preencher o CNPJ');
				return false;
			}

			if (!$scope.status) {
				$scope.showErrorMessage('Favor escolher o Status');
				return false;
			}

			if(!$scope.dadosBancarios || $scope.dadosBancarios.length == 0) {
				$scope.showErrorMessage('Favor adicione pelo menos uma conta.');
				return false;
			}

			for(var i = 0; i < $scope.dadosBancarios.length; i++) {
				var dadoBancarioAux = $scope.dadosBancarios[i];

				if(!dadoBancarioAux.idBanco || !dadoBancarioAux.agencia || !dadoBancarioAux.conta || !dadoBancarioAux.dv) {
					$scope.showErrorMessage('Favor preencher os dados ' + UTF8.bancario + 's corretamente.');
					return false;
				}
			}

		return true;
	}

	/**
	 * Limpa o formulario dos campos da empresa.
	 */
	$scope.cancelar = function() {
		$scope.idGrupoEconomico = ''; //grupo de empresa
		$scope.idModeloNegocio = [];
		$scope.razaoSocial = '';
		$scope.cnpj = '';
		$scope.siglaLoja = '';
		$scope.segmentoMercado = '';
		$scope.endereco = '';
		$scope.cidade = '';
		$scope.estado = '';
		$scope.cep = '';
		$scope.status = '';
		$scope.dadosBancarios = [];
	}

	/**
	* Baixa o arquivo de template retornado pelo servico
	*/
	$scope.baixarTemplateCsv = function() {
		EmpresaService.getTemplateCsv().then(function success(response) {
			var responseHeaders = response.headers();
			nomeArquivo = pegarNomeArquivo(responseHeaders['content-disposition']);
			TrustionHelpers.saveTextAsFile(response.data, nomeArquivo);
		}, function error(response) {
			$scope.showErrorMessage('Falha ao fazer o download do arquivo.');
		});
	}

	$scope.uploadFile = function(files) {
		var fd = new FormData();
		fd.append("file", files[0]);
		fd.append("idGrupoEconomico", $scope.idGrupoEconomico);
		fd.append("idModeloNegocio", $scope.idModeloNegocio);

		EmpresaService.uploadCsv(fd).then(function success(response) {
			$scope.showSuccessMessage('Upload efetuado com sucesso!');
		}, function error(response) {
			$scope.showErrorMessage(response.data.mensagem);
		});
	
	};

	/*
	Carrega os modelos de negocios de acordo com o grupo de empresa selecionado.
	*/
	$scope.carregarModelosNegocios = function() {
		carregarModelosNegocios();
	}

	function carregarModelosNegocios () {
		if($scope.idGrupoEconomico) {
			ModeloNegocioService.listarPorGrupo($scope.idGrupoEconomico).then(
				function successCallback(res) {
					$scope.listaModelo = res.data;
				},

				function errorCallback(res) {
					$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de Modelo de ' + UTF8.Negocio + '. Favor entrar em contato com o administrador do sistema.');
				}
			);
		}
		else {
			carregarTodosModelosNegocios();
		}
	}

/*
	Carrega os modelos de negocios de acordo com o grupo de empresa selecionado.
	*/
	$scope.carregarTodosModelosNegocios = function() {
		carregarTodosModelosNegocios();
	}

	function carregarTodosModelosNegocios () {
		var modeloNegocio = {};
		ModeloNegocioService.listaPorCriterios(modeloNegocio).then(
			function successCallback(res) {
				$scope.listaModelo = res.data;
			},

			function errorCallback(res) {
				$scope.showErrorMessage(UTF8.Nao + ' foi ' + UTF8.possivel + ' obter a lista de Modelo de ' + UTF8.Negocio + '. Favor entrar em contato com o administrador do sistema.');
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

	function pesquisarBancos() {
		ListaBancoService.listarTodosBancos().then(
			function successCallback(res) {
				$scope.ListaBanco = res.data;
			}, function errorCallback(res) {
			}).finally();
	}

	function pegarNomeArquivo(nomeArquivo) {
		var nomeArquivoAux = nomeArquivo;
		var regex = /filename=.*/g;
		
		if(!nomeArquivoAux) {
			return nomeArquivoAux
		}

		nomeArquivoAux = nomeArquivoAux.match(regex);

		if(!nomeArquivoAux) {
			return nomeArquivoAux;
		}

		nomeArquivoAux = nomeArquivoAux[0].replace("filename=", "");

		return nomeArquivoAux;
	}
});
