/**
 * For file download
 *
 */

module.exports = function (data) {

  this.res.attachment(data.fileName);
  this.res.set('Access-Control-Expose-Headers', 'Content-Disposition');
  this.res.send(data.buf);

};
