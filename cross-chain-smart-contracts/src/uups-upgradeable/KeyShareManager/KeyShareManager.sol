// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract KeyShareManager is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    /**
     * @dev address used by TSS-Clients to determine which privateShare is used to sign messages.
     */
    address public signer;

    /**
     * @dev Mapping of keyShareAdmin address to keyShareHolder address.
     *  only keyShareAdmin can set keyShareHolder address.
     */
    mapping(address => address) public keyShareHolderByAdmin;
    /**
     * @dev array of keyShareAdmins. Can be modified only by smart contract owner
     */
    address[] internal _keyShareAdmins;

    /**
     * @dev no constructor in upgradable contracts. Instead we have initializers
     */
    function initialize(address _owner) public initializer {
        __Ownable_init();
        _transferOwnership(_owner);
    }

    /**
     * @dev required by the OZ UUPS module
     */
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    modifier onlyKeyShareAdmin() {
        require(isKeyShareAdmin(msg.sender), "Initiator is not KeyShareAdmin");
        _;
    }

    function isKeyShareAdmin(address keyShareAdmin) public view returns (bool) {
        for (uint256 i = 0; i < _keyShareAdmins.length; i++) {
            if (_keyShareAdmins[i] == keyShareAdmin) {
                return true;
            }
        }
        return false;
    }

    function setKeyShareAdmins(address[] memory shareKeyAdmins) external onlyOwner {
        _keyShareAdmins = shareKeyAdmins;
    }

    function setKeyShareHolder(address keyShareHolder) external onlyKeyShareAdmin {
        keyShareHolderByAdmin[msg.sender] = keyShareHolder;
    }

    function keyShareAdmins() public view returns (address[] memory) {
        return _keyShareAdmins;
    }
}
