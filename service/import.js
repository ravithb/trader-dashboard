
const ih = require('lib/import-utils');

const args = process.argv;

if (args.length < 3) {
  console.log("import file name required. Usage `node import.js csv-file.csv`");
  process.exit();
}

async function main() {
  if (ih.hasFlag("-t") || ih.hasFlag("--truncate")) {
    await ih.truncateTables();
    console.log("Truncated data");
  }

  await ih.doImportFile(args[args.length - 1]);
  
  process.exit();

}

main();

