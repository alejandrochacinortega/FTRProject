angular
  .module('TaskRabbit')
  .factory('Task', Task);

Task.$inject = [
  'FURL',
  '$firebaseArray',
  '$firebaseObject',
  'Auth',
  '$q'];

/* @ngInject */
function Task(FURL, $firebaseArray, $firebaseObject, Auth, $q) {
  var ref     = new Firebase(FURL);
  var tasks   = $firebaseArray(ref.child('tasks'));
  var user    = Auth.user;
  var service = {
    test: test,
    all : tasks,

    getTask: function (taskId) {
      return $firebaseObject(ref.child('tasks').child(taskId));
    },

    createTask: function (task) {
      task.datetime = Firebase.ServerValue.TIMESTAMP;
      return tasks.$add(task);
    },

    editTask: function (task) {
      var d         = $q.defer();
      var t         = this.getTask(task.$id);
      task.datetime = Firebase.ServerValue.TIMESTAMP;
      /*return t.$save({title: task.title, description: task.description, total: task.total}); // it should be this*/
      ref.child('tasks').child(task.$id).update({
        datetime   : task.datetime,
        title      : task.title,
        description: task.description,
        total      : task.total
      }, function (error) {
        if (error) {
          d.reject(error)
        } else {
          d.resolve()
        }
      });

      return d.promise
    },

    cancelTask: function (taskId) {
      var d = $q.defer();
      var t = this.getTask(taskId);
      console.log('t  ', t);
      ref.child('tasks').child(taskId).set({
        //TODO: Fix this
        status: "cancelled"
      });
      d.resolve();
      return d.promise;
    },

    isCreator: function (task) {
      return (user && user.provider && user.uid === task.poster);
    },

    isOpen: function (task) {
      return task.status === "open";
    },

    completeTask: function (taskId) {
      var d = $q.defer();
      /*var t = this.getTask(taskId);*/
      var t = ref.child('tasks').child(taskId);

      t.update({
        status: "completed"
      }, function (error) {
        if (error) {
          d.reject(error)
        }
        else {
          d.resolve()
        }
      });

      return d.promise;
    },

    isAssigned: function (task) {
      return (user && user.uid == task.runner)
    },

    isCompleted: function (task) {
      return task.status == "completed";
    }
  };

  return service;

  ////////////////

  function test() {
    console.log('This is thest ');
  }


}
