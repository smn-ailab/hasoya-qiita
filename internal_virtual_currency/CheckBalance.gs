function getBalance(user) {
  /*
  Return current balance value of given user, if not found, return Nan.
  The Google Sheets format must be [user_name, balance].
  */

  // Find the user index
  const userIndex = getUserIndex([user])[user]

  // Get balance using index
  var balance = NaN
  if (!isNaN(userIndex)) {
    balance = getLedger().getRange(userIndex, 2).getValue()
  }

  return balance
}

function checkBalance(user) {
  /*
  Return response text for `/check_balance` command.
  */

  const balance = getBalance(user)

  var resultText = ""
  if (isNaN(balance)) {
    resultText = userNotFound(user)
  } else {
    resultText = Utilities.formatString("You have %d coin.", balance)
  }

  return resultText
}
