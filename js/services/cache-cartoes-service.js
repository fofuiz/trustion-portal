angular.module('trustionPortal').service('CacheCartoesService',
    function() {
        return {
            vendas: null,
            vendasGrid: null,
            recebimentos: null,
            recebimentosGrid: null
        }
    }
);