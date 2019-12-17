angular.module('trustionPortal').factory('EnvironmentService', ['$location', function ($location) {

    var local = "http://localhost:8080/trustion-servicos/";
    var develop = 'https://dev.accesstage.com.br/trustion-servicos/';
    var homolog = 'https://homolog.accesstage.com.br/trustion-servicos/';
    //var prod = 'https://www.accesstage.com.br/trustion-servicos/';
    var prod   = 'https://app.trustion.com.br/trustion-servicos/';

    function getEnvironment(){
        
        if($location.host() != 'localhost' && $location.host() != '127.0.0.1'){
            if($location.host() == 'dev.accesstage.com.br' || $location.host() == '192.168.42.221' || $location.host() == '192.168.42.222' || $location.host() == '192.168.49.142'){
                return develop;
            }else if($location.host() == 'homolog.accesstage.com.br' || $location.host() == '192.168.41.221' || $location.host() == '192.168.41.222'){
                return homolog;
            }else{
                return prod;
            }
        }else {
            return local;
        }

    }

    return {
        getEnvironment: getEnvironment
    }

}]);