// SPDX-License-Identifier: MIT
pragma solidity 0.6.9;
pragma experimental ABIEncoderV2;


contract lottery{    
    address  private winnerlottery;
    address private admin;
    address payable [] public participant;
    uint256 private winner;
    bool lottery_status;
    uint256 private minParticipants;
    uint256 private minEther;

constructor(uint256 _minParticipants,uint256 _minEther)public payable{
        admin = msg.sender; 
        lottery_status=false;
        minParticipants=_minParticipants;
        minEther=_minEther;
    }


modifier onlyadmin(){
    require(msg.sender==admin,"only admin");
    _;
}
event rulecreated(address payable[] participant);

function paticipate()public payable{
    require(msg.value>minEther,"amount of ether is not minimum");
    participant.push(msg.sender);
    emit rulecreated(participant);


}

event winnerdeclared(uint256 winner);

function declarewinner()public onlyadmin returns(address){
    require (minParticipants!=0,"minimum amount is not set");
    require(participant.length>minParticipants,"amount of participates must br greater than or equal to minimum amount set by admin");
    require(participant.length >=0,"no particiapants to declare winner");
    require(lottery_status=true,"winner has already been declared");
    winner= uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,participant)))% participant.length;
    winnerlottery= participant[winner];
    (bool success,)=winnerlottery.call{value:address(this).balance}('');
    require(success,"transfer failed");
    lottery_status=true;
    emit winnerdeclared(winner);
    return winnerlottery;
    
}   

function showPlayers() public onlyadmin view returns (address payable [] memory)
{
    require(msg.sender==admin,"only admin can view");
    return participant;
}
modifier onlyparticipant(){
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
function checkWinner()public onlyparticipant view returns(bool,address){
    require(lottery_status);
    return (true,winnerlottery);
}
function checkNumber()public onlyparticipant view returns(uint256){
    return participant.length;
}
}

