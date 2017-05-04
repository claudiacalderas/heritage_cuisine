var express = require('express');
var router = express.Router();
var aws = require('aws-sdk')
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');
var multerS3 = require('multer-s3');

if(process.env.S3_BUCKET != undefined) {
  // use Amazon Web Services to store files
  var s3 = new aws.S3();
  var upload = multer({
    storage: multerS3({
            s3: s3,
            bucket: process.env.S3_BUCKET,
            metadata: function (req, file, cb) {
              cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
              cb(null, Date.now().toString())
            }
          })
  });
} else {
  // use the local storage server
  var upload = multer({dest: 'uploads/'});
};


// Create's the file in the database
router.post('/', upload.single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  var newUpload = {
    name: req.body.name,
    created: Date.now(),
    file: req.file
  };
  Upload.create(newUpload, function (err, next) {
    if (err) {
      next(err);
    } else {
      res.send(newUpload);
    }
  });
});

// Gets the list of all files from the database
router.get('/', function (req, res, next) {
  Upload.find({},  function (err, uploads) {
    if (err) next(err);
    else {
      res.send(uploads);
    }
  });
});

// Gets a file from the hard drive based on the unique ID and the filename
router.get('/:uuid/:filename', function (req, res, next) {
  console.log(req.params);
  Upload.findOne({
    'file.filename': req.params.uuid,
    'file.originalname': req.params.filename
  }, function (err, upload) {
    if (err) next(err);
    else {
      res.set({
        "Content-Disposition": 'attachment; filename="' + upload.file.originalname + '"',
        "Content-Type": upload.file.mimetype
      });
      fs.createReadStream(upload.file.path).pipe(res);
    }
  });
});


module.exports = router;
