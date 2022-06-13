//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";



contract VendorTrainer{
uint32  private vendorId;
uint32 private  trainerId;
struct Vendor
{
string email;
string phone;
string name;
address accountAddr;

}

struct Trainer
{
string name;
string email;
string mobile;
string url;
string tech;

}

mapping(address=>bool)  public vendorExists;
mapping(string=>mapping(string=>bool)) emailExists;
mapping(string=>mapping(string=>bool)) phoneExists;
mapping(uint=>Vendor) vendors;
mapping(uint=>Trainer) trainers;
function checkTrainerExists(string memory email,string memory tech,string memory moble) external view returns (bool)
{

return emailExists[email][tech]&& phoneExists[moble][tech] ;
}

function registerVendor(string memory _name,string memory _email, string memory _phone) external  returns (bool) {
require(!vendorExists[msg.sender],"Vendor Already Exists");
vendorId += 1;
Vendor storage  vndr = vendors[vendorId];

vndr.name=_name;
vndr.email=_email;
vndr.phone=_phone;
vndr.accountAddr=msg.sender;  
vendorExists[msg.sender]=true;
return true;

}
function registerTrainer(string memory _name,string  memory _email, string memory _mobille,string memory _tech,string memory _url)  external returns (bool) {
require(vendorExists[msg.sender],"Vendor Not  Exists");
require(!emailExists[_email][_tech],"Trainer Already Exists");
require(!emailExists[_mobille][_tech],"Trainer Already Exists");
trainerId += 1;
Trainer storage  trn = trainers[trainerId];
trn.name=_name;
trn.email=_email;
trn.mobile=_mobille;
trn.tech=_tech;
trn.url=_url;
emailExists[_email][_tech]=true;
phoneExists[_mobille][_tech]=true;
return true;
}

}