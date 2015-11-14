angular
  .module('TaskRabbit')
  .factory('Offer', Offer);

Offer.$inject = [
  '$firebaseObject',
  '$firebaseArray',
  'FURL',
  '$q',
  'Auth',
  'Task'];

/* @ngInject */
function Offer($firebaseObject,
               $firebaseArray,
               FURL,
               $q,
               Auth,
               Task) {

  var ref     = new Firebase(FURL);
  var user    = Auth.user;
  var service = {
    offers     : offers,
    makeOffer  : makeOffer,
    isOffered  : isOffered,
    isMaker    : isMaker,
    getOffer   : getOffer,
    cancelOffer: cancelOffer,
    acceptOffer: acceptOffer
  };

  return service;

  ////////////////

  function offers(taskId) {
    return $firebaseArray(ref.child('offers').child(taskId))
  }

  function makeOffer(taskId, offer) {
    var task_offers = offers(taskId);

    if (task_offers) {
      return task_offers.$add(offer);
    }
  }

  function isOffered(taskId) {
    if (user && user.provider) {
      var d = $q.defer();

      $firebaseArray(ref.child('offers').child(taskId).orderByChild("uid")
        .equalTo(user.uid))
        .$loaded()
        .then(function (data) {
          d.resolve(data.length > 0);
        }, function (error) {
          d.reject(error)
        });

      return d.promise;

    }
  }

  function isMaker(offer) {
    return (user && user.uid === offer.uid)
  }

  function getOffer(taskId, offerId) {
    return $firebaseObject(ref.child('offers').child(taskId).child(offerId))
  }

  function cancelOffer(taskId, offerId) {
    return getOffer(taskId, offerId).$remove();
  }

  function acceptOffer(taskId, offerId, runnerId) {
    var d = $q.defer();
    var o = getOffer(taskId, offerId);
    ref.child('offers').child(taskId).child(offerId).update({
      accepted: true
    }, function (error) {
      if (error) {
        console.log('error ', error);
        d.reject(error)
      }
      else {
        /*var t = Task.getTask(taskId);*/
        ref.child('tasks').child(taskId).update({
          status: "assigned",
          runner: runnerId
        });
        d.resolve();
      }
    })

    return d.promise;
  }


}
