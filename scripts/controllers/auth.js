angular
  .module('TaskRabbit')
  .controller('AuthController', AuthController);

AuthController.$inject = [
  '$scope',
  '$state',
  'Auth',
  'toaster'
];

/* @ngInject */
function AuthController($scope,
                        $state,
                        Auth,
                        toaster) {
  /* jshint validthis: true */
  var vm = this;

  vm.activate = activate;
  vm.register = register;


  activate();

  ////////////////

  function activate() {
    if (Auth.signedIn()) {
      $state.go('/')
    }
  }

  function register(user) {
    Auth.register(user)
      .then(function () {
        toaster.pop('success', "Register successfully");
        $state.go('/')
      }, function (error) {
        toaster.pop('error', "Oppps... Something went wrong");
      });
  }

  $scope.login = function (user) {
    Auth.login(user)
      .then(function (data) {
        console.log('success', "Logged in successfully ", data);
        $state.go('/')
      }, function (err) {
        console.log('error', "Oops! Something went wrong.");
        // errMessage(err);
      });
  };

  $scope.changePassword = function (user) {

    Auth.changePassword(user)
      .then(function () {

        // Reset form
        $scope.user.email   = '';
        $scope.user.oldPass = '';
        $scope.user.newPass = '';

        console.log('success', "Password changed successfully");
      }, function (err) {
        console.log('error', "Oops! Something went wrong.");
        // errMessage(err);
      });
  };


}