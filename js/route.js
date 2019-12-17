angular.module('trustionPortal').config(
	function ($stateProvider, $urlRouterProvider) {

		$stateProvider

			.state('login', {
				url: '/login',
				views: {
					'partialLogin@': {
						templateUrl: 'partials/login.html',
						controller: 'LoginController'
					}
				}
			})

			.state('redefinirSenha', {
				parent: 'nav',
				url: '/redefinirSenha',
				views: {
					'partialRedefinicaoSenha@': {
						templateUrl: 'partials/seguranca/redefinicao-senha-primeiro-acesso.html',
						controller: 'RedefinicaoSenhaPrimeiroAcessoController'
					}
				}
			})

			.state('alterarSenha', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/seguranca/redefinicao-senha.html',
						controller: 'RedefinicaoSenhaController'
					}
				}
			})

			.state('esqueceuSenha', {
				parent: 'nav',
				url: '/esqueceuSenha',
				views: {
					'partialEsqueceuSenha@': {
						templateUrl: 'partials/seguranca/esqueceu-senha.html',
						controller: 'EsqueceuSenhaController'
					}
				}
			})

			.state('rodape', {
				abstract: true,
				url: '',
				views: {
					'partialRodape@': {
						templateUrl: 'partials/rodape.html'
					}
				}

			})

			.state('nav', {
				parent: 'rodape',
				url: '',
				views: {
					'partialNav@': {
						templateUrl: 'partials/nav.html',
						controller: 'NavController'
					}
				}

			})

			.state('menu', {
				parent: 'nav',
				url: '',
				views: {
					'partialMenu@': {
						templateUrl: 'partials/menu/menu.html',
						controller: 'MenuController'
					}
				}
			})

			.state('home', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/home/home.html',
						controller: 'HomeController'
					}
				}
			})

			.state('homeNumerario', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/home/home-numerario.html'
					}
				}
			})

			.state('homeCartao', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/home/home-cartao.html',
						controller: 'HomeCartaoController'
					}
				}
			})

			.state('listaUsuario', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/usuario/lista-usuario.html',
						controller: 'UsuarioController'
					}
				}
			})

			.state('cadastroUsuario', {
				parent: 'menu',
				url: '?idUsuario',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/usuario/cadastro-usuario.html',
						controller: 'UsuarioController'
					}
				}
			})

			.state('listaTipoMotivoConclusao', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/motivoconclusao/lista-motivo-conclusao.html',
						controller: 'MotivoConclusaoController'
					}
				}
			})

			.state('cadastroMotivoConclusao', {
				parent: 'menu',
				url: '?idMotivoConclusao',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/motivoconclusao/cadastro-motivo-conclusao.html',
						controller: 'MotivoConclusaoController'
					}
				}
			})

			.state('listaTransportadora', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/transportadora/lista-transportadora.html',
						controller: 'TransportadoraController'
					}
				}
			})

			.state('novaTransportadora', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/transportadora/nova-transportadora.html',
						controller: 'TransportadoraController'
					}
				}
			})

			.state('alteraTransportadora', {
				parent: 'menu',
				url: '?idTransportadora',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/transportadora/altera-transportadora.html',
						controller: 'TransportadoraController'
					}
				}
			})

			.state('listaGrupoEconomico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/grupoeconomico/lista-grupo-economico.html',
						controller: 'GrupoEconomicoController'
					}
				}
			})

			.state('novoGrupoEconomico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/grupoeconomico/novo-grupo-economico.html',
						controller: 'GrupoEconomicoController'
					}
				}
			})

			.state('alteraGrupoEconomico', {
				parent: 'menu',
				url: '?grupoId',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/grupoeconomico/altera-grupo-economico.html',
						controller: 'GrupoEconomicoController'
					}
				}
			})

			.state('listaEmpresa', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/empresa/lista-empresa.html',
						controller: 'EmpresaController'
					}
				}
			})

			.state('novoEmpresa', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/empresa/novo-empresa.html',
						controller: 'EmpresaController'
					}
				}
			})

			.state('alteraEmpresa', {
				parent: 'menu',
				url: '?empresaId',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/empresa/altera-empresa.html',
						controller: 'EmpresaController'
					}
				}
			})

			.state('listaAuditoria', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/auditoria/lista-auditoria.html',
						controller: 'AuditoriaController'
					}
				}
			})

			.state('listaTipoServico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/tipoServico/lista-tipo-servico.html',
						controller: 'TipoServicoController'
					}
				}
			})

			.state('novoTipoServico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/tipoServico/novo-tipo-servico.html',
						controller: 'TipoServicoController'
					}
				}
			})

			.state('alteraTipoServico', {
				parent: 'menu',
				url: '?idTipoServico',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/tipoServico/altera-tipo-servico.html',
						controller: 'TipoServicoController'
					}
				}
			})

			.state('relatorioAnaliticoCreditos', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/relatorioanaliticocreditos/relatorio-analitico-creditos.html',
						controller: 'RelatorioAnaliticoCreditosController'
					}
				}
			})

			.state('relatorioAnaliticoCreditosD1', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/relatorioanaliticocreditosd1/relatorio-analitico-creditos-d1.html',
						controller: 'RelatorioAnaliticoCreditosD1Controller'
					}
				}
			})

			.state('relatorioAnaliticoExtrato', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/relatorioanaliticoextrato/relatorio-analitico-extrato.html',
						controller: 'RelatorioAnaliticoExtratoController'
					}
				}
			})

			.state('listaModeloNegocio', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/modelonegocio/lista-modelo-negocio.html',
						controller: 'ModeloNegocioController'
					}
				}
			})

			.state('novoModeloNegocio', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/modelonegocio/novo-modelo-negocio.html',
						controller: 'ModeloNegocioController'
					}
				}
			})

			.state('alteraModeloNegocio', {
				parent: 'menu',
				url: '?modeloId',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/modelonegocio/altera-modelo-negocio.html',
						controller: 'ModeloNegocioController'
					}
				}
			})

			.state('listaNotificacao', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/notificacao/lista-notificacao.html',
						controller: 'NotificacaoController'
					}
				}
			})

			.state('novoNotificacao', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/notificacao/novo-notificacao.html',
						controller: 'NotificacaoController'
					}
				}
			})

			.state('alteraNotificacao', {
				parent: 'menu',
				url: '?idNotificacao',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/notificacao/altera-notificacao.html',
						controller: 'NotificacaoController'
					}
				}
			})

			.state('listaCofre', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cofre/lista-cofre.html',
						controller: 'CofreController'
					}
				}
			})

			.state('novoCofre', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cofre/novo-cofre.html',
						controller: 'CofreController'
					}
				}
			})

			.state('alteraCofre', {
				parent: 'menu',
				url: '?idCofre',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cofre/altera-cofre.html',
						controller: 'CofreController'
					}
				}
			})

			.state('listaDeposito', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/deposito/lista-deposito.html',
						controller: 'DepositoController'
					}
				}
			})

			.state('conciliacaoVendasNumerario', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/conciliacaoVendasNumerario/relatorio-conciliacao-vendas-numerario.html',
						controller: 'RelatorioConciliacaoVendasNumerario'
					}
				}
			})

			.state('listaOcorrencia', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/ocorrencia/lista-ocorrencia.html',
						controller: 'OcorrenciaController'
					}
				}
			})

			.state('listaOcorrencias', {
				parent: 'menu',
				url: '?idOcorrencia',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/ocorrencia/ocorrencia.html',
						controller: 'OcorrenciaController'
					}
				}
			})

			.state('listaLogApi', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/logapi/lista-log-api.html',
						controller: 'LogApiController'
					}
				}
			})

			.state('listaStringHistorico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/stringhistorico/lista-string-historico.html',
						controller: 'StringHistoricoController'
					}
				}
			})

			.state('novoStringHistorico', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/stringhistorico/novo-string-historico.html',
						controller: 'StringHistoricoController'
					}
				}
			})

			.state('alteraStringHistorico', {
				parent: 'menu',
				url: '?idStringHistorico',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/stringhistorico/altera-string-historico.html',
						controller: 'StringHistoricoController'
					}
				}
			})

			.state('vendas', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/vendas/vendas.html',
						controller: 'VendasController'
					}
				}
			})

			.state('vendasDetalhe', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/vendas/vendas-detalhe.html',
						controller: 'VendasDetalheController'
					}
				}
			})

			.state('recebimentos', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/recebimentos/recebimentos.html',
						controller: 'RecebimentosController'
					}
				}
			})

			.state('recebimentosFuturos', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/recebimentosfuturos/recebimentos-futuros.html',
						controller: 'RecebimentosFuturosController'
					}
				}
			})

			.state('conciliacaoVendasOperadora', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/conciliacaovendas/conciliacao-vendas-operadora.html',
						controller: 'ConciliacaoVendas'
					}
				}
			})

			.state('conciliacaoVendasLoja', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/conciliacaovendas/conciliacao-vendas-loja.html',
						controller: 'ConciliacaoVendas'
					}
				}
			})

			.state('ajuste', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/ajuste/ajuste.html',
						controller: 'AjusteController'
					}
				}
			})

			.state('recebimentosDetalhe', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/recebimentos/recebimentos-detalhe.html',
						controller: 'RecebimentosDetalheController'
					}
				}
			})

			.state('relatorioConsolidado', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/transacao/transacao.html',
						controller: 'TransacaoController'
					}
				}
			})

			.state('periodoResumoCartao', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/periodo/periodo-resumo-cartoes.html',
						controller: 'PeriodoResumoCartoesController'
					}
				}
			})

			.state('periodoResumoNumerario', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/periodo/periodo-resumo-numerarios.html',
						controller: 'PeriodoResumoNumerariosController'
					}
				}
			})

			.state('taxasAdministrativas', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/consolidacao/taxas-administrativas.html',
						controller: 'TaxasAdministrativasController'
					}
				}
			})


			.state('taxasAdministrativasCadastro', {
				parent: 'menu',
				url: 'taxasAdministrativasCadastro',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/consolidacao/taxas-administrativas-cadastro.html',
						controller: 'TaxasAdministrativasCadastroController'
					}
				}
			})

			.state('taxasAntecipacao', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/consolidacao/taxas-antecipacao.html'/*,
					controller: 'PeriodoResumoCartoesController'*/
					}
				}
			})

			.state('aluguelEquipamentos', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/consolidacao/aluguel-equipamentos.html',
						controller: 'AluguelEquipamentosController'
					}
				}
			})

			.state('registrosNaoProcessados', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/consolidacao/registros-nao-processados.html',
						controller: 'RegistrosNaoProcessadosController'
					}
				}
			})

			.state('gestaoVendas', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/conciliacaovendas/gestao-vendas.html',
						controller: 'GestaoVendasController'
					}
				}
			})

			.state('conciliacaoResumo', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cartao/conciliacao-resumo.html',
						controller: 'ConciliacaoCartaoResumoController'
					}
				}
			})

			.state('conciliacaoCartaoDetalhe', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cartao/conciliacao-detalhada.html',
						controller: 'ConciliacaoCartaoDetalheController'
					}
				}
			})

			.state('conciliacaoConsultarDomBancario', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/domicilioBancario/consulta-domicilio-bancario.html',
						controller: 'DomicilioBancarioCtrl'
					}
				}
			})

			.state('conciliacaoConsultarRegraClienteAdquirente', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/regraclienteadquirente/regra-cliente-adquirente.html',
						controller: 'regraClienteAdquirenteCtrl'
					}
				}
			})

			.state('novaConciliacaoManual', {
				parent: 'menu',
				url: '?volta',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/novaconciliacao/nova-conciliacao-manual.html',
						controller: 'NovaConciliacaoManualController'
					}
				}
			})

			.state('conciliacaoDetalhe', {
				parent: 'menu',
				url: '?numBanco?numAg?numConta?codOperadora?dataExtratoPagamentoReferencia?origemRequisicao',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/cartao/conciliacao-detalhada.html',
						controller: 'ConciliacaoCartaoDetalheController'
					}
				}
			})

			.state('listaCategoria', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/categoria/lista-categoria.html',
						controller: 'CategoriaController'
					}
				}
			})

			.state('novaCategoria', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/categoria/nova-categoria.html',
						controller: 'CategoriaController'
					}
				}
			})

			.state('alteraCategoria', {
				parent: 'menu',
				url: '?idCategoria',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/categoria/altera-categoria.html',
						controller: 'CategoriaController'
					}
				}
			})

			.state('listaTipoQuestionamento', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/tipoquestionamento/lista-tipo-questionamento.html',
						controller: 'TipoQuestionamento'
					}
				}
			})

			.state('cadastroTipoQuestionamento', {
				parent: 'menu',
				url: '?idTipoQuestionamento',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/tipoquestionamento/cadastro-tipo-questionamento.html',
						controller: 'TipoQuestionamento'
					}
				}
			})

			.state('cadastrarVideos', {
				parent: 'menu',
				url: '?numeroGTV',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/video/cadastrar-video.html',
						controller: 'CadastrarVideoController'
					}
				}
			})

			.state('relatorioDescritivoCartoes', {
				parent: 'menu',
				url: '',
				views: {
					'partialConteudo@': {
						templateUrl: 'partials/relatorioDescritivoCartoes/relatorio-descritivo-cartoes.html',
						controller: 'RelatorioDescritivoCartoesController'
					}
				}
			});

	}
);
