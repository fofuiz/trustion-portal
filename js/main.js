var modulos = [
	'ui.router',
	'ui.mask',
	'brasil.filters',
	'moment-picker',
	'ngSanitize',
	'ngCsv',
	'ui.bootstrap',
	'btorfs.multiselect',
	'checklist-model'
];

var trustionPortal = angular.module('trustionPortal', modulos)
	.config([
				'$httpProvider',
				function($httpProvider) {
					$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		   
				}
			]).run(
				function(CacheService, $rootScope, $state, $window) {
					$rootScope.$on('$stateChangeStart',
						function(event, toState, toParams, fromState, fromParams, options) {
							if((toState.name != '') && (toState.name != 'login'))
							{
								localStorage.setItem("routeChange",toState.name);
							}
							else if(!CacheService.usuario) {
								if(toState.name != 'login' && toState.name != 'esqueceuSenha' ) {
									event.preventDefault();
									$state.go('login');
									
								}
							}
						}
					);
				}
			).run(function($state, $location, EnvironmentService){
				$state.go('login');
			});

trustionPortal.run(function () {
	/*configuração do Pace*/
    Pace.on('start', function () {
        $(".overlay").show();
    });

    Pace.on('done', function () {
        $(".overlay").hide();
    });
});



trustionPortal.directive('fileModel', ['$parse', function ($parse) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
            	scope.$apply(
            		function() {
            			modelSetter(scope, element[0].files[0]);
            		}
            	);
            });
        }
    };
}]);


trustionPortal.directive('validaString', function() {
   function link(scope, elem, attrs, ngModel) {
		ngModel.$parsers.push(function(viewValue) {
		  var reg = /^[a-zA-Z0-9 \.\-\/]*$/;
		  if (viewValue.match(reg)) {
			return viewValue;
		  }
		  var transformedValue = ngModel.$modelValue;
		  ngModel.$setViewValue(transformedValue);
		  ngModel.$render();
		  return transformedValue;
		});
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: link
	};      
});

trustionPortal.directive('somenteNumero', function() {
	function link(scope, elem, attrs, ngModel) {
		 ngModel.$parsers.push(function(viewValue) {
		   var reg = /^[0-9]*$/;
		   if (viewValue.match(reg)) {
			 return viewValue;
		   }
		   var transformedValue = ngModel.$modelValue;
		   ngModel.$setViewValue(transformedValue);
		   ngModel.$render();
		   return transformedValue;
		 });
	 }
 
	 return {
		 restrict: 'A',
		 require: 'ngModel',
		 link: link
	 };      
 });

trustionPortal.directive('validaTamanho', function(){
	function link(scope, elem, attrs, ngModel) {
		ngModel.$parsers.push(function(viewValue) {
		  if (viewValue.length <= attrs.validaTamanho) {
			return viewValue;
		  }
		  var transformedValue = ngModel.$modelValue.slice(0, attrs.validaTamanho);
		  ngModel.$setViewValue(transformedValue);
		  ngModel.$render();
		  return transformedValue;
		});
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: link
	};
});


trustionPortal.directive('numericOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue ? inputValue.replace(/^[a-zA-Z0-9 ]*$/g,'') : null;

                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});


trustionPortal.directive("formatMoeda", function ($filter) {

    return {
		require: "ngModel",
		link: function (scope, element, attrs, ctrl) {				
			var	_formatMoeda = function(valorDigito) {
				if ( valorDigito !== 'undefined') {
					valorDigito = valorDigito.replace(/\D/g, ''); // permite digitar apenas numero
					valorDigito = valorDigito.replace(/^0+/, ''); // remove zero a esquerda
					valorDigito = valorDigito.length == 1 ? "00" + valorDigito : valorDigito; // add zero a esquerda se necessario
					valorDigito = valorDigito.length == 2 ? "0" + valorDigito : valorDigito; // add zero a esquerda se necessario
					valorDigito = valorDigito.replace(/(\d{1})(\d{15})$/, '$1.$2'); // coloca ponto antes dos ultimos digitos
					valorDigito = valorDigito.replace(/(\d{1})(\d{11})$/, '$1.$2'); // coloca ponto antes dos ultimos 11 digitos
					valorDigito = valorDigito.replace(/(\d{1})(\d{8})$/, '$1.$2'); // coloca ponto antes dos ultimos 8 digitos
					valorDigito = valorDigito.replace(/(\d{1})(\d{5})$/, '$1.$2'); // coloca ponto antes dos ultimos 5 digitos
					valorDigito = valorDigito.replace(/(\d{1})(\d{1,2})$/, '$1,$2'); // coloca virgula antes dos ultimos 2 digitos
				}
				return valorDigito;
			};
			element.bind("keyup", function () {
				ctrl.$setViewValue(_formatMoeda(ctrl.$viewValue) );
				ctrl.$render();
			});
		}
	};
});


/**
 * Essa diretiva estah sendo usada na taxas-administrativas-cadastro.
 * Se for usar em outro lugar, cuidado, pois tem alguns calculos de exibicao para essa tela.
 */
trustionPortal.directive("formatDecimal", function ($filter) {
    return{
        require: "ngModel",
        link: function(scope, element, attrs, ctrl){


			var _formatValue = function(valueToformat) {
				var valueFormated = valueToformat;
				var re;
				var indexes;

				if(!valueFormated) {
					return valueFormated;
				}

				valueFormated = valueFormated.replace(/[^0-9,%]/g, ''); //diferente de numeros ',' e %
				valueFormated = valueFormated.replace(/^[\D]*/, ""); //diferente de numero no comeco
				valueFormated = valueFormated.replace(/,{2,}/g, ""); //duas ',' ou mais juntas
				valueFormated = valueFormated.replace(/%{2,}/g, ""); //dois '%' ou mais juntos
				valueFormated = valueFormated.replace(/,%/g, "");  //',' e '%' juntos

				// remove os % que nao estao no final da string.
				re = /%/g;
				while((match = re.exec(valueFormated)) != null) {
					
					if(match.index != valueFormated.length - 1) {
						valueFormated = valueFormated.replace('%', '')
					}

				}


				// remove as ',' quando tem mais de uma.
				re = /,/g;
				indexes = [];

				while((match = re.exec(valueFormated)) != null) {
					indexes.push(match.index)
				}

				if(indexes.length > 1) {
					indexes.pop();
					indexes.forEach(index => {
						valueFormated = valueFormated.replace(',', '')
					})
				}
				// fim do: remove as ',' quando tem mais de uma.

				return valueFormated;
			}

            // formatting in view
            ctrl.$formatters.push(function(value){

				if(value) {
					value = value * 100;
					return $filter("number")(value, 2) + "%";
				}

				return;
			});
			
			element.bind("keyup", function () {
				ctrl.$setViewValue(_formatValue(ctrl.$viewValue) );
				ctrl.$render();
			});

        }
    };
});


trustionPortal.filter("formatDecimal", function ($filter) {
	return function(value){
		
		if(value) {
			return $filter("number")(value, 2) + "%";
		}

		return "";
	};
});

trustionPortal.filter('percentage', ['$filter', function ($filter) {
	return function (input, decimals) {
		if (input){
			return $filter('number')(input, decimals) + '%';
		} else {
			return '';
		}
	};
}]);



/**
 * Retorna o numero formatado quando existir.
 * Retorna um - (traco) quando o numero nao existir.
 */
trustionPortal.filter('percentageTrace', ['$filter', function ($filter) {
	return function (input, decimals) {
		if (input){
			return $filter('number')(input, decimals) + '%';
		} else {
			return '-';
		}
	};
}]);
