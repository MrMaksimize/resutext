
var expect = require("expect.js");
var User = require('../cloud/models/resutextUser.js');

describe('User', function () {
  describe('test method', function () {
    it('should return the correct message', function (done) {
      var user = new User();
        expect(user.test()).to.be.eql("test passes");
    });
  });
});
