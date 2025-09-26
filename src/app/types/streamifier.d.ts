declare module "streamifier" {
  import { Readable } from "stream";

  interface Streamifier {
    createReadStream(buffer: Buffer, options?: any): Readable;
  }

  const streamifier: Streamifier;
  export = streamifier;
}
