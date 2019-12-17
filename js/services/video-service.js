angular.module('trustionPortal').factory('VideoService', function ($http, $rootScope, EnvironmentService, $location, $anchorScroll) {

    var REST_URI = EnvironmentService.getEnvironment() + 'link';
    gtvTypes = [];
    hasGtvInDataBase = false; 
    $scope = {};

    var service = {            
        createLink: createLink,
        removeLink: removeLink,
        searchGtv: searchGtv,        
        getGtvTypes: getGtvTypes,
        preparePosition: preparePosition,
        prepareGtv: prepareGtv,
        setHasGtvInDataBase: setHasGtvInDataBase,
        setScope: setScope,
        deleteGtv: deleteGtv
    }

    function init() {
        
    };
    init();

    function setScope(thisScope){
        $scope = thisScope;
    }

    function setHasGtvInDataBase(hasGtvParm) {
        hasGtvInDataBase = hasGtvParm;        
    }

    // Quando vem do list, faz um translate no objeto (muda os nomes das prop de EN para PT-BR)
    function prepareGtv(response) {        

        var fromService = (response.data) ? true : false;
        var gtvList = [((fromService) ? response.data : response)];
        var types = [];

        gtvList.forEach(gtv => {
            if (fromService) {                
                gtv.linkList = gtv.tipos;                
                delete gtv.tipos;

                if (gtv.linkList.length > 0) {
                    gtv.linkList.forEach(item => {
                        item.locid = '_' + getID();
                        item.type = item.tipoVideo;
                        item.path = item.link;
                        delete item.tipoVideo;
                        delete item.link;
                    });
                    types = getUnique(gtv.linkList, 'type');
                }
            }
            if (types.length < 3) {
                gtv.locid = getID();
                types = ["ABERTURA","CONFERENCIA","DECLARACAO"];
            }
            gtvTypes.push({locid: gtv.locid, gtv: gtv.gtv, types});
        });
        return gtvList;
    }

    // Quando vai pro cadastro, faz um translate no objeto (muda os nomes das prop de EN para PT-BR)
    function prepareGtvToSave(response) {
        var gtv = response;                
        gtv.tipos = gtv.linkList;        
        delete gtv.linkList;

        if (gtv.tipos.length > 0) {
            gtv.tipos.forEach(item => {                    
                item.tipoVideo = item.type;
                item.link = item.path;
                delete item.type;
                delete item.path;
            });                
        }
        return gtv;
    }

    function getGtvTypes(idGtv) {
        return gtvTypes.find(gtv => gtv.locid === idGtv).types;
    }

    // Retorna somente os único de um Objeto baseado em certa property
    function getUnique(list, prop) {
        return list
        .sort(function(a,b){return (a[prop]>b[prop])?1:((b[prop]>a[prop])?-1:0)})
        .filter(function(v,i,o){return (i==0)?true:(v[prop]!==o[i-1][prop])})
        .map(function(e){return e[prop]});
    }

    // Deep Copy para clonar objetos
    function clone(o) {
        return (typeof o === 'object' && o !== null)
                ? (Array.isArray(o)) ? o.map(e => arguments.callee(e)) 
                                     : Object.keys(o).reduce((r, k) => (r[k] = arguments.callee(o[k]), r), {})
                : o;
    }

    function preparePosition() {
        if (document.getElementById('tblLink').offsetHeight > 44) {
            $location.hash('tblLink');
            $anchorScroll();
            var _offset = (document.getElementById('tblLink').offsetHeight - window.innerHeight)+38+45;
            if (_offset > 0) { window.scrollBy(0, _offset) };
        }
    }

    function createLink(gtvList, type, path, idGtv) {        
        var gtv = clone(gtvList).find(gtv => gtv.locid === idGtv);
        gtv.linkList = [];
        var linkToInsert = { type, path };
        gtv.linkList.push(linkToInsert);        

        var gtvToSave = prepareGtvToSave(
            JSON.parse(
                JSON.stringify( 
                    gtv, 
                    (k,v) => (k === '$$hashKey' || k === 'locid') ? undefined : v
                )
            )
        );
        
        $http.post(REST_URI, gtvToSave).then(
            (response) => {                
                var tmp = ((response.data) ? response.data : response);
                linkToInsert.id = tmp.idTipoVideo;
                linkToInsert.locid = getID();                
                var gtv = gtvList.find(gtv => gtv.locid === idGtv);
                gtv.linkList.push(linkToInsert);
                gtv.id = tmp.id;
            }, 
            (err) => {
                console.log('KO - LINK JÁ EXISTE: ' + err);
                // $scope.showMessage('error', 'O link já existe');                
            });

        setTimeout(() => { preparePosition() }, 50);
        return gtvList;
    }

    function removeLink(gtvList, idGtv, idLink) {        
        var gtv = gtvList.find(gtv => gtv.locid === idGtv);        
        var linkToRemove = gtv.linkList.find(link => link.locid === idLink);
        $http.delete(REST_URI + "/" + linkToRemove.id).then(
            (response) => {
                gtv.linkList.splice(gtv.linkList.indexOf(linkToRemove), 1);
                console.log('OK - LINK REMOVIDO');
                // $scope.showMessage('error', 'Link removido');
            }, 
            (err) => {
                console.log('KO - DELETE: ' + err);
            });
        return gtvList;
    }

    function getID() {
        return Math.random().toString(36).substring(2, 6) +
               Math.random().toString(36).substring(2, 6);
    }

    function searchGtv(nomeGtv) {
        userLinkList = []; 
        gtvTypes = []; 
        return $http.get(REST_URI + "/" + nomeGtv);
    }

    function deleteGtv(idGtv) {
        return $http.delete(REST_URI + "/gtv/" + idGtv);
    }

    return service;
});