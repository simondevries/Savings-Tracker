angular.module('firstApplication', ['ngMaterial'])
    .controller('settingsCtrl',
        function ($scope, $http, $timeout, $mdDialog) {
            $scope.init = function () {
                $scope.loadFromFireBase();
            };

            $scope.savingUpFor = "";
            $scope.cost = "";
            $scope.dueDate = "";
            $scope.daysCyclingAWeek = ""
            $scope.startDate = ""
            $scope.loadFromFireBase = function () {

                $http.get("https://savings-tracker.firebaseio.com/settings.json")
                    .then(function (response) {
                        $scope.savingUpFor = response.data.savingUpFor
                        $scope.cost = response.data.cost
                        $scope.dueDate = response.data.dueDate
                        $scope.daysCyclingAWeek = response.data.daysCyclingAWeek
                        $scope.startDate = response.data.startDate
                    });
            };


            $scope.showConfirm = function (ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Save?')
                    .textContent('Are you sure you want to save???')
                    .ariaLabel('save')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function () {
                    $scope.saveToFireBase();
                });
            }
            $scope.saveToFireBase = function () {
                var data =
                    {
                        savingUpFor: $scope.savingUpFor,
                        cost: $scope.cost,
                        dueDate: $scope.dueDate,
                        daysCyclingAWeek: $scope.daysCyclingAWeek,
                        startDate: $scope.startDate
                    };

                $http.put("https://savings-tracker.firebaseio.com/settings.json",
                    data);

            }
            
            
            $scope.resetMissedRides = function (ev) {
                var confirm = $mdDialog.confirm()
                    .title('Clear?')
                    .textContent('Are you sure you want to clear your savings????')
                    .ariaLabel('clear')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function () {
                    $scope.missedRides = 0;
                    $scope.updateMissedRide()
                });
            }


            $scope.init();
        });
        