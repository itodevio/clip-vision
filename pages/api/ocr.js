import formidable from 'formidable';
import vision from '@google-cloud/vision';

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString()
)

export const config = {
  api: {
    bodyParser: false,
  }
}

export default function ocr(req, res) {
  const client = new vision.ImageAnnotatorClient({
    projectId: credential.project_id,
    credentials: {
      client_email: credential.client_email,
      private_key: credential.private_key
    }
  });

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    const fileName = files.image.path;
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;

    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).send({ text: detections[0].description, image: files.image.path })
  })
}