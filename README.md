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

Dria Oracle uses [Viem](https://viem.sh/) to connect with blockchains. It takes in two Viem clients as input:

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

const oracle = new Oracle({
  public: publicClient,
  wallet: walletClient,
});
```

It must then be initialized with the coordinator contract address, which will setup contract instances in the background:

```ts
await oracle.init(coordinatorAddress);
```

That's all! We must also make sure that we have enough allowance to the coordinator contract so that it can pay the oracle fees.
You can check the allowance, and approve tokens if you want with the following code:

```ts
const allowance = await oracle.allowance();
if (allowance === 0n) {
  const amount = parseEther("1.0");
  // you can omit `amonut` as well to make an infinite approval
  const txHash = await oracle.approve(amount);
  console.log({ txHash });
}
```

We are now ready to make a request:

```ts
// submits the request transaction
const txHash = await oracle.request("What is 2+2?", ["gpt-4o-mini"]);

// waits for transaction to be mined, returns taskId
const taskId = await oracle.waitRequest(txHash);
```

With the request made, we have to wait for a while for generator and validator oracles to finish their jobs. We can subscribe to a certain `taskId`
and wait until it is completed with the `wait` function:

```ts
// waits for all generation & validations to be finished
await oracle.wait(taskId);
```

When we return from `wait` without any errors, we can be sure that the task is finished. We can read the results with:

```ts
const response = await oracle.read(taskId);
const { output, metadata } = response;
```

TODO: describe parsing

TODO: describe validations

## Examples

We have two examples under `examples` folder.

You can make a request directly with the following command:

```sh
node ./examples/request.mjs <your-input-here>
```

Or, you can view the results of an existing task with:

```sh
node ./examples/view.mjs <task-id>
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
