import multer from 'multer';
import fs from 'fs';
import path from 'path';
const medicalHistoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let relativeFolderPath = "../uploads/";
        let fullFolderPath = path.resolve(__dirname, relativeFolderPath);
        if (!fs.existsSync(fullFolderPath)) { 
            fs.mkdirSync(fullFolderPath);
        }
        fullFolderPath = path.resolve(fullFolderPath, 'medicalHistory');
        if (!fs.existsSync(fullFolderPath)) {
            fs.mkdirSync(fullFolderPath);
        }
        cb(null, fullFolderPath);
    },
    filename: function (req, file, cb) {
        const filename = file.fieldname + "-" + Date.now() + "-" + Math.random() * 1000 + path.extname(file.originalname);
        cb(null, filename)
    }
});

const medicalHistoryUpload = multer({ storage: medicalHistoryStorage });


export default medicalHistoryUpload;

