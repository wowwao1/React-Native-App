"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var allowedAliasCharacters = exports.allowedAliasCharacters = "\\w\\-\\_\\+\\*\\(\\)\\!#&åô’çéãí“”,";

function getAliasesRegex() {
  return new RegExp(":([" + allowedAliasCharacters + "]+):", "g");
}

exports.default = getAliasesRegex;