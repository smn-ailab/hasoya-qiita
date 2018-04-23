function doPost(e)
{
  // Validate token
  if (e.parameter.token != PropertiesService.getScriptProperties().getProperty("SLACKTOKEN"))
  {
    throw new Error('Invalid token');
  }

  // This is response format
  var response = { text: "" };

  // Parse arguments and check them
  var commandParams = e.parameter.text.trim().replace(/\s\s+/g, ' ').split(" ") // string.split does not support regex...

  // Switch process by command
  switch(e.parameter.command){
    case "/create_account":
      response.text = createAccount(e.parameter.user_name,
                                    PropertiesService.getScriptProperties().getProperty("DEFAULTAMOUNT"))
      break;
    case "/send_coin":
      response.text = sendCoin(e.parameter.user_name, commandParams)
      break;
    case "/check_balance":
      response.text = checkBalance(e.parameter.user_name)
      break;
    default: // Not be called because arguments are controled by Slack client.
      response.text = Utilities.formatString("Command %s is not supported.", e.parameter.command)
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
