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

The hardware cursor starts hidden after `lt_init`, the same as termbox2. `lt_shutdown` restores its visibility for the shell.

## lt_set_cursor

```c
int lt_set_cursor(int x, int y);
```

Moves the hardware cursor to `(x, y)` and shows it. `lt_present` keeps the cursor parked there across frames.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x` | `int` | column, 0 at the left |
| `y` | `int` | row, 0 at the top |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the cursor is placed and visible |
| `LT_ERR_OUT_OF_BOUNDS` | a negative coordinate |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_print(2, 1, LT_DEFAULT, LT_DEFAULT, "name: ");
lt_set_cursor(8, 1);          /* the input point, cursor shown */
lt_present();
```

#### See also

[lt_hide_cursor](#lt_hide_cursor), [Screen and rendering](../guides/screen-and-rendering#the-cursor).

## lt_hide_cursor

```c
int lt_hide_cursor(void);
```

Hides the hardware cursor with DECTCEM. Calling it when the cursor is already hidden emits nothing.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the cursor is hidden |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_hide_cursor();             /* leaving the text field */
lt_present();
```

#### See also

[lt_set_cursor](#lt_set_cursor).

## lt_show_cursor

```c
int lt_show_cursor(void);
```

Shows the hardware cursor at its current position. termbox2 has no equivalent, so ported code usually calls `lt_set_cursor` instead.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the cursor is visible |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_show_cursor();             /* back at the position lt_set_cursor last gave it */
```

#### See also

[lt_set_cursor](#lt_set_cursor).
