const fs = require('fs');
const path = require('path');

module.exports = {
  plugin(_schema, _documents, config) {
    const { operatorPath } = config;

    const realGeneratedPath = path.join(__dirname, operatorPath);

    const generatedLists = fs.readdirSync(realGeneratedPath);

    const mapGeneratedFiles = generatedLists.map((generated) => {
      // Remove extension
      const newGenerated = generated.replace(/\.[^/.]+$/, '');

      return `export * from './generated/${newGenerated}.generated';`;
    });

    // add types to the top of the file
    mapGeneratedFiles.unshift(`export * from './generated/types';`);

    return mapGeneratedFiles.join('\n');
  },
};
