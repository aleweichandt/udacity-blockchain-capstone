pragma solidity ^0.5.0;

import "./ERC721Mintable.sol";
import "./ISquareVerifier.sol";

contract SolnSquareVerifier is CustomERC721Token {

    ISquareVerifier verifierContract;

    struct Solution {
        uint256 tokenId;
        address to;
    }
    Solution[] private submittedSolutions;
    mapping(bytes32 => Solution) private uniqueSolutions;

    event SolutionAdded(address indexed to, uint256 indexed tokenId, bytes32 indexed key);

    constructor(
        address verifierAddress, string memory name, string memory symbol
    ) CustomERC721Token(name, symbol) public {
        verifierContract = ISquareVerifier(verifierAddress);
    }

    function _addSolution(address _to, uint256 _tokenId, bytes32 _key) internal {
        Solution memory _solution = Solution({
            tokenId: _tokenId,
            to: _to
        });
        submittedSolutions.push(_solution);
        uniqueSolutions[_key] = _solution;
        emit SolutionAdded(_to, _tokenId, _key);
    }

    function mintToken(
        address to, uint256 tokenId, string memory tokenURI, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input
    ) public whenNotPaused {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[key].to == address(0), "Solution in use");
        require(verifierContract.verifyTx(a, b, c, input), "Invalid solution");

        mint(to, tokenId, tokenURI);
        _addSolution(to, tokenId, key);
    }
}
