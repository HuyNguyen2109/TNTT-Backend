const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document');

router.get('/all', documentController.getAllDocuments);

router.delete('/delete-by-id/:id', documentController.deleteDocumentById);

router.post('/create', documentController.createDocument);

router.get('/download/by-id/:id', documentController.downloadById);

router.get('/by-id/:id', documentController.getDocumentById);

router.put('/rename/:id', documentController.renameDocumentById);

module.exports = router;