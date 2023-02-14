const { writeFile } = require('fs/promises');

const fileWriterAsync = async (filePath, content) => {
  try {
    await writeFile(filePath, content);
  } catch (err) {
    console.log(err);
  }
}

module.exports = fileWriterAsync;