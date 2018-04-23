function createAccount(user, defaultAmount) {
  /*
  If the user is not registered, set default amount.
  */
  var resultText = ""

  // Check if user is not registered yet
  const userIndex = getUserIndex([user])[user]

  if (isNaN(userIndex)) { // New user
    const sheet = getLedger()
    sheet.appendRow([user, defaultAmount])
    resultText = Utilities.formatString("Your account is created, and you have %d. Enjoy!", defaultAmount)
  } else {
    resultText = "Your account already exists. Try `/check_balance` to see your balance."
  }

  return resultText
}
