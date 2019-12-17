angular.module('trustionPortal').factory('CategorizacaoCartoesService', function($http, EnvironmentService){

    var URL_TRANSACAO = EnvironmentService.getEnvironment() + 'transacao';

    var service = {
        categorizacaoTipoProduto:categorizacaoTipoProduto,
        totalPorVendaERecebimentos: totalPorVendaERecebimentos,
        totalPorOperadoraPeriodo: totalPorOperadoraPeriodo,
        totalPorProdutoPeriodo: totalPorProdutoPeriodo,
        totalVendasPorOperadoraPeriodo: totalVendasPorOperadoraPeriodo, //depreciado
        totalVendasPorProdutoPeriodo: totalVendasPorProdutoPeriodo, //depreciado
        totalRecebimentosPorOperadoraPeriodo: totalRecebimentosPorOperadoraPeriodo, //depreciado
        totalRecebimentosPorProdutoPeriodo: totalRecebimentosPorProdutoPeriodo, //depreciado
        totalRecebimentosFuturosPorOperadoraPeriodo: totalRecebimentosFuturosPorOperadoraPeriodo, //depreciado
        totalRecebimentosFuturosPorProdutoPeriodo: totalRecebimentosFuturosPorProdutoPeriodo //depreciado
    };

    function categorizacaoTipoProduto(){
        return $http.get(URL_TRANSACAO + '/tipo/total');
        /*return {
         data:[
                 {
                    tipo: "D",
                    tipoTransacao: "VISTA",
                    valor: 150343.90
                 },
                 {
                     tipo: "C",
                     tipoTransacao: "VISTA",
                     valor: 152760.56
                 },
                 {
                     tipo: "C",
                     tipoTransacao: "PARCELADO",
                     valor: 25682.56
                 },
                 {
                     tipo: "O",
                     tipoTransacao: "OUTROS",
                     valor: 154562.56
                 }
             ]
        }*/
    }

    function totalPorVendaERecebimentos(){
        return $http.get(URL_TRANSACAO + '/status/total');

        /*return {
            data:[
                {
                    serie: "Vendas",
                    total: 192760.56,
                    transacao: 632
                },
                {
                    serie: "Recebimentos",
                    total: 403242.90
                },
                {
                    serie: "Recebimentos Futuros",
                    total: 332303.00
                }
            ]
        }*/
    }

    function totalPorOperadoraPeriodo(status){
        return $http.get(URL_TRANSACAO + '/status/operadora/' + status);
    }

    function totalPorProdutoPeriodo(status, idOperadora){
        return $http.get(URL_TRANSACAO + '/status/operadora/' + status + '/' + idOperadora);
    }
    
    
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

    function totalVendasPorProdutoPeriodo(idBusca){

        if(idBusca === 1){
            return {
                data:[{nome: "AMEX", total: 4303.98}, {nome: "Visa", total: 9044.00}, {nome: "Visa Electron", total: 3023.09}]
            }
        }else if(idBusca === 2){
            return {
                data:[{nome: "Visa", total: 9044.00}]
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
        }
    }

    function totalRecebimentosPorOperadoraPeriodo() {
        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    total: 14303.98
                },
                {
                    id: 2,
                    operadora: "Rede",
                    total: 10044.00
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    total: 13023.09
                },
                {
                    id: 4,
                    operadora: "Elo",
                    total: 12324.32
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    total: 1090.09
                }
            ]
        }
    }

    function totalRecebimentosPorProdutoPeriodo(idBusca){

        if(idBusca === 1){
            return {
                data:[{nome: "AMEX", total: 4303.98}, {nome: "Visa", total: 9044.00}, {nome: "Visa Electron", total: 956}]
            }
        }else if(idBusca === 2){
            return {
                data:[{nome: "Visa", total: 10044.00}]
            }
        }else if(idBusca === 3){
            return {
                data:[{nome: "Sodexo", total: 13023.09}]
            }
        }else if(idBusca === 4){
            return {
                data:[{nome: "Mastercard", total: 12324.32}]
            }
        }else if(idBusca === 5){
            return {
                data:[{nome: "Diners", total: 500.09}, {nome: "Mastercard", total: 590.00}]
            }
        }else{
            return "";
        }
    }

    function totalRecebimentosFuturosPorOperadoraPeriodo() {
        return {
            data:[
                {
                    id: 1,
                    operadora: "Cielo",
                    total: 5600.00
                },
                {
                    id: 2,
                    operadora: "Rede",
                    total: 9000.00
                },
                {
                    id: 3,
                    operadora: "Sodexo",
                    total: 4500.00
                },
                {
                    id: 4,
                    operadora: "Elo",
                    total: 4324.32
                },
                {
                    id: 5,
                    operadora: "Elavon",
                    total: 1500.00
                }
            ]
        }
    }

    function totalRecebimentosFuturosPorProdutoPeriodo(idBusca){

        if(idBusca === 1){
            return {
                data:[{nome: "AMEX", total: 1000.00}, {nome: "Visa", total: 3000.00}, {nome: "Visa Electron", total: 1600.00}]
            }
        }else if(idBusca === 2){
            return {
                data:[{nome: "Visa", total: 9000.00}]
            }
        }else if(idBusca === 3){
            return {
                data:[{nome: "Sodexo", total: 4500.00}]
            }
        }else if(idBusca === 4){
            return {
                data:[{nome: "Mastercard", total: 4324.32}]
            }
        }else if(idBusca === 5){
            return {
                data:[{nome: "Diners", total: 750.00}, {nome: "Mastercard", total: 750.00}]
            }
        }else{
            return "";
        }
    }

    return service;
});