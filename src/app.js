const contractAddress = '0xEe1201d9975506FBF5889a1A7A72D83894A7C76d';  // Replace with your contract address
const contractABI = [
    {
        "inputs": [],
        "name": "declarewinner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paticipate",
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
                "internalType": "uint256",
                "name": "winner",
                "type": "uint256"
            }
        ],
        "name": "winnerdeclared",
        "type": "event"
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
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
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
    }
];

let provider;
let signer;
let lotteryContract;
let userAccount;

window.addEventListener('load', async () => {
    await loadEthers();

    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        userAccount = await signer.getAddress();
        lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log('Connected account:', userAccount);
    } else {
        console.warn('No web3 detected. You should consider trying MetaMask!');
        return;
    }

    document.getElementById('setParameters').addEventListener('click', setParameters);
    document.getElementById('declareWinner').addEventListener('click', declareWinner);
    document.getElementById('showPlayers').addEventListener('click', showPlayers);
    document.getElementById('participate').addEventListener('click', participate);
    document.getElementById('checkWinner').addEventListener('click', checkWinner);
    document.getElementById('checkNumber').addEventListener('click', checkNumber);
});

async function loadEthers() {
    while (!window.ethers) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function setParameters() {
    const minParticipants = document.getElementById('minParticipants').value;
    const minEther = document.getElementById('minEther').value;

    try {
        const tx = await lotteryContract.setParameters(minParticipants, ethers.utils.parseEther(minEther));
        await tx.wait();
        alert('Parameters set successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to set parameters');
    }
}


async function declareWinner() {
	try {
		const tx = await lotteryContract.declarewinner();
		await tx.wait();
			
		// Retrieve the winner address
		const [status, winnerAddress] = await lotteryContract.checkWinner();
		document.getElementById('winnerAddress').textContent = `Winner Address: ${winnerAddress}`;
	} catch (error) {
		console.error(error);
		alert('Failed to declare winner');
	}
}


async function showPlayers() {
    try {
        const players = await lotteryContract.showPlayers();
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';
        players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player;
            playersList.appendChild(listItem);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch players');
    }
}

async function participate() {
    const participationAmount = document.getElementById('participationAmount').value;

    try {
        const tx = await lotteryContract.paticipate({ value: ethers.utils.parseEther(participationAmount) });
        await tx.wait();
        alert('Participation successful!');
    } catch (error) {
        console.error(error);
        alert('Failed to participate');
    }
}

async function checkWinner() {
    try {
        const [status, winner] = await lotteryContract.checkWinner();
        document.getElementById('winnerAddress').textContent = `Winner Address: ${winner}`;
    } catch (error) {
        console.error(error);
        alert('Failed to check winner');
    }
}

async function checkNumber() {
    try {
        const numParticipants = await lotteryContract.checkNumber();
        document.getElementById('numParticipants').textContent = `Number of Participants: ${numParticipants}`;
    } catch (error) {
        console.error(error);
        alert('Failed to check number of participants');
    }
}
