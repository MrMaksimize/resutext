Uploader = Backbone.View.extend({
  events: {
    "submit": "formSubmit",
    "change input[type=file]": "upload",
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

  formSubmit: function(e) {
    var self = this;
    // Disable inputs for op.
    $('input').prop('disabled', true);
    var postBody = {};
    var values = this.getSimpleValues();
    if (!this.parseFile) {
      console.log('no parse file');
      this.saveSimpleValues(values);
    }
    else {
      var parseFile = this.parseFile;
      console.log(parseFile);
      console.log('yes parse file');
      parseFile.save().then(function(){
        values.file = {
          "__type": "File",
          "url": parseFile.url(),
          "name": parseFile.name()
        };
        self.saveSimpleValues(values);
      });
    }
    return false;
  },

  getSimpleValues: function() {
    var values = {};
    $('input').each(function(index, element) {
      var name = $(element).attr('name');
      if (name != "resumeUploadFile") {
        values[name] = $(element).val();
      }
    });
    console.log(values);
    return values;
  },

  saveSimpleValues: function(valuesToSave) {
    var values = valuesToSave;
    $.post("/user/update-settings", values, function(data){
        console.log(data);

        $('input').prop('disabled', false);
    });
  },


  debug: function(e) {
    console.log('debug');
    console.log(e);
  },

  upload: function() {
    console.log('upload');
    var self = this;

    if (this.fileUploadControl.files.length > 0) {
      //this.$(".upload").html("Uploading <img src='/images/spinner.gif' />");
      var file = this.fileUploadControl.files[0];
      var name = "image.jpg";
      var parseFile = new Parse.File(name, file);
      console.log(this);
      console.log(parseFile);
      this.parseFile = parseFile;

    } else {
      alert("Please select a file");
    }

    return false;
  }
});



