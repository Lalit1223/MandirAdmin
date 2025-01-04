const fs = require("fs");
const path = require("path");

const saveBase64File = (base64String, baseFolder, subFolder) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const ext = matches[1].split("/")[1]; // Get file extension
  const buffer = Buffer.from(matches[2], "base64"); // Decode base64
  const fileName = `${Date.now()}.${ext}`; // Unique file name

  // Construct folder paths
  const folderPath = path.join(baseFolder, subFolder);
  const filePath = path.join(folderPath, fileName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // Create directory if it doesn't exist
  }

  fs.writeFileSync(filePath, buffer); // Save file
  return `/${baseFolder}/${subFolder}/${fileName}`; // Return relative path
};

module.exports = { saveBase64File };
