angular.module('trustionPortal').factory('RecebimentosService', function($http){

    var service = {
        totalRecebimentosPorOperadoraPeriodo: totalRecebimentosPorOperadoraPeriodo,
        totalRecebimentosPorProdutoPeriodo: totalRecebimentosPorProdutoPeriodo,
        detalheTotalRecebimentosProdutoPeriodo: detalheTotalRecebimentosProdutoPeriodo,
        detalheRecebimentosGrid: detalheRecebimentosGrid
    };

    function totalRecebimentosPorOperadoraPeriodo() {
        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    total: 25002.98
                },
                {
                    id: 2,
                    operadora: "Rede",
                    total: 8653.00
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    total: 18225.09
                },
                {
                    id: 4,
                    operadora: "Elo",
                    total: 20122.32
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    total: 10201.09
                }
            ]
        }
    }

    function totalRecebimentosPorProdutoPeriodo(){

        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "AMEX",
                    total: 4303.98,
                    cvs: 89,
                    ticket: 48.35
                },
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "Visa",
                    total: 12056.00,
                    cvs: 214,
                    ticket: 53.33
                },
                {
                    id: 1,
                    operadora: "Cielo",
                    bandeira: "Visa Electron",
                    total: 8643.00,
                    cvs: 72,
                    ticket: 120.04
                },
                {
                    id: 2,
                    operadora: "Rede",
                    bandeira: "Visa",
                    total: 8653.00,
                    cvs: 310,
                    ticket: 27.91
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    bandeira: "Sodexo",
                    total: 18225.09,
                    cvs: 412,
                    ticket: 44.23
                },
                {
                    id: 4,
                    operadora: "Elo",
                    bandeira: "Mastercard",
                    total: 20122.32,
                    cvs: 213,
                    ticket: 94.47
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    bandeira: "Diners",
                    total: 10000.00,
                    cvs: 65,
                    ticket: 153.84
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    bandeira: "Mastercard",
                    total: 201.09,
                    cvs: 1322,
                    ticket: 0.15
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

    function detalheTotalRecebimentosProdutoPeriodo(idOperadora){

        if(idOperadora == 1){
            return {
                data: [
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "AMEX",
                        total: 4303.98,
                        cvs: 89,
                        ticket: 48.35
                    },
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "Visa",
                        total: 12056.00,
                        cvs: 214,
                        ticket: 53.33
                    },
                    {
                        id: 1,
                        operadora: "Cielo",
                        bandeira: "Visa Electron",
                        total: 8643.00,
                        cvs: 72,
                        ticket: 120.04
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
                        total: 8653.00,
                        cvs: 310,
                        ticket: 27.91
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
                        total: 18225.09,
                        cvs: 412,
                        ticket: 44.23
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
                        total: 20122.32,
                        cvs: 213,
                        ticket: 94.47
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
                        total: 10000.00,
                        cvs: 65,
                        ticket: 153.84
                    },
                    {
                        id: 5,
                        operadora: "Elavon",
                        bandeira: "Mastercard",
                        total: 201.09,
                        cvs: 1322,
                        ticket: 0.15
                    }
                ]
            }
        }else{
            return null;
        }
    }

    function detalheRecebimentosGrid(){
        return {
            data: [
                {
                    "nro_nsu":152428639,
                    "cod_autorizacao":"0",
                    "vlr_bruto":28.00,
                    "vlr_liquido":28.00,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 19:22:58,000000000",
                    "nro_parcela":9,
                    "nro_plano":10,
                    "seq_arquivo":102,
                    "cod_fato_transacao":308019847,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******5722",
                    "cod_data_arquivo_ini":20170628,
                    "cod_data_arquivo_fim":20170628,
                    "cod_data_credito":"05/02/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":'28/06/2017',
                    "cod_conta_banco":391852,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":279.99,
                    "cod_arquivo":339535,
                    "cod_ponto_venda":570859466,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"C1E4FB1B46065E698A90BDBAC5008E4F",
                    "flg_exportado":0,
                    "hash_value":"63E22B39BD4B3AA04536C2000D62BC68",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180328,
                    "hra_transacao":"144347",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":151977970,
                    "cod_autorizacao":"0",
                    "vlr_bruto":17.9,
                    "vlr_liquido":17.9,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 17:50:40,000000000",
                    "nro_parcela":10,
                    "nro_plano":10,
                    "seq_arquivo":97,
                    "cod_fato_transacao":307621787,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******3890",
                    "cod_data_arquivo_ini":20170623,
                    "cod_data_arquivo_fim":20170623,
                    "cod_data_credito":"01/03/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":"23/06/2017",
                    "cod_conta_banco":391852,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":17.99,
                    "cod_arquivo":339528,
                    "cod_ponto_venda":570859466,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"FA7539318E6AFFBFCDAF1469FFE1943B",
                    "flg_exportado":0,
                    "hash_value":"AA2F4BBB13AEEC4033D2D952A5B6F039",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180423,
                    "hra_transacao":"140433",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":152428639,
                    "cod_autorizacao":"0",
                    "vlr_bruto":27.99,
                    "vlr_liquido":27.99,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 19:22:58,000000000",
                    "nro_parcela":10,
                    "nro_plano":10,
                    "seq_arquivo":102,
                    "cod_fato_transacao":308019848,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******5722",
                    "cod_data_arquivo_ini":20170628,
                    "cod_data_arquivo_fim":20170628,
                    "cod_data_credito":"03/03/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":"28/06/2017",
                    "cod_conta_banco":391852,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":279.99,
                    "cod_arquivo":339535,
                    "cod_ponto_venda":570859466,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"C1E4FB1B46065E698A90BDBAC5008E4F",
                    "flg_exportado":0,
                    "hash_value":"5BB10C0A1637330CD9AE9718A0B36442",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180430,
                    "hra_transacao":"144347",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":151949963,
                    "cod_autorizacao":"0",
                    "vlr_bruto":135.71,
                    "vlr_liquido":135.71,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 17:50:12,000000000",
                    "nro_parcela":7,
                    "nro_plano":7,
                    "seq_arquivo":97,
                    "cod_fato_transacao":307614127,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******5844",
                    "cod_data_arquivo_ini":20170623,
                    "cod_data_arquivo_fim":20170623,
                    "cod_data_credito":"02/02/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":"23/06/2017",
                    "cod_conta_banco":391852,
                    "flg_antecipado":1,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":949.97,
                    "cod_arquivo":339528,
                    "cod_ponto_venda":570859467,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"14CA1547A72DCDFA0EE032ABB6324F66",
                    "flg_exportado":0,
                    "hash_value":"0E2E4A7075F07A558A856D66F70BF2C0",
                    "flg_liquidado":2,
                    "cod_data_reagendamento":20180123,
                    "hra_transacao":"111101",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":151130121,
                    "cod_autorizacao":"0",
                    "vlr_bruto":44.00,
                    "vlr_liquido":44.00,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 18:10:11,000000000",
                    "nro_parcela":8,
                    "nro_plano":10,
                    "seq_arquivo":86,
                    "cod_fato_transacao":307681229,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******7059",
                    "cod_data_arquivo_ini":20170614,
                    "cod_data_arquivo_fim":20170614,
                    "cod_data_credito":"14/02/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":"14/06/2017",
                    "cod_conta_banco":391852,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":439.99,
                    "cod_arquivo":339529,
                    "cod_ponto_venda":570859467,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"570EB6A4C5B4269149288796C02312CC",
                    "flg_exportado":0,
                    "hash_value":"EA7CFB7AC9BE9051D36172181C0A3DF4",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180214,
                    "hra_transacao":"172659",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                },
                {
                    "nro_nsu":151130121,
                    "cod_autorizacao":"0",
                    "vlr_bruto":44.00,
                    "vlr_liquido":44.00,
                    "vlr_taxa_antecipacao":0,
                    "vlr_comissao":0,
                    "dta_processamento":"18\/07\/17 18:10:11,000000000",
                    "nro_parcela":9,
                    "nro_plano":10,
                    "seq_arquivo":86,
                    "cod_fato_transacao":307681230,
                    "cod_status":"LIQUIDADO",
                    "cod_natureza":1,
                    "cod_captura":23,
                    "cod_numerocartao":"000960371******7059",
                    "cod_data_arquivo_ini":20170614,
                    "cod_data_arquivo_fim":20170614,
                    "cod_data_credito":"14/03/2018",
                    "cod_data_status":20170718,
                    "cod_data_venda":"14/06/2017",
                    "cod_conta_banco":391852,
                    "flg_antecipado":0,
                    "flg_estorno":0,
                    "flg_cashback":0,
                    "cod_lote_bandeira":"0",
                    "cod_produto":1003,
                    "emp":"EMPRESA_TESTE",
                    "cod_operadora":66,
                    "cod_moeda":1,
                    "cod_pais":2,
                    "vlr_transacao_total":439.99,
                    "cod_arquivo":339529,
                    "cod_ponto_venda":570859467,
                    "flg_conciliacao":0,
                    "dsc_area_cliente":"570EB6A4C5B4269149288796C02312CC",
                    "flg_exportado":0,
                    "hash_value":"0301DEE95F0CDA85FA380E2CBE957697",
                    "flg_liquidado":0,
                    "cod_data_reagendamento":20180314,
                    "hra_transacao":"172659",
                    "banco": "Itau",
                    "agencia": "3201",
                    "conta": "00000000026128"
                }
            ]
        }
    }

    return service;
});