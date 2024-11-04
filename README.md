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
    <a href="https://www.npmjs.com/package/dria-oracles-sdk" target="_blank">
        <img alt="NPM" src="https://img.shields.io/npm/v/dria-oracles-sdk?logo=npm&color=CB3837">
    </a>
    <a href="https://discord.gg/dria" target="_blank">
        <img alt="Discord" src="https://dcbadge.vercel.app/api/server/dria?style=flat">
    </a>
</p>

## Installation

Dria Oracle SDK is an NPM package, which can be installed with any of the following:

```sh
npm i dria-oracle-sdk
yarn add dria-oracle-sdk
pnpm add dria-oracle-sdk
```

## Usage

Dria Oracle uses [viem](https://viem.sh/), and takes in Viem clients as input:

```ts
const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY),
  transport: http(RPC_URL),
  chain,
});

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
  // you can omit `someAmount` as well, in which case it will approve infinitely
  const txHash = await oracle.approve(someAmount);
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
const result = await oracle.read(taskId);
const { output, metadata } = result;
```

## Testing

Tests use the live environment, so make sure you have some balance in your wallets. To run them:

```sh
pnpm test
```

## License

We are using MIT license.
