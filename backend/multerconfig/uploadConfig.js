const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',  // Folder where files will be stored
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);  // Filename format: timestamp-originalname
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx/;  // Allow PDF and DOCX as well
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only specific types are allowed.'));
    }
};



const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Set file size limit to 5MB
    fileFilter: fileFilter  // Allow any file
});

module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/',  // Folder where images will be stored
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);  // Filename format: timestamp-originalname
//     }
// });

// // File type validation (images only)
// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);  // Accept file
//     } else {
//         cb(new Error('Error: Only images are allowed!'));  // Reject file if not an image
//     }
// };

// // Initialize multer with storage and file filter
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5000000 }, // Set file size limit to 5MB
//     fileFilter: fileFilter
// });

// module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/', 
//     filename: function(req, file, cb){
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// // Initialize upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 50000000 }, 
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/; 
//         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = fileTypes.test(file.mimetype);

//         if (extname && mimetype) {
//             return cb(null, true);
//         } else {
//             cb('Error: Images only!');
//         }
//     }
// });

// module.exports = upload;