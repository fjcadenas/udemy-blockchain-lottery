import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import lottery from "../compile";

const { abi, evm } = lottery;
const provider = ganache.provider();
const web3 = new Web3(provider);

describe("Lottery Contract", () => {
  let lottery;
  let accounts;
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ from: accounts[0], gas: "1000000" });
    lottery.setProvider(provider);
  });

  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows a single account to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(players[0], accounts[0]);
    assert.equal(1, players.length);
  });

  it("allows a single account to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200, // with no traduction is wei directly
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can pick a winner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("sends money to the winner and rests the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether"),
    });
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[1]);

    const difference = finalBalance - initialBalance;
    assert.equal(difference, web3.utils.toWei("2", "ether"));
  });
});
