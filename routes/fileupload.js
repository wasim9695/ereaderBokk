const path = require('path');


module.exports = (router, app) => {
const multer  = require('multer')
// const upload = multer({ dest: './public/uploads/' });

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/upload/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});


router.post("/fileUpload", upload.single('fileupload'), (req, res) => {
    if (!req.file) {
        // console.log("No file upload");
    } else {
        // console.log(req.file.filename);
        return res.send({"data":req.file.filename})
        // return this.res.render('../view/addbooks', { status: 1, data: req.file.filename });
       
        
    }
});


router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(files)
})


router.get('/uploadjson', (req, res, next) => {
const fs = require('fs');
encoding = 'utf8';
fs.readFile('./public/upload/fileupload-1673092755124.json',encoding, (err, data) => {
    if (err) throw err;
    let student = JSON.parse(data);
    console.log(student);
});
})







}