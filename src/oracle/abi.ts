export default [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "oracle",
        type: "address",
      },
    ],
    name: "AlreadyResponded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "have",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "want",
        type: "uint256",
      },
    ],
    name: "InsufficientFees",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    name: "InvalidNonce",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "have",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
    ],
    name: "InvalidParameterRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "enum LLMOracleTask.TaskStatus",
        name: "have",
        type: "uint8",
      },
      {
        internalType: "enum LLMOracleTask.TaskStatus",
        name: "want",
        type: "uint8",
      },
    ],
    name: "InvalidTaskStatus",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "InvalidValidation",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracle",
        type: "address",
      },
    ],
    name: "NotRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
    ],
    name: "Request",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "responder",
        type: "address",
      },
    ],
    name: "Response",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum LLMOracleTask.TaskStatus",
        name: "statusBefore",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum LLMOracleTask.TaskStatus",
        name: "statusAfter",
        type: "uint8",
      },
    ],
    name: "StatusUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "Validation",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeToken",
    outputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "generationDeviationFactor",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "generationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
    ],
    name: "getBestResponse",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "responder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "output",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
        ],
        internalType: "struct LLMOracleTask.TaskResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "difficulty",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "numGenerations",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "numValidations",
            type: "uint40",
          },
        ],
        internalType: "struct LLMOracleTaskParameters",
        name: "parameters",
        type: "tuple",
      },
    ],
    name: "getFee",
    outputs: [
      {
        internalType: "uint256",
        name: "totalFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "generatorFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "validatorFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
    ],
    name: "getResponses",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "responder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "output",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
        ],
        internalType: "struct LLMOracleTask.TaskResponse[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
    ],
    name: "getValidations",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "validator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "scores",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
        ],
        internalType: "struct LLMOracleTask.TaskValidation[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracleRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_platformFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_generationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_validationFee",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nextTaskId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract LLMOracleRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "models",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "difficulty",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "numGenerations",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "numValidations",
            type: "uint40",
          },
        ],
        internalType: "struct LLMOracleTaskParameters",
        name: "parameters",
        type: "tuple",
      },
    ],
    name: "request",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "difficulty",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "numGenerations",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "numValidations",
            type: "uint40",
          },
        ],
        internalType: "struct LLMOracleTaskParameters",
        name: "parameters",
        type: "tuple",
      },
      {
        internalType: "enum LLMOracleTask.TaskStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "generatorFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "validatorFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFee",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "models",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "output",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "respond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "responses",
    outputs: [
      {
        internalType: "address",
        name: "responder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "output",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_generationDeviationFactor",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_validationDeviationFactor",
        type: "uint64",
      },
    ],
    name: "setDeviationFactors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_platformFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_generationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_validationFee",
        type: "uint256",
      },
    ],
    name: "setFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "difficulty",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "numGenerations",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "numValidations",
            type: "uint40",
          },
        ],
        internalType: "struct LLMOracleTaskParameters",
        name: "minimums",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "difficulty",
            type: "uint8",
          },
          {
            internalType: "uint40",
            name: "numGenerations",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "numValidations",
            type: "uint40",
          },
        ],
        internalType: "struct LLMOracleTaskParameters",
        name: "maximums",
        type: "tuple",
      },
    ],
    name: "setParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "scores",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "validate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "validationDeviationFactor",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validations",
    outputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawPlatformFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
