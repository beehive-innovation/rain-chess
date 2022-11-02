const {ethers} = require('ethers') 


function hex_to_ascii(str1)
 {
 var hex  = str1.toString();
 var str = '';
 for (var n = 0; n < hex.length; n += 2) {
  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
 }  
 console.log(str.replace( /[\x00-\x1F\x7F-\xA0]+/g, '' ))
 console.log(str.replace( /[\x00-\x1F\x7F-\xA0]+/g, '' ) == 'Siddharth_Bhoite')

 return str.replace( /[\x00-\x1F\x7F-\xA0]+/g, '' );
 }  

 // hex_to_ascii('0x3cb80085')  


 const iface = new Interface([
    // Constructor
    "constructor(string symbol, string name)",
  
    // State mutating method
    "function transferFrom(address from, address to, uint amount)",
  
    // State mutating method, which is payable
    "function mint(uint amount) payable",
  
    // Constant method (i.e. "view" or "pure")
    "function balanceOf(address owner) view returns (uint)",
  
    // An Event
    "event Transfer(address indexed from, address indexed to, uint256 amount)",
  
    // A Custom Solidity Error
    "error AccountLocked(address owner, uint256 balance)",
  
    // Examples with structured types
    "function addUser(tuple(string name, address addr) user) returns (uint id)",
    "function addUsers(tuple(string name, address addr)[] user) returns (uint[] id)",
    "function getUser(uint id) view returns (tuple(string name, address addr) user)"
  ]);

 function test() {

    const iface = new ethers.utils.Interface([
        // Constructor
        "function func1(uint x, uint y)",
      
        // State mutating method
        "function func2()",
      
        // State mutating method, which is payable
        "function mint() payable",
      
      ]);  

      const fragment = iface.getFunction("func1")

      console.log(iface.getSighash(fragment))


 } 
// 0x3cb8008500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002 
 test()