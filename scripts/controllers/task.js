angular
  .module('TaskRabbit')
  .controller('TaskController', TaskController);

TaskController.$inject = [
  '$scope',
  '$state',
  '$stateParams',
  'toaster',
  'Task',
  'Auth'
];

/* @ngInject */
function TaskController($scope,
                        $state,
                        $stateParams,
                        toaster,
                        Task,
                        Auth) {


  $scope.createTask = function () {
    $scope.task.status   = 'open';
    $scope.task.gravatar = Auth.user.profile.gravatar;
    $scope.task.name     = Auth.user.profile.name;
    $scope.task.poster   = Auth.user.uid;

    Task.createTask($scope.task).then(function (ref) {
      toaster.pop('success', 'Task created successfully.');
      $scope.task = {
        title      : '',
        description: '',
        total      : '',
        status     : 'open',
        gravatar   : '',
        name       : '',
        poster     : ''
      };
      $state.go('browse', { taskId: ref.key()});
    });
  };

  $scope.editTask = function (task) {
    Task.editTask(task).then(function () {
      toaster.pop('success', "Task is updated.");
    }), function (error) {
      toaster.pop('error', error)
    };
  };

}