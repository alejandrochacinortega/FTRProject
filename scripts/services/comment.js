angular
  .module('TaskRabbit')
  .factory('Comment', Comment);

Comment.$inject = [
  '$firebaseObject',
  '$firebaseArray',
  'FURL'];

/* @ngInject */
function Comment($firebaseObject,
                 $firebaseArray,
                 FURL) {

  var ref = new Firebase(FURL);
  var service = {
    comments: comments,
    addComment: addComment
  };

  return service;

  ////////////////

  function comments(taskId) {
    return $firebaseArray(ref.child('comments').child(taskId))
  }

  function addComment(taskId, comment) {
    var task_comments = comments(taskId);
    comment.datetime = Firebase.ServerValue.TIMESTAMP;

    if (task_comments) {
      return task_comments.$add(comment);
    }
  }


}
