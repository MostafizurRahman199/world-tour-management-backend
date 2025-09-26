

import { v2 as cloudinary} from "cloudinary";
import { ENV } from "./env";
import { AppError } from "../../errors";

 

cloudinary.config({

    cloud_name:ENV.CLOUDINARY_CLOUD_NAME,
    api_key:ENV.CLOUDINARY_API_KEY,
    api_secret:ENV.CLOUDINARY_API_SECRET,

})





export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        
        //https://res.cloudinary.com/djzppynpk/image/upload/v1753126572/ay9roxiv8ue-1753126570086-download-2-jpg.jpg.jpg

        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex);

        console.log({ match });

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            // console.log(`File ${public_id} is deleted from cloudinary`);

        }
    } catch (error: any) {
        throw new AppError("Cloudinary image deletion failed")
    }
}



//main instance for use cloudinary

export const cloudinaryUpload = cloudinary;








//----------------------For PDF Upload ------------------





export interface CloudinaryPDFUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}


/**
 * Upload PDF buffer to Cloudinary with enhanced error handling
 */


export const uploadPDFToCloudinary = async (
  
    pdfBuffer: Buffer, 
  transactionId: string

): Promise<CloudinaryPDFUploadResult> => {

  try {
   
    // Validate inputs
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new AppError("PDF buffer is empty or invalid");
    }

    if (!transactionId) {
      throw new AppError("Transaction ID is required");
    }

    return new Promise((resolve, reject) => {

      const uploadStream = cloudinaryUpload.uploader.upload_stream(
       
        { 
          resource_type: "raw", 
          folder: "invoices", 
          public_id: `invoice-${transactionId}-${Date.now()}`, // Add timestamp for uniqueness
          format: 'pdf',
          type: 'upload',
          access_mode: 'public'
        },

        (error, result) => {

          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new AppError(`Cloudinary upload failed: ${error.message}`));
          }
           else if (!result) {
            reject(new AppError("Cloudinary upload returned no result"));
          } 
          else {
            resolve(result as CloudinaryPDFUploadResult);
          }

        }
      );

      // Handle stream errors
      uploadStream.on('error', (error) => {

        console.error("Upload stream error:", error);
        reject(new AppError(`Upload stream error: ${error.message}`));

      });


      // Write buffer to stream
      uploadStream.write(pdfBuffer);
      uploadStream.end();


    });
  } catch (error) {

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(`PDF upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

  }
};




/**
 * Delete invoice from Cloudinary
 */


export const deleteInvoiceFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinaryUpload.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting invoice from Cloudinary:", error);
    throw new AppError("Failed to delete invoice from Cloudinary");
  }
};