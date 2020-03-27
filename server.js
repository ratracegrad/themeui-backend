const express = require('express');
const multer = require('multer');
const cors = require('cors');
const PORT = process.env.PORT || '5000';

const app = express();
app.use(cors());

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["font/otf", "font/ttf", "font/woff", "font/woff2"];
    // if (!allowedTypes.includes(file.mimetype)) {
    //     const error = new Error("Incorrect file");
    //     error.code = "INCORRECT_FILETYPE";
    //     // error occured
    //     return cb(error, false);
    // }
    // nothing went wrong
    cb(null, true);
};

const upload = multer({
    dest: './uploads',
    fileFilter,
    limits: {
        fileSize: 500000
    }
});

app.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ error: "Only fonts are allowed" });
        return;
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: "Allowed file size is 500KB" });
        return;
    }
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file })
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
