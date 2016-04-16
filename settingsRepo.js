angular.module('firstApplication', ['settingsCtrl'])
function saveToFireBase() {
    alert(settingsCtrl.savingFor);
}