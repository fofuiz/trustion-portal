angular.module('trustionPortal').factory('ExtratoElegivelService', function($http, EnvironmentService){

    var URI_REST_API = EnvironmentService.getEnvironment() + "extrato";
	var URI_REST_API_LIST = EnvironmentService.getEnvironment() + "extratos";

    var service = {
        listarPorIdRelatorioAnalitico: listarPorIdRelatorioAnalitico,
        listarPorIdRelatorioAnaliticoD0: listarPorIdRelatorioAnaliticoD0,
        desconciliar: desconciliar,
        desconciliarD0: desconciliarD0,
        listarPorIdRelatorioAnaliticoExtratosElegiveis: listarPorIdRelatorioAnaliticoExtratosElegiveis,
        listarPorIdRelatorioAnaliticoExtratosElegiveisD0: listarPorIdRelatorioAnaliticoExtratosElegiveisD0,
        conciliar: conciliar,
        conciliarD0: conciliarD0
    }

    function listarPorIdRelatorioAnalitico(idRelatorioAnalitico){
        return $http.get(URI_REST_API_LIST + '/' + idRelatorioAnalitico);
    }

    function listarPorIdRelatorioAnaliticoD0(idRelatorioAnalitico){
        return $http.get(URI_REST_API_LIST + '/d0/' + idRelatorioAnalitico);
    }

    function desconciliar(idConciliacao){
        return $http.get(URI_REST_API + '/desconciliar/' + idConciliacao);
    }

    function desconciliarD0(idConciliacao){
        return $http.get(URI_REST_API + '/desconciliar/d0/' + idConciliacao);
    }

    function listarPorIdRelatorioAnaliticoExtratosElegiveis(idRelatorioAnalitico){
        return $http.get(URI_REST_API_LIST + '/relatorio/' + idRelatorioAnalitico);
    }

    function listarPorIdRelatorioAnaliticoExtratosElegiveisD0(idRelatorioAnalitico){
        return $http.get(URI_REST_API_LIST + '/relatorio/d0/' + idRelatorioAnalitico);
    }

    function conciliar(idRelatorioAnalitico, idsExtratos){
        return $http.post(URI_REST_API + '/conciliar/' + idRelatorioAnalitico, idsExtratos);
    }

    function conciliarD0(idRelatorioAnalitico, idsExtratos){
        return $http.post(URI_REST_API + '/conciliar/d0/' + idRelatorioAnalitico, idsExtratos);
    }
    
    return service;
});