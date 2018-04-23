function sendCoin(sender, params) {
  const FORMAT = "/send_coin [amount] [recipient]+"

  // Result text
  var resultText = ""

  // Interpret arguments
  const amount = parseInt(params[0])
  const recipients = params.slice(start=1).map(removeFirstAtSign)

  if (isNaN(amount)) { // Given amount is not a number
    resultText = Utilities.formatString("%d is not Integer, Follow this: %s", params[0], FORMAT)
  } else {
    // Get current bank status
    const senderBalance = getBalance(sender)
    if (isNaN(senderBalance)) { // This user is not found.
      resultText = userNotFound(sender)
    } else if (senderBalance < amount * recipients.length) { // Do not have enough coin
      resultText = Utilities.formatString("You have only %d, and cannot pay %d in total.",
                                           senderBalance, amount * recipients.length)
    } else { // Send coin!
      const userIndex = getUserIndex(recipients.concat([sender]))

      const notFoundUsers = [] // If a recipient does not have acccount yet, notify later.
      const ledger = getLedger()
      for (var i in recipients) { // Add coins to each recipient
        const r = recipients[i]
        if (isNaN(userIndex[r])) { // Not member yet.
          notFoundUsers.push(r)
        } else {
          const v = ledger.getRange(userIndex[r], 2).getValue()
          ledger.getRange(userIndex[r], 2).setValue(v + amount)
        }
      }

      // Subtract total amount of sent coins
      const current = ledger.getRange(userIndex[sender], 2).getValue()
      const numPayedUsers = recipients.length - notFoundUsers.length
      const payment = amount * numPayedUsers
      ledger.getRange(userIndex[sender], 2).setValue(current - payment) // Update balance

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
