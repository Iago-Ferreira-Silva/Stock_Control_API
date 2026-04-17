const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configura o Cloudinary com as credenciais do .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define onde e como o arquivo vai ser salvo no Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stock-control', // Pasta criada automaticamente no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formatos aceitos
    transformation: [{ width: 800, crop: 'limit' }], // Redimensiona se for maior que 800px
  },
});

// Multer intercepta o arquivo da requisição e envia para o Cloudinary
// O arquivo fica disponível em req.file após passar por esse middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por arquivo
});

module.exports = upload;