trustionPortal.directive('uiMessage', function($timeout, $log){
    
    return {
        restrict: 'A',
        templateUrl: "partials/messages/message.html",
        replace: false,
        link: function($scope) {

            /**
             * Show message for user.
             * The 'type' param must be: success, warning, danger or info (info is default).
             * 
             * Usage: $scope.showMessage('success', 'Operation successful.');
             * 
             * @param {string} type alert type.
             * @param {string} message the message for show.
             */
            $scope.showMessage = function(type, message) {
                var types = ['success', 'danger', 'warning', 'info'];
                $timeout.cancel($scope.autoClose);

                if(!type || !message) {
                    $log.error('All params are required');
                }

                if(!types.includes(type)) {
                    type = 'info';
                }

                $scope.type = 'alert-' + type;
                $scope.message = message;
                $scope.isShowMessage = true;

                $scope.autoClose = $timeout(function(){$scope.hideMessage()}, 10000); //auto close message
            }

            $scope.showSuccessMessage = function(message) {
                $scope.showMessage('success', message);
            }

            $scope.showErrorMessage = function(message) {
                $scope.showMessage('danger', message);
            }

            $scope.showWarningMessage = function(message) {
                $scope.showMessage('warning', message);
            }

            $scope.showInfoMessage = function(message) {
                $scope.showMessage('info', message);
            }

            $scope.hideMessage = function() {
                $scope.isShowMessage = false;
                $scope.message = '';
                $scope.type = '';
            }
        }
    }

});