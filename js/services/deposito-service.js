angular.module('trustionPortal').factory('DepositoService', function($http, EnvironmentService){
	var URI_API_LIST = EnvironmentService.getEnvironment() + 'depositos';
	
	var service ={
			listarPock:listarPock,
			listarDeposito:listarDeposito
	};
	
	function listarPock(deposito){
		console.log(JSON.stringify(deposito));
		return[
			  {
				    ClienteID: 0,
				    ClienteCompusafe: 'stringCompusafe1',
				    CnpjCliente: 'stringCliente1',
				    EquipamentoID: 0,
				    EquipamentoNumeroSerial: 'stringNumSerial1',
				    CodigoMovimento: 0,
				    Sequencia: 0,
				    Depositante: 'stringDepositante1',
				    TipoDeposito: 'stringTipoDeposito1',
				    DepositoDT: '2017-08-18T19:34:06.731Z',
				    TipoMoeda: 'stringtipoMoeda1',
				    IDFechamento: 0,
				    NOTAS_001: 0,
				    NOTAS_002: 0,
				    NOTAS_005: 0,
				    NOTAS_010: 0,
				    NOTAS_020: 0,
				    NOTAS_050: 0,
				    NOTAS_100: 0,
				    ValorTotal: 0
				  },
				  {
					    ClienteID: 1,
					    ClienteCompusafe: 'strstringCompusafe2',
					    CnpjCliente: 'stringCliente2',
					    EquipamentoID: 0,
					    EquipamentoNumeroSerial: 'stringNumSerial2',
					    CodigoMovimento: 0,
					    Sequencia: 0,
					    Depositante: 'stringDepositante2',
					    TipoDeposito: 'stringTipoDeposito2',
					    DepositoDT: '2017-08-18T19:34:06.731Z',
					    TipoMoeda: 'stringtipoMoeda2',
					    IDFechamento: 0,
					    NOTAS_001: 0,
					    NOTAS_002: 0,
					    NOTAS_005: 0,
					    NOTAS_010: 0,
					    NOTAS_020: 0,
					    NOTAS_050: 0,
					    NOTAS_100: 0,
					    ValorTotal: 0
					  }
				];
	}
	
	function listarDeposito(deposito){
		return $http.post(URI_API_LIST, deposito);
	}
	
	/*function listarServico(deposito){
		//URI_API_SELECIONA_DEPOSITO_DET + '?ClienteCNPJ='+deposito.ClienteCNPJ+'&CwpLogin='+deposito.CwpLogin+'&CWPPwd='+deposito.CWPPwd+'&CwpEquipamentoId='+deposito.CwpEquipamentoId+'&CwpEquipamentoNrSerie='+deposito.CwpEquipamentoNrSerie+'&Dt_Inicio='+deposito.Dt_Inicio+'&Dt_Fim='+deposito.Dt_Fim+'&api_key=O'
		return $http({
			method: 'JSONP',
			url: URI_API_SELECIONA_DEPOSITO_DET + '?ClienteCNPJ='+deposito.ClienteCNPJ+'&CwpLogin='+deposito.CwpLogin+'&CWPPwd='+deposito.CWPPwd+'&CwpEquipamentoId='+deposito.CwpEquipamentoId+'&CwpEquipamentoNrSerie='+deposito.CwpEquipamentoNrSerie+'&Dt_Inicio='+deposito.Dt_Inicio+'&Dt_Fim='+deposito.Dt_Fim+'&api_key=O', 
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'no-cache',
				'Content-Type': 'text/plain', /*or whatever type is relevant
		        'Accept': 'text/plain' /* ditto 
		    }
		});
	}*/	
	return service;
});