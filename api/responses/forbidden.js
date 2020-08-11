/**
 * 403 (Forbidden) Response
 *
 * The request was a legal request, but the server is refusing to respond to it.
 * Unlike a 401 Unauthorized response, authenticating will make no difference.
 * Error code for user not authorized to perform the operation or the resource is unavailable for some reason.
 */

module.exports = function foribbden (data) {
  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.foribbden()');

  if (req.wantsJSON) {
    return res.status(403).send(data);
  }
  else {
    return res.status(403).view('403');
  }
};
