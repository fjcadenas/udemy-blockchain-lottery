import path from "path"; // its great for cross-platform path routing
import fs from "fs";
import solc from "solc";

const CONTRACT_FILENAME = "Lottery.sol";

const inboxPath = path.resolve(__dirname, "contracts", CONTRACT_FILENAME);
const source = fs.readFileSync(inboxPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    [CONTRACT_FILENAME]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

export default output.contracts[CONTRACT_FILENAME].Lottery;
