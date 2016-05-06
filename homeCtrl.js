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
            $scope.missedRidesLog = "";
            $scope.graphArray = [];
            $scope.loadFromFireBase = function () {
                $http.get("https://savings-tracker.firebaseio.com/settings.json")
                    .then(function (response) {
                        $scope.savingUpFor = response.data.savingUpFor
                        $scope.cost = response.data.cost
                        $scope.dueDate = response.data.dueDate
                        $scope.daysCyclingAWeek = response.data.daysCyclingAWeek
                        $scope.startDate = new Date(response.data.startDate)
                        $scope.calculateDayToEnd()
                    });

                $http.get("https://savings-tracker.firebaseio.com/missedRides.json")
                    .then(function (response) {
                        $scope.missedRides = response.data.missedRides
                        $scope.calculateDayToEnd()
                    });


            };
            $scope.calculateDayToEnd = function () {
                var dae = Date.parse($scope.startDate);
                $scope.daysToEnd = days_between(new Date(dae), new Date());
            }

            function days_between(startDate, endDate) {
                var count = 0;
                var curDate = startDate;
                while (curDate <= endDate) {
                    var dayOfWeek = curDate.getDay();
                    if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
                        count++;
                    curDate.setDate(curDate.getDate() + 1);
                }
                return count;
            }

            

            $scope.addMissedRide = function () {
                $scope.missedRides++;
                $scope.updateMissedRide();
            }

            $scope.getMissedDates = function () {


                $http.get("https://savings-tracker.firebaseio.com/missedRideLog.json").then(function (response) {
                    $scope.missedRidesLog = response.data.log;
                    var missedRidesLogArray = $scope.missedRidesLog.split(",");
                    for (var index = 0; index < $scope.daysSinceStart(); index++) {
                        var toPush = 0;
                        for (var logArrayIndex = 0; logArrayIndex < missedRidesLogArray.length; logArrayIndex++) {
                            if (missedRidesLogArray[logArrayIndex] == index) {
                                toPush = -11;
                                break;
                            }
                        }
                        if (index > 0) {
                            toPush += $scope.graphArray[index - 1];
                        }
                        toPush += 11;
                        $scope.graphArray.push(toPush)
                    }
                    $scope.loadGraph();

                });
            }


            $scope.retrieveGraphDate = function () {
                $scope.getMissedDates();
            }

            $scope.daysSinceStart = function () {


                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date($scope.startDate);
                var secondDate = new Date();

                return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

            }

            $scope.updateMissedRide = function () {
                $http.get("https://savings-tracker.firebaseio.com/missedRideLog.json").then(function (response) {
                    $scope.missedRidesLog = response.data.log;
                }).then(function () {

                    $scope.missedRidesLog = $scope.missedRidesLog + "," + $scope.daysSinceStart();

                    var data =
                        {
                            log: $scope.missedRidesLog,
                        };

                    $http.put("https://savings-tracker.firebaseio.com/missedRideLog.json",
                        data);

                    $scope.missedRides++;
                    data =
                    {
                        missedRides: $scope.missedRides
                    };

                    $http.put("https://savings-tracker.firebaseio.com/missedRides.json",
                        data);
                });
            }
            angular.element(document).ready(function () {


                $scope.loadFromFireBase();

                $scope.retrieveGraphDate();

            });
            $scope.loadGraph = function () {

                var data = {
                    // A labels array that can contain any sort of values
                    // Our series array that contains series objects or in this case series data arrays
                    series: [
                        $scope.graphArray
                    ]
                };

                // We are setting a few options for our chart and override the defaults
                var options = {
                    // Don't draw the line chart points
                    showPoint: false,
                    // Disable line smoothing
                    lineSmooth: true,
                    // X-Axis specific configuration
                    axisX: {
                        // We can disable the grid for this axis
                        showGrid: false,
                        // and also don't show the label
                        showLabel: false
                    },
                    // Y-Axis specific configuration
                    axisY: {
                        // We can disable the grid for this axis
                        showGrid: false,
                        // and also don't show the label
                        showLabel: false
                    }
                };

                // Create a new line chart object where as first parameter we pass in a selector
                // that is resolving to our chart container element. The Second parameter
                // is the actual data object.
                new Chartist.Line('.ct-chart', data, options);

            }

        }
        );