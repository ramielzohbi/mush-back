const express = require('express');
const router = express.Router();
const multer = require('multer');
const {database} = require('../config/helpers');



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req,file,cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const filefilter =  (req,file,cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
        cb(null,true);
    } else {
        cb(null,false);
    }

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 7
    },
    fileFilter: filefilter,
});

/* GET All Products */
router.get('/', function(req, res) {

  database
      .table('townhouses as t')
      .withFields([
          't.name',
          't.code',
          't.web',
          't.bio',
          't.images',
      ])
      .getAll()
      .then(th => {
        if (th.length > 0 ) {
          res.status(200).json({
            count: th.length,
            townhouses: th
          });
        } else {
          res.json({message: 'Nothing was found'});
        }
      }).catch( err => console.log(err));
});


/* Get Single Product*/

router.get('/:pid', (req, res) => {

    let townhouseID = req.params.pid;
    console.log(townhouseID);

    database.table('townhouses as t')
        .withFields([
            't.name',
            't.code',
            't.web',
            't.bio',
            't.images',
        ])
        .filter({'t.name': townhouseID})
        .get()
        .then(prods => {
            if (prods) {
                res.status(200).json(prods);
            } else {
                res.json({message: 'Nothing was found matching this Townhouse ID'});
            }
        }).catch( err => console.log(err));
})



router.post('/new', upload.array('images', 50), (req, res) => {
    const allImages = req.files;
    
    
    
    // console.log('Featured image : ' + allImages[0].path);

    let remainingImages = '';
    for(let i = 0; i < allImages.length; i++) {
        remainingImages += allImages[i].path;
        if (i === allImages.length - 1) {
        } else {remainingImages += ',,,';}
    }
    // console.log('remaining Images : ' + remainingImages);

    // All Above are working perfect;  Feautured image, and remaining images;

    //Insert into Database

    database 
        . table ( 'townhouses' ) 
            . insert ( { 
                name : req.body.name , 
                code : req.body.code , 
                web : req.body.web ,
                bio: req.body.bio,
                images: remainingImages,
            } ) 
        . then ( lastId  =>  { 
            console.log(lastId);
            res.json({
                message: `Product create was a success, your Product ID is : ${lastId}`,
                success: true,
            });

        } ).catch(err => {
            console.log(err);
        })

});

module.exports = router;
