/**
 * Build a simple card with a button that creates a new attachment.
 * This function is called as part of the eventAttachmentTrigger that
 * builds a UI when the user goes through the add-attachments flow.
 *
 * @param e The event object passed to eventAttachmentTrigger function.
 * @return {Card}
 */
function buildSimpleCard(e) {
  var buttonAction = CardService.newAction()
      .setFunctionName('onAddAttachmentButtonClicked');
  var button = CardService.newTextButton()
      .setText('Add a custom attachment')
      .setOnClickAction(buttonAction);

  // Check the event object to determine if the user can add
  // attachments and disable the button if not.
  if (!e.calendar.capabilities.canAddAttachments) {
      button.setDisabled(true);
  }

  // Create and return a Card object
  var cardSection = CardService.newCardSection()
      .addWidget(button);

  var card = CardService.newCardBuilder()
      .addSection(cardSection)
      .build();

  return card;
}

/**
* Callback function for a button action. Adds attachments to the Calendar
* event being edited.
*
* @param {Object} e The action event object.
* @return {CalendarEventActionResponse}
*/
function onAddAttachmentButtonClicked(e) {
  return CardService.newCalendarEventActionResponseBuilder()
      .addAttachments([
          CardService.newAttachment()
              .setResourceUrl("https://example.com/test")
              .setTitle("Custom attachment")
              .setMimeType("text/html")
              .setIconUrl("https://example.com/test.png")
      ])
      .build();
}
