// utilities/upload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/vehicles"); // or wherever you're storing them
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    const base = path.basename(file.originalname, ext);
    // This keeps the original file name
    const safeBase = base.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, ""); // remove spaces

    const imageFileName = `${safeBase}${ext}`;
    const thumbnailFileName = `${safeBase}-tn${ext}`;

    // Save both file names in the request for later use
    req.savedImageName = imageFileName;
    req.savedThumbnailName = thumbnailFileName;
    cb(null, imageFileName);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

