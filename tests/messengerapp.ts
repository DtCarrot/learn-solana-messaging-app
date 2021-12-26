import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Messengerapp } from '../target/types/messengerapp';
import assert from 'assert'
const { SystemProgram } = anchor.web3;

describe('messengerapp', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Messengerapp;

  let _baseAccount;
  before(() => {
    const baseAccount = anchor.web3.Keypair.generate();
    _baseAccount = baseAccount;
  })

  it("An account is initialized", async function () {
    await program.rpc.initialize("My first message", {
      accounts: {
        baseAccount: _baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [_baseAccount]
    });
    const account = await program.account.baseAccount.fetch(_baseAccount.publicKey);
    console.log('Data: ', account.data);
    assert.ok(account.data === "My first message");
  });

  it("Update the account previously created: ", async function () {
    const baseAccount = _baseAccount;
    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Updated data: ", account.data);
    assert.ok(account.data === "My second message");
    console.log("All account data: ", account);
    console.log("All data: ", account.dataList);
    assert.ok(account.dataList.length === 2);
  });

  it("Type vulgarity in message ", async function () {
    const baseAccount = _baseAccount;
    try {
      await program.rpc.update("vulgar word", {
        accounts: {
          baseAccount: baseAccount.publicKey,
        },
      });
      assert.ok(false);
    } catch (e) {
      console.log('String: ', e.toString())
      assert.equal(e.toString(), "Please do not input the word vulgar");
    }
  });

});
