const fs = require('fs').promises;
const path = require('path');
const express = require('express')
const app = express()
const port = 4000
const currentDirectory = process.cwd();

app.use(express.json());

app.get('/scores', (req, res) => {
  // TODO
})

app.post("/scores", async (req, res) => {
  await updateScores(req.body, path.join(currentDirectory, "scores.json"))
  res.send("OK!")
})

async function updateScores(newScoreInfo, fileName) {
  try {
    await fs.writeFile(fileName, JSON.stringify(newScoreInfo));
    console.log('Scores written to file successfully:', fileName);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
