// server.js or index.js for your Node.js/Express server
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Update with your React app's origin
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));

// Define your imageUploadPath and storage...
const imageUploadPath = 'C:\\Users\\DELL\\Documents\\Office-Work\\Task-11\\my-image-project\\public\\images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists
    if (!fs.existsSync(imageUploadPath)) {
      fs.mkdirSync(imageUploadPath, { recursive: true });
    }
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    const generatedFilename = `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`;
    console.log('Generated Filename:', generatedFilename);
    cb(null, generatedFilename);
  },
});

const imageUpload = multer({ storage: storage });

app.post('/image-upload', imageUpload.array('my-image-file'), (req, res) => {
  try {
    console.log('POST request received to /image-upload.');
    console.log('Files uploaded:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imagePath = path.join(imageUploadPath, req.files[0].filename);
    console.log('Image path:', imagePath);

    const imageUrl = `http://localhost:4000/images/${req.files[0].filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use('/images', express.static(imageUploadPath));

app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
