angular.module('trustionPortal').factory('UploadEvidenciaD1Service', function($http, EnvironmentService){

    var URL_UPLOAD = EnvironmentService.getEnvironment() + 'upload/atividade/d1/';

    var service = {
        uploadArquivo: uploadArquivo
    }

    function uploadArquivo(idAtividade, arquivo){
        //console.log('SERVICE');
        //console.log(arquivo);
        var formData = new FormData();
        formData.append('file', arquivo);

        return $http.post(URL_UPLOAD + idAtividade, formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
    }

    return service;

});