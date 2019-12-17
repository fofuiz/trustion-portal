angular.module('trustionPortal').factory('TrustionHelpers', function(){
    
    var helpers = {
      saveTextAsFile: saveTextAsFile,
      validarEmail: validarEmail,
      duplicateCleaning :duplicateCleaning,
      buscaEmpresa: buscaEmpresa
    };

  /**
	 * Salva string em arquivo texto.
	 * 
	 * @param {String} textToSave 
	 * @param {String} filename 
	 */
	function saveTextAsFile (textToSave, filename) {

		if(!textToSave) {
			return;
		}

		if(!filename) filename = 'console.json'

		var blob = new Blob([textToSave], {encoding:"ISO-8859-1",type:"text/plain;charset=ISO-8859-1"}),
			e    = document.createEvent('MouseEvents'),
			a    = document.createElement('a')


		// FOR IE:
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, filename);
		}
		else{
			var e = document.createEvent('MouseEvents'),
				a = document.createElement('a');

			a.download = filename;
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/plain;charset=ISO-8859-1', a.download, a.href].join(':');
			e.initEvent('click', true, false, window,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
		}
	}

	function validarEmail(mail) {
		var er = RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
		return er.test(mail);
	}

	function duplicateCleaning(lista){
		let newList = [];
		let ordeLista = bubbleSort(lista);
		let lest = 0;
		for( i in ordeLista){
			if (ordeLista[i].idModeloNegocio != lest){
				newList.push(ordeLista[i]);
				lest = ordeLista[i].idModeloNegocio;
			}
		}
		return newList;
	}

	function bubbleSort(lista){
		let newList = lista.sort(function(a,b){ return a.idModeloNegocio - b.idModeloNegocio});
		return newList;
  }
  
  /**
   * Método responsável por loopar dentro da lista de empresas que o usuário tem acesso
   * e encontrar o objeto referente a empresa selecionada no comboBox através do cnpj. 
   * @param cnpjEmpresa - String da empresa que foi selecionada no comboBox.
   * @param empresaCaList - Lista de empresas que será percorrida.
   */
  function buscaEmpresa(cnpjEmpresa, empresaCaList) {
    return empresaCaList.find(function(empresaCa){
      return empresaCa.cnpj === cnpjEmpresa;
    });
  }

	return helpers;
	

});
  