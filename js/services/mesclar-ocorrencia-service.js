angular.module('trustionPortal').factory('MesclarOcorrenciaService',
    function ($http, EnvironmentService) {

        var URI_REST_API = EnvironmentService.getEnvironment() + "mescla";
        var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "mesclas";

        var service = {
            criar: criar,
            pesquisar: pesquisar,
            pesquisarMock: pesquisarMock,
            pesquisarMockAprovacao: pesquisarMockAprovacao,
            aprovar: aprovar,
            rejeitar: rejeitar,
            desfazer : desfazer,
            pesquisarMesclados: pesquisarMesclados
        }

        function criar(ocorrencia) {
            return $http.post(URI_REST_API, ocorrencia);
        }

        function desfazer(ocorrencia) {
            return $http.post(URI_REST_API +"/desfaz/", ocorrencia);
        }

        function aprovar(ocorrencia) {
            return $http.post(URI_REST_API + "/aprovar/" + ocorrencia.idOcorrencia);
        }

        function rejeitar(ocorrencia) {
            return $http.post(URI_REST_API + "/rejeitar/" + ocorrencia.idOcorrencia);
        }

        function pesquisar(ocorrencia) {
            return $http.get(URI_REST_API + '/'+ocorrencia.idOcorrencia);
        }

        function pesquisarMesclados(ocorrencia) {
            return $http.get(URI_REST_API_LIST + '/'+ocorrencia.idOcorrencia);
        }


        function pesquisarMock() {
            return {
                data: [{
                    isOcorrenciaSelected: false,
                    idOcorrencia: 1,
                    valorRegistradoCofre: 700.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 500.00,
                    valorQuestionado: 0.00,
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 7,
                    valorRegistradoCofre: 4700.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 4500.00,
                    valorQuestionado: 0.00,
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 5,
                    valorRegistradoCofre: 3500.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 3000.00,
                    valorQuestionado: 0.00,
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 77,
                    valorRegistradoCofre: 3500.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 3000.00,
                    valorQuestionado: 0.00,
                    statusConciliacao: "Não conciliado"
                }]
            }
        }

        function pesquisarMockAprovacao() {
            return {
                obs: "obs",
                data: [{
                    isOcorrenciaSelected: false,
                    idOcorrencia: 1,
                    valorRegistradoCofre: 700.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 500.00,
                    valorQuestionado: 200.00,
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 7,
                    valorRegistradoCofre: 4700.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 4500.00,
                    valorQuestionado: 200.00,
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 5,
                    valorRegistradoCofre: 3000.00,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditadoConta: 3500.00,
                    valorQuestionado: 430.00,
                    statusConciliacao: "Não conciliado"
                }]

            }
        }

        return service;
    }
);
