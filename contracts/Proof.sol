pragma solidity ^0.4.17;

contract Proof {
  mapping (bytes32 => bool) public proofs;
  uint private countProofNumber;

  function storeProof(bytes32 proof) {
    proofs[proof] = true;
    countProofNumber++;
  }

  function getProofCount() constant returns (uint) {
    return countProofNumber;  
  }

  function notarize(string url) returns (bool) {
    var proof = proofFor(url);
    if (hasProof(proof)) {
      return false;
    }
    storeProof(proof);
    return true;
  }

  function proofFor(string url) constant returns (bytes32) {
    return sha256(url);
  }
  // check if a document has been notarized
  function checkUrl(string url) constant returns (bool) {
    var proof = proofFor(url);
    return hasProof(proof);
  }
  // returns true if proof is stored
  function hasProof(bytes32 proof) constant returns(bool) {
    return proofs[proof];
  }
}