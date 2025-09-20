// src/config/multer.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import { getAllowedTypes } from "../utils/fileTypes";

const allowedTypes = getAllowedTypes(process.env.ALLOWED_FILE_CATEGORY || "image");



const storage = new CloudinaryStorage({

  cloudinary : cloudinaryUpload,

  params: async (req, file) => {

    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}-${file.originalname.split(".")[0]}`;

    return {
      folder: "worldTourManagement/uploads",
      format: file.mimetype.split("/")[1],
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});




export const multerUpload = multer({

  storage,

  limits: { fileSize: 50 * 1024 * 1024 }, // default 50MB

  fileFilter: (req, file, cb) => {

    if (!allowedTypes.includes(file.mimetype)) {

      return cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Allowed types are: ${allowedTypes.join(", ")}`
        )
      );

    }
    cb(null, true);
  },
});
