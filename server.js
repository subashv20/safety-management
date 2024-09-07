const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;
let workflowsCollection;

// Middleware
app.use(bodyParser.json());

// Use the "public" directory to serve static files
app.use(express.static('public'));

// Connect to MongoDB
client.connect(err => {
  if (err) throw err;
  db = client.db('workflowDB');
  workflowsCollection = db.collection('workflows');
  console.log('Connected to MongoDB');
});

// Save Workflow
app.post('/saveWorkflow', (req, res) => {
  const workflow = req.body.workflow;

  // Insert workflow into the collection
  workflowsCollection.insertOne({ workflow }, (err, result) => {
    if (err) {
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
