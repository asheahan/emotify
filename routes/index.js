'use strict';

const
  _ = require('lodash'),
  express = require('express'),
  fs = require('fs'),
  router = express.Router(),
  multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });

let emotionService = require('../services/emotion-service'),
  faceService = require('../services/face-service');

router.post('/image/upload', upload.single('file'), function (req, res) {
  // faceService.getFaceAttributes(req.file.buffer)
  emotionService.getFaceEmotion(req.file.buffer)
    .then(data => {
      let info = JSON.parse(data);
      let dat = {
        faceRectangle: info[0].faceRectangle,
        scores: [{
          axes: _.map(_.keys(info[0].scores), key => {
            return {
              axis: key,
              value: info[0].scores[key]
            };
          })
        }]
      };
      res.json({
        status: 'SUCCESS',
        message: 'File processed',
        data: dat
      });
    })
    .catch(err => {
      res.json({
        status: 'ERROR',
        message: err.message
      });
    });
});

module.exports = router;
