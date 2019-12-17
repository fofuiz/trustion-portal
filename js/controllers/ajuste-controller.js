angular.module('trustionPortal').controller('AjusteController', ['$scope', 'TableauTokenService', 'EmpresaService', '$location', function ($scope, TableauTokenService, EmpresaService, $location) {
    TableauTokenService.getToken().then(
        function successCallback(res) {
            $scope.tableauHeight = $(window).height();
            $scope.maquina = $location.host();
            $scope.tableauToken = res.data.token;
            //$scope.tableauEnd = 'https://tableau.accesstage.com.br/trusted/' + $scope.tableauToken + '/t/trustion/views/Brinks_dev_vendas/PaineldeVendas?:embed=y&showVizHome=no';
            console.log($scope.tableauToken);
        },
        function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o token do dashboard. Favor, entrar em contato com o administrador do sistema.');
            }
        });

    EmpresaService.listarEmpresasCNPJs().then(
        function successCallback(res) {
            if(res.data != '' && res.data.length !== 0) {
                $scope.empFilter = "CNPJ=";
                res.data.forEach(function (item, index) {
                    $scope.empFilter += item.cnpj;
                    if(index !== res.data.length-1) {
                        $scope.empFilter += ",";
                    }
                });
            }else {
                $scope.empFilter = "CNPJ=0";
            }
        },
        function errorCallback(res) {
            if(res.data != null && res.data.hasOwnProperty('mensagem')){
                exibirMensagemErro(res.data.mensagem);
            }else{
                exibirMensagemErro(UTF8.Nao + ' foi ' + UTF8.possivel + ' carregar o filtro de empresas do dashboard. Favor, entrar em contato com o administrador do sistema.');
            }
        });


    angular.element(document).ready(function () {
        $scope.tableauHeight = $(window).height();
        console.log($(window).height());
    });

    $(window).resize(function() {
        $scope.tableauHeight = $(window).height();
    });
}]);