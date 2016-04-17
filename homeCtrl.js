angular.module('firstApplication', ['ngMaterial'])
    .controller('homeCtrl',
        function ($scope, $http, $mdDialog) {


            $scope.daysLeft = "";
            $scope.rides = "";
            $scope.daysToEnd = "";

            $scope.missedRides = 0;

            $scope.savingUpFor = "";
            $scope.cost = "";
            $scope.dueDate = "";
            $scope.daysCyclingAWeek = ""
            $scope.startDate = ""
            $scope.loadFromFireBase = function () {
              $http.get("https://savings-tracker.firebaseio.com/missedRides.json")
                    .then(function (response) {
                        $scope.missedRides = response.data.missedRides
                    });

                $http.get("https://savings-tracker.firebaseio.com/settings.json")
                    .then(function (response) {
                        $scope.savingUpFor = response.data.savingUpFor
                        $scope.cost = response.data.cost
                        $scope.dueDate = response.data.dueDate
                        $scope.daysCyclingAWeek = response.data.daysCyclingAWeek
                        $scope.startDate = new Date(response.data.startDate)
                    });
            };
            $scope.calculateDayToEnd = function () {
                var dae = Date.parse($scope.dueDate);
                $scope.daysToEnd = days_between(new Date(), new Date(dae));
                alert($scope.daysToEnd);
            }

            function days_between(date1, date2) {

                // The number of milliseconds in one day
                var ONE_DAY = 1000 * 60 * 60 * 24

                // Convert both dates to milliseconds
                var date1_ms = date1.getTime()
                var date2_ms = date2.getTime()

                // Calculate the difference in milliseconds
                var difference_ms = Math.abs(date1_ms - date2_ms)

                // Convert back to days and return
                return Math.round(difference_ms / ONE_DAY)

            }

                    
            $scope.addMissedRide = function () {
                $scope.missedRides++;
                var data =
                    {
                        missedRides: $scope.missedRides
                    };

                $http.put("https://savings-tracker.firebaseio.com/missedRides.json",
                    data);
            }


            $scope.loadFromFireBase();

        }
        );