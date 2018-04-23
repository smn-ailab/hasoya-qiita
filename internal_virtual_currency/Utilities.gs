function userNotFound(user) {
  /*
  Do something when user is not registered in this system.
  Currently, just display error message.
  */
  return Utilities.formatString("%s is not registered yet. Try `/create_account` .", user)
}

function getLedger() {
  /*
  Return Google Sheets storing balance of users.
  */
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SHEETID")).getSheets()[0]
}

function getUserIndex(users) {
  /*
  Return associative array of {"user": "index in Google Sheets"}.
  If not found, the value becomes NaN.
  */
  const sheet = getLedger()
  const memberList = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues()

  // Find user from "users" and push them to "userIndex" associative array
  const userIndex = {}
  for (var u in users) {
    userIndex[users[u]] = NaN // Set default value
    for (var m in memberList) {
      if (users[u] === memberList[m][0]) { // User found in the member list
        userIndex[users[u]] = parseInt(m) + 2 // +2 because the sheet has the header row and Google Sheet is 1-origin.
      }
    }
  }

  return userIndex
}

function prependAtSign(x) {
  return "@" + x
}

function removeFirstAtSign(x) {
  return x[0] == "@" ? x.slice(start=1) : x
}
