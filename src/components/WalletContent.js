"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDown, Info, ArrowUp, Copy, Scan, Check } from "lucide-react"

export function WalletContent() {
  const [selectedNetwork, setSelectedNetwork] = useState("ERC20")
  const [showTokens, setShowTokens] = useState(true)

  const activeCrypto = {
    name: "ETH",
    fullName: "Ethereum",
    amount: 2.06354,
    value: 5535.86,
    change: "+0.023%",
  }

  const networks = [
    { id: "ERC20", name: "ERC20", subtitle: "Ethereum" },
    { id: "ARETH", name: "ARETH", subtitle: "Arbitrum" },
    { id: "ZKSYNC", name: "ZKSYNC", subtitle: "ZKsync Era" },
    { id: "OPTIMISM", name: "OPTIMISM", subtitle: "Optimism" },
  ]

  const tokens = [
    { name: "ETH", fullName: "400895", amount: 0.6354, value: 2580.2, change: "+10%" },
    { name: "FLOW", fullName: "167905280", amount: 580.03, value: 6618.06, change: "-7.65%" },
    { name: "XRP", fullName: "0.6980", amount: 370.4154, value: 258.55, change: "+1.42%" },
    { name: "DOT", fullName: "10006", amount: 985.9, value: 5450.45, change: "+0.12%" },
    { name: "BNB", fullName: "10006", amount: 12.09, value: 5365.06, change: "+0.06%" },
    { name: "XLM", fullName: "2.0453", amount: 350940.28, value: 335.08, change: "+0.07%" },
    { name: "USDT", fullName: "0.0001", amount: 5.02763, value: 5.02763, change: "+0.01%" },
    { name: "LTC", fullName: "10006", amount: 87.02, value: 5285.17, change: "+0.03%" },
  ]

  return (
    <div className="flex flex-1 overflow-auto">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-full p-2 mr-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L8 16L16 12L24 16L16 4Z" fill="white" />
                <path d="M16 12L8 16L16 28L24 16L16 12Z" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold mr-2">{activeCrypto.name}</h2>
                <span className="text-sm text-gray-500">{activeCrypto.fullName}</span>
                <span className="text-green-500 text-sm ml-2">{activeCrypto.change}</span>
                <ArrowUp className="w-3 h-3 text-green-500" />
              </div>
              <p className="text-sm text-gray-500">${activeCrypto.value.toFixed(2)}</p>
            </div>
          </div>

          <div className="ml-auto">
            <h1 className="text-3xl font-bold">{activeCrypto.amount}</h1>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button className="bg-[#c1ff00] text-black font-medium rounded-full px-6 py-2.5 flex items-center">
            Send
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </button>
          <button className="bg-gray-100 text-gray-800 font-medium rounded-full px-6 py-2.5 flex items-center">
            Receive
            <ArrowDown className="ml-2 w-4 h-4" />
          </button>

          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-full bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 18H21M8 12H21M8 6H21M3 18L3.01 18M3 12L3.01 12M3 6L3.01 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Choose network</h3>
          <div className="grid grid-cols-4 gap-3">
            {networks.map((network) => (
              <button
                key={network.id}
                className={`border rounded-xl p-3 text-left relative ${
                  selectedNetwork === network.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedNetwork(network.id)}
              >
                <div className="font-medium">{network.name}</div>
                <div className="text-xs text-gray-500">{network.subtitle}</div>
                {selectedNetwork === network.id && (
                  <div className="absolute top-3 right-3 text-green-500">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Amount</h3>
            <div className="flex items-center">
              <input
                type="text"
                value="0.098502"
                className="text-3xl font-medium bg-transparent border-none outline-none w-full"
                onChange={() => {}}
              />
              <div className="text-gray-500">ETH</div>
              <button className="ml-2 bg-green-500 text-white text-xs font-bold rounded px-2 py-1">MAX</button>
            </div>
            <div className="text-gray-500 text-sm">~ $ 239.39</div>
          </div>

          <div className="text-xs text-gray-500 flex justify-between">
            <div>Fee: 0.00000436 ETH</div>
            <button className="text-blue-600">Add fee to Amount</button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <button className="text-sm font-medium border-b-2 border-black mr-4">Address</button>
            <button className="text-sm font-medium text-gray-500 mr-4">Link</button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Recipient address"
              className="w-full border border-gray-200 rounded-lg p-3 pr-16"
            />
            <div className="absolute right-3 top-3 flex gap-2">
              <button>
                <Scan className="w-5 h-5 text-gray-400" />
              </button>
              <button>
                <Copy className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg mt-3">
            <p>
              Send only ETH Ethereum (ERC20) to this address. Sending other assets may result in loss.{" "}
              <span className="text-blue-600 font-medium">Support</span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Receive Amount</h3>
          <div className="flex items-end">
            <div className="text-4xl font-medium">0.0982495</div>
            <div className="text-gray-500 ml-2 mb-1">ETH</div>
            <button className="ml-auto bg-[#c1ff00] text-black font-medium rounded-full px-6 py-2.5 flex items-center">
              Send
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[320px] border-l p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-1">Total Balance</h3>
          <div className="text-4xl font-bold mb-1">$19,280.01</div>
          <div className="flex items-center text-green-500 text-sm">
            <ArrowUp className="w-3 h-3 mr-1" />
            <span>$230.80</span>
            <span className="ml-1">+1.05%</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                className={`text-sm font-medium ${showTokens ? "border-b-2 border-black" : "text-gray-500"}`}
                onClick={() => setShowTokens(true)}
              >
                Tokens
              </button>
              <button
                className={`text-sm font-medium ${!showTokens ? "border-b-2 border-black" : "text-gray-500"}`}
                onClick={() => setShowTokens(false)}
              >
                NFTs
              </button>
            </div>
            <div className="flex items-center text-xs">
              <input type="checkbox" id="hideSmall" className="mr-1" />
              <label htmlFor="hideSmall">Hide Small Balance</label>
            </div>
          </div>

          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.name} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center">
                  {token.name === "ETH" && (
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4L8 16L16 12L24 16L16 4Z" fill="#6366F1" />
                      <path d="M16 12L8 16L16 28L24 16L16 12Z" fill="#6366F1" />
                    </svg>
                  )}
                  {token.name === "FLOW" && (
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#00EF8B" />
                      <path d="M12 12H20V20H12V12Z" fill="white" />
                    </svg>
                  )}
                  {token.name !== "ETH" && token.name !== "FLOW" && (
                    <span className="text-xs font-bold">{token.name.substring(0, 2)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="font-medium">{token.name}</div>
                    <div className={`text-xs ml-2 ${token.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                      {token.change}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{token.fullName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{token.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">${token.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

