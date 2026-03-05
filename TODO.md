# Trello-style UI Adjustments - TODO

## Task: Implement Trello-like board UI flow

### Steps:
1. [x] Update board-detail.component.ts - Add signals for tracking new list/card states
2. [x] Update board-detail.component.html - Modify button text and add inline card creation
3. [x] Update board-detail.component.css - Add styles for inline card input
4. [x] Test the implementation

### Details:
- Initial state: Show "Add a list" button (not "Add another list")
- After creating a list: Show "Add another list" + "Create a card" button
- After creating a card: Show "Add card" button for the same list
- Inline card creation instead of modal (Trello-style)

