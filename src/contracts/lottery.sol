// SPDX-License-Identifier: MIT
pragma solidity 0.6.9;
pragma experimental ABIEncoderV2;

contract lottery {
    address payable public winnerlottery;
    address public admin;
    address payable [] public participant;
    uint256 public winner;
    bool lottery_status;
    uint256 public minParticipants=0;
    uint256 public minEther=0;
    bool private parameterSet = false;

    constructor() public {
        admin = msg.sender; 
        lottery_status = false;
    }

    modifier onlyadmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    modifier onlyparticipant() {
        bool isParticipant = false;
        for (uint i = 0; i < participant.length; i++) {
            if (participant[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(isParticipant, "only participant");
        _;
    }

    event rulecreated(address payable[] participant);
    event winnerdeclared(address winnerAddress, uint256 winnerIndex);

    function participate() public payable {
    require(msg.value >= minEther, "amount of ether is not minimum");
    for (uint i = 0; i < participant.length; i++) {
        require(participant[i] != msg.sender, "You have already entered the lottery.");
    }
    participant.push(payable(msg.sender));
    emit rulecreated(participant);
    }

    function declarewinner() public onlyadmin  {
        require(minParticipants != 0, "minimum amount is not set");
        require(participant.length >= minParticipants, "amount of participants must be greater than or equal to minimum amount set by admin");
        require(!lottery_status, "winner has already been declared");
        
        winner = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participant))) % participant.length;
        winnerlottery = participant[winner];
        lottery_status=true;        
    }
    function claimPrize() public {
        require(msg.sender == winnerlottery);
        require(lottery_status=true);
        winnerlottery.transfer(address(this).balance);
    }

    function showPlayers() public view onlyadmin returns (address payable[] memory) {
        return participant;
    }

    function checkWinner() public view onlyparticipant returns ( address) {
        return  winnerlottery;
    }

    function checkNumber() public view onlyparticipant returns (uint256) {
        return participant.length;
    }

    function setParameters(uint256 _minParticipants, uint256 _minEther) public onlyadmin {
        require(!parameterSet,"Participants and min amount have already been set");
        minParticipants = _minParticipants;
        minEther = _minEther;
        parameterSet=true;
    }
}
