angular.module('trustionPortal').factory('VendasService', function($http){

    var service = {
        totalVendasPorOperadoraPeriodo: totalVendasPorOperadoraPeriodo,
        totalVendasPorProdutoPeriodo: totalVendasPorProdutoPeriodo,
        detalheTotalVendasProdutoPeriodo: detalheTotalVendasProdutoPeriodo,
        detalheVendasGrid: detalheVendasGrid
    };

    function totalVendasPorOperadoraPeriodo() {
        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    total: 4303.98
                },
                {
                    id: 2,
                    operadora: "Rede",
                    total: 9044.00
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    total: 3023.09
                },
                {
                    id: 4,
                    operadora: "Elo",
                    total: 4324.32
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    total: 1090.09
                }
            ]
        }
    }

    function totalVendasPorProdutoPeriodo(){

        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "AMEX",
                    total: 4303.98,
                    cvs: 89,
                    ticket: 48.36
                },
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "Visa",
                    total: 9044.00,
                    cvs: 214,
                    ticket: 42.26
                },
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "Visa Electron",
                    total: 3023.09,
                    cvs: 72,
                    ticket: 41.99
                },
                {
                    id: 2,
                    operadora: "Rede",
                    bandeira: "Visa",
                    total: 9044.00,
                    cvs: 310,
                    ticket: 29.17
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    bandeira: "Sodexo",
                    total: 3023.09,
                    cvs: 412,
                    ticket: 7.33
                },
                {
                    id: 4,
                    operadora: "Elo",
                    bandeira: "Mastercard",
                    total: 4324.32,
                    cvs: 213,
                    ticket: 20.30
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    bandeira: "Diners",
                    total: 1090.09,
                    cvs: 65,
                    ticket: 16.77
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    bandeira: "Mastercard",
                    total: 9044.00,
                    cvs: 1322,
                    ticket: 6.84
                }
            ]
        }

        /*if(idBusca === 1){
            return {
                data:[{nome: "AMEX", total: 4303.98}, {nome: "Visa", total: 9044.00}, {nome: "Visa Electron", total: 3023.09}]
            }
        }else if(idBusca === 3){
            return {
                data:[{nome: "Sodexo", total: 3023.09}]
            }
        }else if(idBusca === 4){
            return {
                data:[{nome: "Mastercard", total: 4324.32}]
            }
        }else if(idBusca === 5){
            return {
                data:[{nome: "Diners", total: 4303.98}, {nome: "Mastercard", total: 9044.00}]
            }
        }else{
            return "";
        }*/
    }

    function detalheTotalVendasProdutoPeriodo(idOperadora){

        if(idOperadora == 1){
            return {
                data: [
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "AMEX",
                        total: 4303.98,
                        cvs: 89,
                        ticket: 48.36
                    },
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "Visa",
                        total: 9044.00,
                        cvs: 214,
                        ticket: 42.26
                    },
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "Visa Electron",
                        total: 3023.09,
                        cvs: 72,
                        ticket: 41.99
                    }
                ]
            }
        }else if(idOperadora == 2){
            return {
                data: [
                    {
                        id: 2,
                        operadora: "Rede",
                        bandeira: "Visa",
                        total: 9044.00,
                        cvs: 310,
                        ticket: 29.17
                    }
                ]
            }
        }else if(idOperadora == 3){
            return {
                data: [
                    {
                        id: 3,
                        operadora: "Sodexo",
                        bandeira: "Sodexo",
                        total: 3023.09,
                        cvs: 412,
                        ticket: 7.33
                    }
                ]
            }
        }else if(idOperadora == 4){
            return {
                data: [
                    {
                        id: 4,
                        operadora: "Elo",
                        bandeira: "Mastercard",
                        total: 4324.32,
                        cvs: 213,
                        ticket: 20.30
                    }
                ]
            }
        }else if(idOperadora == 5){
            return {
                data: [
                    {
                        id: 5,
                        operadora: "Elavon",
                        bandeira: "Diners",
                        total: 1090.09,
                        cvs: 65,
                        ticket: 16.77
                    },
                    {
                        id: 5,
                        operadora: "Elavon",
                        bandeira: "Mastercard",
                        total: 9044.00,
                        cvs: 1322,
                        ticket: 6.84
                    }
                ]
            }
        }else{
            return null;
        }
    }

    function detalheVendasGrid(){
        return {
            data: [
                {
                    "nro_nsu":15063,
                    "cod_autorizacao":"090839",
                    "vlr_bruto":54.21,
                    "vlr_liquido":52.35,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":1.86,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":1,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341880,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180220,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":16259,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2BGL9B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"B8CEF50E724A4725859FA12F6A72F068",
                    "nro_logico_terminal":"11716993",
                    "cod_arquivo_antecipacao":351635,
                    "cod_autorizacao_conciliacao":"90839",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180220,
                    "hra_transacao":"094615",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":15063,
                    "cod_autorizacao":"090839",
                    "vlr_bruto":54.19,
                    "vlr_liquido":52.33,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":1.86,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":2,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341881,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180323,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":16259,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2BGL9B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"94F75D4970FAAEC87BA3A71B68979C53",
                    "nro_logico_terminal":"11716993",
                    "cod_arquivo_antecipacao":351635,
                    "cod_autorizacao_conciliacao":"90839",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180323,
                    "hra_transacao":"094615",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":15063,
                    "cod_autorizacao":"090839",
                    "vlr_bruto":54.19,
                    "vlr_liquido":52.33,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":1.86,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":3,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341882,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180420,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":16259,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2BGL9B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"3D694B9FD2887E33108D28A28F010F69",
                    "nro_logico_terminal":"11716993",
                    "cod_autorizacao_conciliacao":"90839",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180420,
                    "hra_transacao":"094615",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":16053,
                    "cod_autorizacao":"094880",
                    "vlr_bruto":62.77,
                    "vlr_liquido":60.61,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":2.16,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":1,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341883,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180220,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":18829,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2CHH1B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"A2FD02D9D3664A42C6D9A157835E7473",
                    "nro_logico_terminal":"11716993",
                    "cod_arquivo_antecipacao":351635,
                    "cod_autorizacao_conciliacao":"94880",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180220,
                    "hra_transacao":"100856",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":16053,
                    "cod_autorizacao":"094880",
                    "vlr_bruto":62.76,
                    "vlr_liquido":60.60,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":2.16,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":2,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341884,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180323,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":188.29,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2CHH1B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"D9A4E1049C2038542BCCF448A796C31F",
                    "nro_logico_terminal":"11716993",
                    "cod_arquivo_antecipacao":351635,
                    "cod_autorizacao_conciliacao":"94880",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180323,
                    "hra_transacao":"100856",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":16053,
                    "cod_autorizacao":"094880",
                    "vlr_bruto":62.76,
                    "vlr_liquido":60.60,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":2.16,
                    "dta_processamento":"31\/01\/18 13:33:43,000000000",
                    "nro_parcela":3,
                    "nro_plano":3,
                    "seq_arquivo":7103,
                    "cod_fato_transacao":325341885,
                    "cod_status":"PREVISTO",
                    "cod_natureza":1,
                    "cod_captura":0,
                    "cod_numerocartao":"0000000000000000000",
                    "cod_data_arquivo_ini":20180122,
                    "cod_data_arquivo_fim":20180122,
                    "cod_data_credito":20180420,
                    "cod_data_status":20180121,
                    "cod_data_venda":"21/01/2018",
                    "cod_conta_banco":100562,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"4180121",
                    "cod_produto":22,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":2,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":188.29,
                    "cod_arquivo":350926,
                    "cod_ponto_venda":570862960,
                    "flg_conciliacao":0,
                    "cod_tid_transacao":"109175731079EN2CHH1B",
                    "nro_unico":"180215140334603",
                    "flg_exportado":0,
                    "hash_value":"96E4D62704C238E434431B7C5EF8F1D2",
                    "nro_logico_terminal":"11716993",
                    "cod_autorizacao_conciliacao":"94880",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180420,
                    "hra_transacao":"100856",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                }
            ]
        }
    }

    return service;
});