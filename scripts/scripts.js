// declare a module
var app = angular.module('foodApp', ["firebase", "ngSanitize", "ngCsv"]);

app.controller('mainCtrl', ['$scope', '$firebaseObject', '$timeout','$interval', function($scope, $firebaseObject, $timeout, $interval) {
    
    var now = new Date();
    $scope.today = now.getDate() + '.' + (now.getMonth()+1) + '.' + now.getFullYear() + '_' + now.getHours() + '-' + now.getMinutes();
    $scope.deleteAllLabel = 'לחצו למחיקת כלל הנתונים';

    firebase.auth().signInWithEmailAndPassword('mishko.meteor@gmail.com', '123456').catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    });


    // // authanticate anonymously into firebase db
    // firebase.auth().signInAnonymously().catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     console.log('error: ' + errorMessage);
    // });

    // get data after authentication 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            console.log('user logged in with ID: ' + uid);
        var DataRef = firebase.database().ref('/').once('value').then(function(snapshot) {
            $scope.data = snapshot.val();
            if(!$scope.data) {
                 $scope.createDB();
                 $scope.data = snapshot.val();
            }
            $scope.$digest();
        });

        } else {
            console.log('user signed out...');
            // User is signed out.
        }
    });

    $scope.increase = function(enterance) {
        $scope.data[enterance].counter++;
        $scope.updateData(enterance, 'נכנס');
    }


    $scope.decrease = function(enterance) {
        if($scope.data[enterance].counter > 1) {
            $scope.data[enterance].counter--;
        }
        $scope.updateData(enterance, 'יצא');
    }

    $scope.reset = function(enterance) {
        $scope.data[enterance].counter = 1;
        $scope.commit(enterance);
    }

    $scope.resetAll = function() {

        if ($scope.deleteAllLabel == 'לחצו שוב לאישור מחיקה') {
            $scope.createDB();


        var DataRef = firebase.database().ref('/').once('value').then(function(snapshot) {
            $scope.data = snapshot.val();
            $scope.$digest();
        });


            $scope.deleteAllLabel = 'לחצו למחיקת כלל הנתונים';
            $scope.warnDelete = false;
            $scope.dataDeleted = true;
            $timeout(function(){
                $scope.dataDeleted = false;
            },4000);

        }
        else {
            $scope.deleteAllLabel = 'לחצו שוב לאישור מחיקה';
            $scope.warnDelete = true;
            $timeout(function(){
                $scope.deleteAllLabel = 'לחצו למחיקת כלל הנתונים';
                $scope.warnDelete = false;
            },2000);
        }
            
    }

    $scope.updateData = function(enterance, action) {
        var timeStamp = $scope.generateTimestamp(action);
        if ($scope.data[enterance].instances)
            $scope.data[enterance].instances.push(timeStamp);
        else {
            var instances = [timeStamp];
            $scope.data[enterance].instances = instances;
        }
            $scope.commit(enterance);
    }

    $scope.generateTimestamp = function(action) {
        var now = new Date();
        var date = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear();
        var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        var timeStamp = {
            action: action,
            date: date,
            time: time,
            timestamp: now
        };
        return timeStamp;
    }

     $scope.createDB = function () {

        $scope.front = {
            id: 'front',
            name: 'כניסה ראשית',
            counter: 1,
            instances: []
        };
        $scope.back = {
            id: 'back',
            name: 'כניסה אחורית',
            counter: 1,
            instances: []
        };

        $scope.saalim = {
            id: 'saalim',
            name: 'סא"לים',
            counter: 1,
            instances: []
        };


        firebase.database().ref('/front/').set($scope.front);
        firebase.database().ref('/back/').set($scope.back);
        firebase.database().ref('/saalim/').set($scope.saalim);
    }
 
    $scope.commit = function (enterance) {
        firebase.database().ref('/'+ enterance +'/').set($scope.data[enterance]);
        
         var DataRef = firebase.database().ref('/').once('value').then(function(snapshot) {
            $scope.data = snapshot.val();
            $scope.$digest();
        });
    };

    $interval( function () {
        var DataRef = firebase.database().ref('/').once('value').then(function(snapshot) {
            $scope.data = snapshot.val();
            $scope.$digest();
        });
    },2000) 

}]);