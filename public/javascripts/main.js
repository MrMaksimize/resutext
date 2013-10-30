Uploader = Backbone.View.extend({
  events: {
    "submit": "upload",
    "change input[type=file]": "upload",
    "click .upload": "showFile"
  },

  initialize: function() {
    console.log('init');
    var self = this;
    this.fileUploadControl = this.$el.find("input[type=file]")[0];
  },

  showFile: function(e) {
    console.log('show file');
    this.fileUploadControl.click();
    return false;
  },

  upload: function() {
    console.log('upload');
    var self = this;

    if (this.fileUploadControl.files.length > 0) {
      this.$(".upload").html("Uploading <img src='/images/spinner.gif' />");
      var file = this.fileUploadControl.files[0];
      var name = "image.jpg";
      var parseFile = new Parse.File(name, file);

      // First, we save the file using the javascript sdk
      parseFile.save().then(function() {
        // Then, we post to our custom endpoint which will do the post
        // processing necessary for the image page
        $.post("/upload", {
          file: {
            "__type": "File",
            "url": parseFile.url(),
            "name": parseFile.name()
          },
          title: self.$("[name=title]").val()
        }, function(data) {
          window.location.href = "/i/" + data.id;
        });
      });
    } else {
      alert("Please select a file");
    }

    return false;
  }
});




$(function() {
  // Make all of special links magically post the form
  // when it has a particular data-action associated
  $("button[type='submit']").click(function(e) {
    var el = $(e.target);
    console.log($(e.target));
    //el.closest("form").submit();
    //return false;
    return false;
  });
});
