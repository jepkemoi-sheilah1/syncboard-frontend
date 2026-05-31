# Syncboard Frontend Fix TODO

## Board creation + board list rendering
- [ ] Verify backend response field names for board title/color (e.g., `boardName` vs `name`, `boardColor` vs `color`).
- [ ] Add temporary debug logging in `BoardsComponent.createBoard()` and `BoardService` to inspect the returned payload.
- [ ] Ensure `BoardsComponent` uses the correct fields when rendering board name + color.
- [ ] Ensure `BoardService.getBoardsByWorkspace()` and `createBoard()` hit correct endpoints.
- [ ] Ensure second/third board color selection works consistently (no stale UI state).

## Lists not working / cannot add lists
- [ ] Inspect `board-detail.component.html` for click handlers and conditional blocks.
- [ ] Verify `ListService.getLists()` endpoint + response mapping match `BoardList` model.
- [ ] Verify `ListService.createList()` endpoint + response mapping match `BoardList` model.
- [ ] Fix `BoardDetailComponent` state updates after list creation:
  - [ ] Currently it sets `lists` only via the subscription to `lists$`; it does not directly re-fetch lists after create.
  - [ ] Ensure `createList()` triggers update to `lists$` (or update `BoardDetailComponent` to re-call `getLists(boardId)` after create).
- [ ] Add minimal UI feedback for list create/save failures.

## Support / Let’s Talk missing
- [ ] Inspect `app.routes.ts` / `app.routes.server.ts` for routes to `support-admin` and/or “let’s talk”.
- [ ] Inspect `support.service.ts` and any buttons/links in templates for correct navigation.
- [ ] Ensure those components are included in route configuration and their modules/standalone imports are correct.

## Project status
- [ ] After each major fix run `npm run build` (and `npm test` if available) to ensure no TS errors.

