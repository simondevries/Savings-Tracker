angular.module('firstApplication', ['ngMaterial'])
    .controller('settingsCtrl', function ($scope, $mdDialog) {
        $scope.setUp = function() {
            $scope.savingFor = "John";
        }
        $scope.showConfirm = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Save?'  )
                .textContent('Are you sure you want to save???' + settingsCtrl.savingFor)
                .ariaLabel('save')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                saveToFireBase();
            }, function () {
            });

        }
    });
        
