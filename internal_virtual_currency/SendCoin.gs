function sendCoin(sender, params) {
  var FORMAT = "/send_coin [amount] [recipient]+"

  // Result text
  var resultText = ""

  // Interpret arguments
  var amount = parseInt(params[0])
  var recipients = params.slice(start=1).map(removeFirstAtSign)

  if (isNaN(amount)) { // Given amount is not a number
    resultText = Utilities.formatString("%d is not Integer, Follow this: %s", params[0], FORMAT)
  } else {
    // Get current bank status
    var senderBalance = getBalance(sender)
    if (isNaN(senderBalance)) { // This user is not found.
      resultText = userNotFound(sender)
    } else if (senderBalance < amount * recipients.length) { // Do not have enough coin
      resultText = Utilities.formatString("You have only %d, and cannot pay %d in total.",
                                           senderBalance, amount * recipients.length)
    } else { // Send coin!
      var userIndex = getUserIndex(recipients.concat([sender]))

      var notFoundUsers = [] // If a recipient does not have acccount yet, notify later.
      var ledger = getLedger()
      for (var i in recipients) { // Add coins to each recipient
        var r = recipients[i]
        if (isNaN(userIndex[r])) { // Not member yet.
          notFoundUsers.push(r)
        } else {
          var v = ledger.getRange(userIndex[r], 2).getValue()
          ledger.getRange(userIndex[r], 2).setValue(v + amount)
        }
      }

      // Subtract total amount of sent coins
      var v = ledger.getRange(userIndex[sender], 2).getValue()
      var numPayedUsers = recipients.length - notFoundUsers.length
      var payment = amount * numPayedUsers
      ledger.getRange(userIndex[sender], 2).setValue(v - payment) // Update balance

      resultText = Utilities.formatString("You successfully payed %d in total to %d users.",
                                          payment, numPayedUsers)

      if (notFoundUsers.length > 0) { // Could not pay coins to some of them
        resultText += Utilities.formatString("\n%s are not registered yet. Please invite them and make them try `/create_account` .",
                                             notFoundUsers.map(prependAtSign))
      }
    }
  }

  return resultText
}
