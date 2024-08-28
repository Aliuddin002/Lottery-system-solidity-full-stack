const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress = "0x675a0d31E82D34cc74b447CF5592a4352d832292";
const contractABI =[
    {
        "inputs": [],
        "name": "claimPrize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "declarewinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "participate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_minParticipants",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minEther",
                "type": "uint256"
            }
        ],
        "name": "setParameters",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address payable[]",
                "name": "participant",
                "type": "address[]"
            }
        ],
        "name": "rulecreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "winnerAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winnerIndex",
                "type": "uint256"
            }
        ],
        "name": "winnerdeclared",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkWinner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minEther",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minParticipants",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "participant",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "showPlayers",
        "outputs": [
            {
                "internalType": "address payable[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winner",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winnerlottery",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const lotteryContract= new ethers.Contract(contractAddress,contractABI,signer);
document.getElementById('connectButton').addEventListener('click', async () => {
    await provider.send("eth_requestAccounts", []);
    const userAddress = await signer.getAddress();
    document.getElementById('output').innerText = `Connected to ${userAddress}`;
});
document.getElementById('setParamsButton').addEventListener('click', async () => {
    const minParticipants = document.getElementById('minParticipants').value;
    const etherValue = document.getElementById('minEtherInput').value;
    const weiValue = ethers.utils.parseEther(etherValue);

    if (!minParticipants || !weiValue) {
        document.getElementById('output').innerText = 'Please enter both minimum participants and minimum ether.';
        return;
    }

    try {
        const tx = await lotteryContract.setParameters(minParticipants, weiValue);
        await tx.wait();

        document.getElementById('output').innerText = 'Parameters have been set successfully.';
    } catch (error) {
        console.error('Error setting parameters:', error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('participateButton').addEventListener('click', async () => {
    try {
        const minEther = await lotteryContract.minEther();
        const amountToSend = ethers.utils.parseEther(ethers.utils.formatEther(minEther));

        const tx = await lotteryContract.participate({ value: amountToSend });
        await tx.wait();

        document.getElementById('output').innerText = `Successfully participated in the lottery`;
    } catch (error) {
        if (error.message.includes("You have already entered the lottery.")) {
            document.getElementById('output').innerText = `Error: You have already entered the lottery.`;
        } else if (error.message.includes("amount of ether is not minimum")) {
            document.getElementById('output').innerText = `Error: The amount of Ether sent is below the minimum required.`;
        } else {
            document.getElementById('output').innerText = `Error: ${error.message}`;
        }
    }
});
document.getElementById('declareWinnerButton').addEventListener('click', async () => {
    try {
        const tx = await lotteryContract.declarewinner();
        await tx.wait();
        document.getElementById('output').innerText = `Winner has been declared `;
    } catch (error) {
        console.error('Error declaring winner:', error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('claimPrizeButton').addEventListener('click', async () => {
    try {
        const tx = await lotteryContract.claimPrize();
        await tx.wait();
        document.getElementById('output').innerText = 'Prize claimed successfully!';
    } catch (error) {
        console.error('Error claiming prize:', error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});
document.getElementById('showPlayersButton').addEventListener('click', async () => {
    try {
        const players = await lotteryContract.showPlayers();
        document.getElementById('output').innerText = `Players: ${players.join(", ")}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('checkWinnerButton').addEventListener('click', async () => {
    try {
        const winnerlottery = await lotteryContract.checkWinner();
        document.getElementById('output').innerText = `Winner: ${winnerlottery}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('checkNumberButton').addEventListener('click', async () => {
    try {
        const numParticipants = await lotteryContract.checkNumber();
        document.getElementById('output').innerText = `Number of Participants: ${numParticipants}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});
