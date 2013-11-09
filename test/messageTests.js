var expect = require("expect.js");
var message = require('cloud/message.js');

describe('Message', function () {
  describe('response', function () {
    it('should return the correct message', function (done) {
      message.getMessage({}, {
        success: function(message) {
          done();
          expect(message).to.be.eql("Good Job dude!");
        }
      });
    });
  });
});
