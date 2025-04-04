(function ($) {
	"use strict";
  
	// Dropdown menu functionality
	$('nav .dropdown').hover(
	  function () {
		var $this = $(this);
		$this.addClass("show");
		$this.find("> a").attr("aria-expanded", true);
		$this.find(".dropdown-menu").addClass("show");
	  },
	  function () {
		var $this = $(this);
		$this.removeClass("show");
		$this.find("> a").attr("aria-expanded", false);
		$this.find(".dropdown-menu").removeClass("show");
	  }
	);
  
	// Connect Wallet Button Functionality
	async function connectWallet() {
	  const connectButton = document.getElementById("connectWallet");
	  const walletAddressDisplay = document.getElementById("walletAddress");
  
	  if (typeof window.ethereum !== "undefined") {
		try {
		  // Request account access
		  const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		  });
		  const walletAddress = accounts[0];
  
		  // Check if we have permission to send transactions
		  try {
			await window.ethereum.request({
			  method: 'wallet_requestPermissions',
			  params: [{
				eth_accounts: {},
				eth_sendTransaction: {}
			  }]
			});
		  } catch (error) {
			console.log("Transaction permissions not granted:", error);
		  }
  
		  // Display connected wallet address
		  walletAddressDisplay.innerText = `Connected: ${walletAddress}`;
		  console.log("Wallet connected:", walletAddress);
  
		  // Disable the button after connection
		  connectButton.disabled = true;
		  connectButton.innerText = "Wallet Connected";
  
		  // Listen for account changes
		  window.ethereum.on('accountsChanged', function (accounts) {
			if (accounts.length === 0) {
			  // User disconnected their wallet
			  connectButton.disabled = false;
			  connectButton.innerText = "Connect Wallet";
			  walletAddressDisplay.innerText = "";
			} else {
			  // User switched accounts
			  walletAddressDisplay.innerText = `Connected: ${accounts[0]}`;
			}
		  });
  
		  // Listen for chain changes
		  window.ethereum.on('chainChanged', function (chainId) {
			console.log("Chain changed:", chainId);
			// Reload the page to ensure we're on the correct network
			window.location.reload();
		  });
  
		} catch (error) {
		  console.error("Error connecting wallet:", error);
		  alert("Failed to connect wallet. Please try again.");
		}
	  } else {
		alert("MetaMask is not installed. Please install it to use this feature.");
	  }
	}
  
	// Function to send transaction
	async function sendTransaction(to, value) {
	  if (typeof window.ethereum !== "undefined") {
		try {
		  const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		  });
  
		  const transactionParameters = {
			to: to,
			from: accounts[0],
			value: value,
		  };
  
		  const txHash = await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters],
		  });
  
		  console.log("Transaction sent:", txHash);
		  return txHash;
		} catch (error) {
		  console.error("Error sending transaction:", error);
		  throw error;
		}
	  } else {
		throw new Error("MetaMask is not installed");
	  }
	}
  
	// Function to check transaction status
	async function checkTransactionStatus(txHash) {
	  if (typeof window.ethereum !== "undefined") {
		try {
		  const receipt = await window.ethereum.request({
			method: 'eth_getTransactionReceipt',
			params: [txHash],
		  });
		  return receipt;
		} catch (error) {
		  console.error("Error checking transaction status:", error);
		  throw error;
		}
	  }
	}
  
	// Add event listener to the button
	document
	  .getElementById("connectWallet")
	  .addEventListener("click", connectWallet);
  
	// Export functions for use in other files
	window.walletFunctions = {
	  connectWallet,
	  sendTransaction,
	  checkTransactionStatus
	};
  })(jQuery);
  