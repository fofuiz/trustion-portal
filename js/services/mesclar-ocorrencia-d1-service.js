angular.module('trustionPortal').factory('MesclarOcorrenciaD1Service',
    function ($http, EnvironmentService) {

        var URI_REST_API = EnvironmentService.getEnvironment() + "mesclad1";
        var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "mesclasd1";

        var service = {
            criar: criar,
            pesquisar: pesquisar,
            aprovar: aprovar,
            rejeitar: rejeitar,
            pesquisarMock: pesquisarMock,
            pesquisarAprovarMock: pesquisarAprovarMock,
            pesquisarMesclados: pesquisarMesclados
        }

        function criar(ocorrencia) {

            return $http.post(URI_REST_API, ocorrencia);

        }

        function aprovar(ocorrencia) {
            return $http.post(URI_REST_API + "/aprovar/" + ocorrencia.idOcorrencia);
        }

        function rejeitar(ocorrencia) {
            return $http.post(URI_REST_API + "/rejeitar/" + ocorrencia.idOcorrencia);
        }

        function pesquisar(ocorrencia) {
            return $http.get(URI_REST_API + "/" +ocorrencia.idOcorrencia);
        }

        function pesquisarMesclados(ocorrencia) {
            return $http.get(URI_REST_API_LIST + '/'+ocorrencia.idOcorrencia);
        }

        function pesquisarMock(ocorrencia) {
            //return $http.get(URI_REST_API_LIST, ocorrencia );
            return {
                data: [{
                    isOcorrenciaSelected: false,
                    idOcorrencia: 1,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditado: 800.00,
                    valorQuestionado: 0.00,
                    valorDeclarado: 700.00,
                    valorConferido: 600.00,
                    dataColeta: "2018-08-20 10:43:46",
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    idOcorrencia: 7,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditado: 800.00,
                    valorQuestionado: 0.00,
                    valorDeclarado: 700.00,
                    valorConferido: 650.00,
                    dataColeta: "2018-08-20 10:43:46",
                    statusConciliacao: "Não conciliado"
                }, {
                    isOcorrenciaSelected: false,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditado: 800.00,
                    valorQuestionado: 0.00,
                    valorDeclarado: 850.00,
                    valorConferido: 800.00,
                    dataColeta: "2018-08-20 10:43:46",
                    statusConciliacao: "Não conciliado"
                }]
            }
        }

        function pesquisarAprovarMock(ocorrencia) {
            //return $http.get(URI_REST_API_LIST, ocorrencia );
            return {
                obs: "obs",
                data: [{
                    isOcorrenciaSelected: false,
                    idOcorrencia: 1,
                    dataCredito: "2018-08-20 10:43:46",
                    valorCreditado: 800.00,
                    valorQuestionado: 100.00,
                    valorDeclarado: 700.00,
                    valorConferido: 600.00,
                    dataColeta: "2018-08-20 10:43:46",
                    statusConciliacao: "Não conciliado"
                }]
            }
        }

        return service;
    }
);
