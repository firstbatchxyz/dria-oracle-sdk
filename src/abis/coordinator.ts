export default [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "feeToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract ERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "generationDeviationFactor",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "generationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBestResponse",
    inputs: [{ name: "taskId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct LLMOracleTask.TaskResponse",
        components: [
          {
            name: "responder",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "score", type: "uint256", internalType: "uint256" },
          { name: "output", type: "bytes", internalType: "bytes" },
          { name: "metadata", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFee",
    inputs: [
      {
        name: "parameters",
        type: "tuple",
        internalType: "struct LLMOracleTaskParameters",
        components: [
          { name: "difficulty", type: "uint8", internalType: "uint8" },
          {
            name: "numGenerations",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "numValidations",
            type: "uint40",
            internalType: "uint40",
          },
        ],
      },
    ],
    outputs: [
      { name: "totalFee", type: "uint256", internalType: "uint256" },
      {
        name: "generatorFee",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "validatorFee", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getResponses",
    inputs: [{ name: "taskId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct LLMOracleTask.TaskResponse[]",
        components: [
          {
            name: "responder",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "score", type: "uint256", internalType: "uint256" },
          { name: "output", type: "bytes", internalType: "bytes" },
          { name: "metadata", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidations",
    inputs: [{ name: "taskId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct LLMOracleTask.TaskValidation[]",
        components: [
          {
            name: "validator",
            type: "address",
            internalType: "address",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          {
            name: "scores",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          { name: "metadata", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_oracleRegistry",
        type: "address",
        internalType: "address",
      },
      { name: "_feeToken", type: "address", internalType: "address" },
      {
        name: "_platformFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_generationFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_validationFee",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_minScore", type: "uint256", internalType: "uint256" },
      { name: "_maxScore", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "maxScore",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minScore",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextTaskId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFeeBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract LLMOracleRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "request",
    inputs: [
      { name: "protocol", type: "bytes32", internalType: "bytes32" },
      { name: "input", type: "bytes", internalType: "bytes" },
      { name: "models", type: "bytes", internalType: "bytes" },
      {
        name: "parameters",
        type: "tuple",
        internalType: "struct LLMOracleTaskParameters",
        components: [
          { name: "difficulty", type: "uint8", internalType: "uint8" },
          {
            name: "numGenerations",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "numValidations",
            type: "uint40",
            internalType: "uint40",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requests",
    inputs: [{ name: "taskId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "requester", type: "address", internalType: "address" },
      { name: "protocol", type: "bytes32", internalType: "bytes32" },
      {
        name: "parameters",
        type: "tuple",
        internalType: "struct LLMOracleTaskParameters",
        components: [
          { name: "difficulty", type: "uint8", internalType: "uint8" },
          {
            name: "numGenerations",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "numValidations",
            type: "uint40",
            internalType: "uint40",
          },
        ],
      },
      {
        name: "status",
        type: "uint8",
        internalType: "enum LLMOracleTask.TaskStatus",
      },
      {
        name: "generatorFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "validatorFee",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "platformFee", type: "uint256", internalType: "uint256" },
      { name: "input", type: "bytes", internalType: "bytes" },
      { name: "models", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "respond",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "output", type: "bytes", internalType: "bytes" },
      { name: "metadata", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "responses",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "responder", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "score", type: "uint256", internalType: "uint256" },
      { name: "output", type: "bytes", internalType: "bytes" },
      { name: "metadata", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setFees",
    inputs: [
      {
        name: "_platformFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_generationFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_validationFee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setGenerationDeviationFactor",
    inputs: [
      {
        name: "_generationDeviationFactor",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setParameters",
    inputs: [
      {
        name: "minimums",
        type: "tuple",
        internalType: "struct LLMOracleTaskParameters",
        components: [
          { name: "difficulty", type: "uint8", internalType: "uint8" },
          {
            name: "numGenerations",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "numValidations",
            type: "uint40",
            internalType: "uint40",
          },
        ],
      },
      {
        name: "maximums",
        type: "tuple",
        internalType: "struct LLMOracleTaskParameters",
        components: [
          { name: "difficulty", type: "uint8", internalType: "uint8" },
          {
            name: "numGenerations",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "numValidations",
            type: "uint40",
            internalType: "uint40",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "validate",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "scores", type: "uint256[]", internalType: "uint256[]" },
      { name: "metadata", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "validationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validations",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "validator", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "metadata", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawPlatformFees",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Request",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "protocol",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Response",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "responder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StatusUpdate",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "protocol",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "statusBefore",
        type: "uint8",
        indexed: false,
        internalType: "enum LLMOracleTask.TaskStatus",
      },
      {
        name: "statusAfter",
        type: "uint8",
        indexed: false,
        internalType: "enum LLMOracleTask.TaskStatus",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Validation",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "validator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "AlreadyResponded",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "oracle", type: "address", internalType: "address" },
    ],
  },
  { type: "error", name: "ComputeError", inputs: [] },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
    ],
  },
  { type: "error", name: "ERC1967NonPayable", inputs: [] },
  { type: "error", name: "FailedCall", inputs: [] },
  {
    type: "error",
    name: "InsufficientFees",
    inputs: [
      { name: "have", type: "uint256", internalType: "uint256" },
      { name: "want", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "InvalidInitialization", inputs: [] },
  { type: "error", name: "InvalidInput", inputs: [] },
  {
    type: "error",
    name: "InvalidNonce",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidParameterRange",
    inputs: [
      { name: "have", type: "uint256", internalType: "uint256" },
      { name: "min", type: "uint256", internalType: "uint256" },
      { name: "max", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidTaskStatus",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      {
        name: "have",
        type: "uint8",
        internalType: "enum LLMOracleTask.TaskStatus",
      },
      {
        name: "want",
        type: "uint8",
        internalType: "enum LLMOracleTask.TaskStatus",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidValidation",
    inputs: [
      { name: "taskId", type: "uint256", internalType: "uint256" },
      { name: "validator", type: "address", internalType: "address" },
    ],
  },
  { type: "error", name: "NotInitializing", inputs: [] },
  {
    type: "error",
    name: "NotRegistered",
    inputs: [{ name: "oracle", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "NotWhitelisted",
    inputs: [{ name: "validator", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  { type: "error", name: "UUPSUnauthorizedCallContext", inputs: [] },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [{ name: "slot", type: "bytes32", internalType: "bytes32" }],
  },
] as const;
