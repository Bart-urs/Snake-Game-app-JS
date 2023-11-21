const fs = require('fs').promises;
const path = require('path');
const express = require('express')
const app = express()
const port = 4000
const currentDirectory = process.cwd();
const scoresFile = path.join(currentDirectory, "scores.json");

app.use(express.json());

app.get('/scores', async (req, res) => {
  const scores = await getLastScore(scoresFile)
  res.send(scores);
})

async function getLastScore(fileName) {
  try {
    console.log('Reading scores from file:', fileName);
    return await fs.readFile(fileName)
  } catch(err) {
    console.error("Error reading from file:", err)
  }
}

app.post("/scores", async (req, res) => {
  await updateScores(req.body, scoresFile)
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
