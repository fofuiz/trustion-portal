
angular.module('trustionPortal').controller('CadastrarVideoController', 
function ($scope, $rootScope, $filter, $state, $stateParams, VideoService) {

    $scope.gtvList = [];    
    $scope.formData = {};
    $scope.gtvTypes = [];
    $scope.hasGtvInDataBase = false;
    $scope.showDeleteGtvButton = false;

    function init() {  
        
    }
    init();

    this.$onInit = (() => {
        VideoService.setScope($scope);
    });

    $scope.clickCreateLink = function(idInput, idGtv) {
        var type = $scope.formData.inputType[idInput];
        var path = $scope.formData.inputPath[idInput];
        $scope.gtvList = VideoService.createLink($scope.gtvList, type, path, idGtv);
        $scope.formData.inputType[idInput] = undefined;
        $scope.formData.inputPath[idInput] = '';  
        $scope.showDeleteGtvButton = true;      
    }

    $scope.clickRemoveLink = function(idGtv, idLink) {
        $scope.gtvList = VideoService.removeLink($scope.gtvList, idGtv, idLink);
    }

    $scope.clickSearchGtv = function() {        
        VideoService.searchGtv($scope.formData.inputGtv).then(
            (response) => {
                $scope.showMessage('alert', 'GTV já existente');
                $scope.gtvList = VideoService.prepareGtv(response);
                $scope.setHasGtvInDataBase(true);
                $scope.setGtvTypes();
                $scope.showDeleteGtvButton = true;
            }, 
            (err) => {
                $scope.showMessage('alert', 'Nova GTV');
                $scope.gtvList =  VideoService.prepareGtv({"gtv": $scope.formData.inputGtv, "linkList":[]});
                $scope.setHasGtvInDataBase(false);
                $scope.setGtvTypes();
                $scope.showDeleteGtvButton = false;
            });
    }

    $scope.clickDeleteGtv = function() {
        VideoService.deleteGtv($scope.gtvList[0].id).then(
            (response) => {
                $scope.showMessage('alert', 'GTV Removida');
                $scope.gtvList = [];
                $scope.formData.inputGtv = "";
                $scope.showDeleteGtvButton = false;
            }, 
            (err) => {                
                $scope.showMessage('alert', 'Não foi possível remover a GTV');
            });
    }

    $scope.setGtvTypes = function() {
            // Abaixo: Caso exista uma seleção de links para selecionar os resultados de gtvs, carregar aqui a certa ao invés de index [0]
            $scope.gtvTypes = VideoService.getGtvTypes($scope.gtvList[0].locid);
    }

    $scope.setHasGtvInDataBase = function(hasGtv) {
        VideoService.setHasGtvInDataBase(hasGtv);
    }

    $scope.changeInputSearch = function() {        
        if (!$scope.formData.inputGtv) {
            $scope.gtvList = [];
        } else {            
            $scope.clickSearchGtv();
        }
    }

});