// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title TrashNFT
 * @dev ゴミNFTを誰にでも送りつけることができるコントラクト
 * 完全にジョークですが、オンチェーンに永遠に刻まれます
 */
contract TrashNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    // ゴミの種類
    struct TrashData {
        string name;
        string emoji;
        string description;
        uint8 stinkLevel;
        uint256 thrownAt;
        address thrownBy;
    }

    mapping(uint256 => TrashData) public trashData;

    // イベント
    event TrashThrown(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        string trashName,
        uint8 stinkLevel
    );

    constructor() ERC721("Trash NFT", "TRASH") Ownable(msg.sender) {}

    /**
     * @dev ゴミを投げつける（ミント＆転送）
     * @param to 受け取る人のアドレス
     * @param name ゴミの名前
     * @param emoji ゴミの絵文字
     * @param description ゴミの説明
     * @param stinkLevel 臭さレベル (0-10)
     */
    function throwTrash(
        address to,
        string memory name,
        string memory emoji,
        string memory description,
        uint8 stinkLevel
    ) public returns (uint256) {
        require(to != address(0), "Cannot throw trash into the void");
        require(stinkLevel <= 10, "Stink level too high even for trash");
        require(bytes(name).length > 0, "Trash must have a name");

        uint256 tokenId = _nextTokenId++;

        // ゴミデータを保存
        trashData[tokenId] = TrashData({
            name: name,
            emoji: emoji,
            description: description,
            stinkLevel: stinkLevel,
            thrownAt: block.timestamp,
            thrownBy: msg.sender
        });

        // ミントして直接送り先に
        _safeMint(to, tokenId);

        emit TrashThrown(tokenId, msg.sender, to, name, stinkLevel);

        return tokenId;
    }

    /**
     * @dev オンチェーンでメタデータを生成
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        _requireOwned(tokenId);

        TrashData memory trash = trashData[tokenId];

        // SVGを生成
        string memory svg = _generateSVG(trash);

        // JSONメタデータを生成（引数を減らすために分割）
        string memory namePart = string(abi.encodePacked('{"name": "', trash.emoji, ' ', trash.name, '",'));
        string memory descPart = string(abi.encodePacked('"description": "', trash.description, ' | Stink Level: ', Strings.toString(trash.stinkLevel), '/10 | Thrown by: ', Strings.toHexString(trash.thrownBy), '",'));
        string memory imagePart = string(abi.encodePacked('"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",'));
        string memory jsonPart1 = string(abi.encodePacked(namePart, descPart, imagePart, '"attributes": ['));
        
        string memory attr1 = string(abi.encodePacked('{"trait_type": "Stink Level", "value": ', Strings.toString(trash.stinkLevel), '},'));
        string memory attr2 = string(abi.encodePacked('{"trait_type": "Thrown At", "value": ', Strings.toString(trash.thrownAt), '},'));
        string memory attr3 = '{"trait_type": "Category", "value": "Trash"}';
        string memory jsonPart2 = string(abi.encodePacked(attr1, attr2, attr3, ']}'));
        
        string memory json = string(abi.encodePacked(jsonPart1, jsonPart2));
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    /**
     * @dev SVG画像を生成（エクスプローラー対応版）
     * エクスプローラーで正しく表示されるように、XML宣言と適切な属性を追加
     */
    function _generateSVG(TrashData memory trash) internal pure returns (string memory) {
        // 臭さレベルに応じた色
        string memory stinkColor = trash.stinkLevel > 7 ? "#FF0000" : 
                                   trash.stinkLevel > 4 ? "#FF8800" : "#88FF00";
        
        // 輝くうんちの場合は金色のタイトルを使用
        bool isGolden = keccak256(abi.encodePacked(trash.name)) == keccak256(abi.encodePacked(unicode"輝くうんち")) ||
                        keccak256(abi.encodePacked(trash.name)) == keccak256(abi.encodePacked("Shining Poop"));
        string memory titleColor = isGolden ? "#FFD700" : "#4ADE80";
        
        // 最終兵器の場合は絵文字を💩に変更（選択画面は👶のまま）
        bool isDiaper = keccak256(abi.encodePacked(trash.name)) == keccak256(abi.encodePacked(unicode"最終兵器")) ||
                        keccak256(abi.encodePacked(trash.name)) == keccak256(abi.encodePacked("Final Weapon"));
        string memory displayEmoji = isDiaper ? unicode"💩" : trash.emoji;
        
        // 臭いの波線を生成
        string memory stinkLines = _generateStinkLines(trash.stinkLevel);
        
        // 臭さレベルのテキストを事前に生成
        string memory stinkLevelStr = Strings.toString(trash.stinkLevel);
        string memory stinkLevelText = string(abi.encodePacked('Stink Level: ', stinkLevelStr, '/10'));
        
        // 輝くうんちのキラキラ演出を生成
        string memory sparkles = isGolden ? _generateSparkles() : "";
        
        // SVGを生成（Basescan互換性を向上）
        string memory svg1 = string(abi.encodePacked(
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" preserveAspectRatio="xMidYMid meet">',
            '<defs>',
                '<radialGradient id="bg" cx="50%" cy="50%" r="50%">',
                    '<stop offset="0%" style="stop-color:#1a0a2e"/>',
                    '<stop offset="100%" style="stop-color:#0f0f0f"/>',
                '</radialGradient>',
                '<filter id="glow">',
                    '<feGaussianBlur stdDeviation="3" result="coloredBlur"/>',
                    '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>',
                '</filter>',
            '</defs>',
            '<rect width="400" height="400" fill="url(#bg)"/>',
            '<text x="200" y="180" text-anchor="middle" font-size="120" filter="url(#glow)" fill="#FFFFFF">', displayEmoji, '</text>',
            sparkles
        ));
        
        string memory svg2a = string(abi.encodePacked(
            '<text x="200" y="260" text-anchor="middle" font-size="24" fill="', titleColor, '" font-family="Arial, sans-serif" font-weight="bold">', trash.name, '</text>',
            '<text x="200" y="300" text-anchor="middle" font-size="16" fill="', stinkColor, '" font-family="Arial, sans-serif">', stinkLevelText, '</text>'
        ));
        
        string memory svg2b = string(abi.encodePacked(
            stinkLines,
            '<text x="200" y="380" text-anchor="middle" font-size="12" fill="#666" font-family="Arial, sans-serif">TRASH NFT</text>',
            '</svg>'
        ));
        
        return string(abi.encodePacked(svg1, svg2a, svg2b));
    }

    /**
     * @dev 臭い線を生成
     */
    function _generateStinkLines(uint8 stinkLevel) internal pure returns (string memory) {
        if (stinkLevel < 3) return "";
        
        uint8 numLines = stinkLevel / 2;
        if (numLines > 5) numLines = 5; // 最大5本に制限
        
        // シンプルな実装：各パスを個別に生成して結合
        string memory line1 = "";
        string memory line2 = "";
        string memory line3 = "";
        string memory line4 = "";
        string memory line5 = "";
        
        if (numLines >= 1) {
            line1 = string(abi.encodePacked(
                '<path d="M140,140 Q150,120 140,100" stroke="#84CC16" stroke-width="3" fill="none" opacity="0.6">',
                '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></path>'
            ));
        }
        if (numLines >= 2) {
            line2 = string(abi.encodePacked(
                '<path d="M170,140 Q180,120 170,100" stroke="#84CC16" stroke-width="3" fill="none" opacity="0.6">',
                '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></path>'
            ));
        }
        if (numLines >= 3) {
            line3 = string(abi.encodePacked(
                '<path d="M200,140 Q210,120 200,100" stroke="#84CC16" stroke-width="3" fill="none" opacity="0.6">',
                '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></path>'
            ));
        }
        if (numLines >= 4) {
            line4 = string(abi.encodePacked(
                '<path d="M230,140 Q240,120 230,100" stroke="#84CC16" stroke-width="3" fill="none" opacity="0.6">',
                '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></path>'
            ));
        }
        if (numLines >= 5) {
            line5 = string(abi.encodePacked(
                '<path d="M260,140 Q270,120 260,100" stroke="#84CC16" stroke-width="3" fill="none" opacity="0.6">',
                '<animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></path>'
            ));
        }
        
        return string(abi.encodePacked(line1, line2, line3, line4, line5));
    }

    /**
     * @dev 輝くうんち用のキラキラ演出を生成
     */
    function _generateSparkles() internal pure returns (string memory) {
        // 複数のキラキラを配置（絵文字の周りに）
        string memory sparkle1 = string(abi.encodePacked(
            '<text x="120" y="120" font-size="30" fill="#FFD700" opacity="0.9">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.8;1.2;0.8" dur="0.5s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        string memory sparkle2 = string(abi.encodePacked(
            '<text x="280" y="120" font-size="30" fill="#FFD700" opacity="0.9">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" begin="0.25s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.8;1.2;0.8" dur="0.5s" begin="0.25s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        string memory sparkle3 = string(abi.encodePacked(
            '<text x="100" y="200" font-size="25" fill="#FFD700" opacity="0.8">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" begin="0.1s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.7;1.3;0.7" dur="0.6s" begin="0.1s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        string memory sparkle4 = string(abi.encodePacked(
            '<text x="300" y="200" font-size="25" fill="#FFD700" opacity="0.8">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" begin="0.35s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.7;1.3;0.7" dur="0.6s" begin="0.35s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        string memory sparkle5 = string(abi.encodePacked(
            '<text x="150" y="250" font-size="20" fill="#FFD700" opacity="0.7">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.2;0.9;0.2" dur="0.7s" begin="0.2s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.6;1.4;0.6" dur="0.7s" begin="0.2s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        string memory sparkle6 = string(abi.encodePacked(
            '<text x="250" y="250" font-size="20" fill="#FFD700" opacity="0.7">',
            unicode'✨',
            '<animate attributeName="opacity" values="0.2;0.9;0.2" dur="0.7s" begin="0.45s" repeatCount="indefinite"/>',
            '<animateTransform attributeName="transform" type="scale" values="0.6;1.4;0.6" dur="0.7s" begin="0.45s" repeatCount="indefinite"/>',
            '</text>'
        ));
        
        return string(abi.encodePacked(sparkle1, sparkle2, sparkle3, sparkle4, sparkle5, sparkle6));
    }

    // 必要なオーバーライド
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev 総発行数
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}





