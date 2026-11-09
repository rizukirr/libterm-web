---
title: Cursor
description: lt_set_cursor, lt_hide_cursor and lt_show_cursor.
---

# Cursor

```c
int lt_set_cursor(int x, int y);
int lt_hide_cursor(void);
int lt_show_cursor(void);
```

The hardware cursor starts hidden after `lt_init`, the same as termbox2. `lt_shutdown` restores its visibility.

## lt_set_cursor

Moves the hardware cursor to `(x, y)`, 0-based from the top-left, and shows it. `lt_present` keeps the cursor parked at that position across frames.

| Returns | When |
|---|---|
| `LT_ERR_OUT_OF_BOUNDS` | a negative coordinate |
| `LT_ERR_NOT_INIT` | before `lt_init` |

## lt_hide_cursor

Hides the hardware cursor with DECTCEM. Calling it when the cursor is already hidden emits nothing. Returns `LT_ERR_NOT_INIT` before `lt_init`.

## lt_show_cursor

Shows the hardware cursor at its current position. termbox2 has no equivalent, so ported code usually calls `lt_set_cursor` instead. Returns `LT_ERR_NOT_INIT` before `lt_init`.

## See also

[Screen and rendering](../guides/screen-and-rendering#the-cursor).
