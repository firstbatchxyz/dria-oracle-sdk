<p align="center">
  <img src="https://raw.githubusercontent.com/firstbatchxyz/.github/refs/heads/master/branding/dria-logo-square.svg" alt="logo" width="168">
</p>

<p align="center">
  <h1 align="center">
    Dria Oracle SDK
  </h1>
  <p align="center">
    <i>On-chain LLMs SDK.</i>
  </p>
</p>

<p align="center">
    <a href="https://opensource.org/licenses/MIT" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-7CB9E8.svg">
    </a>
    <a href="https://www.npmjs.com/package/dria-oracle-sdk" target="_blank">
        <img alt="NPM" src="https://img.shields.io/npm/v/dria-oracle-sdk?logo=npm&color=CB3837">
    </a>
    <a href="https://discord.gg/dria" target="_blank">
        <img alt="Discord" src="https://dcbadge.vercel.app/api/server/dria?style=flat">
    </a>
</p>

## Installation

Dria Oracle SDK is an NPM package, which can be installed with any of the following:

```sh
npm  i   dria-oracle-sdk
yarn add dria-oracle-sdk
pnpm add dria-oracle-sdk
```

## Usage

### Setup

We use [Viem](https://viem.sh/) to connect with blockchains. Provide the two Viem clients as input:

```ts
// wallet client for "write" operations
const walletClient = createWalletClient({
  account: privateKeyToAccount(SECRET_KEY),
  transport: http(RPC_URL),
  chain,
});
// public client for "read" operations
const publicClient = createPublicClient({
  transport: http(RPC_URL),
  chain,
});

// arweave storage
const storage = new ArweaveStorage();

// create the oracle sdk
const oracle = new Oracle(
  {
    public: publicClient,
    wallet: walletClient,
  },
  storage
);
```

Then, initialize the SDK by connecting to the Coordinator contract at the given address:

```ts
await oracle.init(coordinatorAddress);
```

### Using Arweave

As you may have noticed, we have written `const storage = new ArweaveStorage();` above. This is because we save from gas costs by writing large strings to Arweave and storing its transaction id instead of the string itself within the contract. In a contract, if we see a stringified object such as `{ arweave: "tx-id-here"}` then this belongs to an Arweave transaction.

Oracle nodes can understand this, and read the actual content from Arweave. Even further, they can write their results to Arweave the same way, from which the SDK understands and downloads the output!
In short, there are two types of operations:

- **Read**: It is enough to pass in the `ArweaveStorage` instance as shown above to the `Oracle` constructor.

```ts
const storage = new ArweaveStorage();
```

- **Write**: To be able to upload to Arweave as the SDK user, you must provide an Arweave Wallet (of type `JWKInterface`). The SDK tolerates to some byte-length, i.e. it will not use Arweave if the input is not large enough; this is configurable.

```ts
const storage = new ArweaveStorage();
const wallet = JSON.parse(fs.readFileSync("./path/to/wallet.json", "utf-8")) as JWKInterface;
const byteLimit = 2048; // default 1024
storage.init(wallet, byteLimit);
```

If you omit Arweave by not passing this argument to the `Oracle` constructor, Arweave messages will not be downloaded automatically, nor large values will not be uploaded.

### Approving for Fees

Before we make a request, we must make sure that we have enough allowance to the coordinator contract so that it can pay the oracle fees.
You can check the allowance, and approve tokens if required with the following snippet:

```ts
const allowance = await oracle.allowance();
if (allowance === 0n) {
  // you can omit `amount` as well to make an infinite approval
  const amount = parseEther("1.0");
  const txHash = await oracle.approve(amount);
  console.log({ txHash });
}
```

### Making a Request

We are now ready to make a request. Within a request, we simply provide the input as-is, along with the models to be used:

```ts
const input = "What is 2+2?";
const models = ["gpt-4o-mini"]; // or just "*" for any model
const txHash = await oracle.request(input, models);
```

When this transaction is mined, a `taskid` will be assigned to it by the contract. A taskId start from 1 and simply increments for each request; however, we cant be sure of its value until our request is mined. For this reason, we follow our `request` with this function:

```ts
const taskId = await oracle.waitRequest(txHash);
```

With the request made & its task id known, we can sit back for a while and wait for the **generator** and **validator** oracles to finish their jobs. First, generator oracles will work to answer until the requested number of generations are met. After that, the validations will take place and each generation will take a score from each validator. Once the requested number of validations are met as well, the last validator computes the final scores & distributes fees accordingly.

To wait for this programmatically, we can provide the task id and wait until all this is completed with the `wait` function:

```ts
await oracle.wait(taskId);
```

When we return from `wait` without any errors, we are sure that the request has been completed.

### Reading Results

To read the best (i.e. highest score) response to a request, we have the `read` function:

```ts
const response = await oracle.read(taskId);
const { output, metadata } = response;
```

Internally, this handles t

TODO: describe parsing

### Reading Validations

TODO: describe validations

## Examples

We have several examples that demonstrate making a request, following it up with another request, and view an existing request!
You can examine the code there, or try them out yourself.

First, go to [`examples`](./examples/) directory and install packages there:

```sh
cd examples
npm install
```

Prepare the environment by copying `.env.example` as `.env`, and fill out your `SECRET_KEY` and `RPC_URL`.
The examples use Base Sepolia network, so make sure your RPC URL belongs to that network.

> [!ALERT]
>
> Make sure you have enough ETH and WETH as well, to pay for the fees.

### Making a Request

Let's make a request now. Simply call `./request.mjs` with a single argument, that is your prompt.

```sh
node ./request.mjs <your-input-here>
# node ./request.mjs "What is 2+2?"
# node ./request.mjs "Who created you?"
# node ./request.mjs "Tell me a joke"
```

The script will print your request, and the best generation along with validations to the screen. It will also print the task id, which identifies
your request for the coordinator contract.

### Following up a Request

Oracle's can "follow up" on an existing message, similar to how ChatGPT works with context! Check your task id from the previous example, and try to follow it
up with another question using the `./chat.mjs` script:

```sh
node ./chat.mjs <your-input-here> <task-id-here>
# node ./chat.mjs "how many words are there in my previous message?" 4
# node ./chat.mjs "what are we talking about in our last conversation?" 123
# node ./chat.mjs "what is the multiplication of the numbers in your previous messages" 1337
```

You can keep following up the chat messages on and on, as the oracle writes the entire history for each chat message!

### Viewing a Request

You can view the request, its generations and validations for any task id with the `./view.mjs` script:

```sh
node ./view.mjs <task-id>
# node ./view.mjs 1
```

## Testing

Tests use the live environment, so make sure you have some balance in your wallets. To run them:

```sh
pnpm test
```

## Contracts

### Base Sepolia Testnet

| Contract    | Address                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Registry    | [`408d245a853137e44a2465d5c66061f97582eae9`](https://base-sepolia.blockscout.com/address/0x408d245a853137e44a2465d5c66061f97582eae9) |
| Coordinator | [`13f977bde221b470d3ae055cde7e1f84debfe202`](https://base-sepolia.blockscout.com/address/0x13f977bde221b470d3ae055cde7e1f84debfe202) |

## License

We are using MIT license.
