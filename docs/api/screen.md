---
title: Screen
description: lt_width, lt_height, lt_clear, lt_set_clear_attrs, lt_present and lt_invalidate.
---

# Screen

```c
int lt_width(void);
int lt_height(void);
int lt_clear(void);
int lt_set_clear_attrs(lt_attr fg, lt_attr bg);
int lt_present(void);
int lt_invalidate(void);
```

The back buffer is where you draw. `lt_present` is the one call that moves it to the terminal. [Screen and rendering](../guides/screen-and-rendering) explains the model.

## lt_width

```c
int lt_width(void);
```

The back buffer's width in cells. It tracks the terminal and is already updated when an `LT_EVENT_RESIZE` is delivered.

#### Parameters

None.

#### Returns

The width in columns, or 0 before `lt_init`.

#### Example

```c
int x = (lt_width() - 20) / 2;   /* left edge of a 20-column box, centred */
```

#### See also

[lt_height](#lt_height), [Tutorial 2](../tutorials/drawing-and-layout).

## lt_height

```c
int lt_height(void);
```

The back buffer's height in cells. It tracks the terminal and is already updated when an `LT_EVENT_RESIZE` is delivered.

#### Parameters

None.

#### Returns

The height in rows, or 0 before `lt_init`.

#### Example

```c
int status_row = lt_height() - 1;   /* the last row */
```

#### See also

[lt_width](#lt_width).

## lt_clear

```c
int lt_clear(void);
```

Resets every back-buffer cell to a blank in the current clear attributes and marks all rows dirty, so the next `lt_present` paints a cleared screen. It emits nothing by itself.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the buffer is cleared |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_clear();
draw_everything();
lt_present();
```

#### See also

[lt_set_clear_attrs](#lt_set_clear_attrs), [lt_present](#lt_present).

## lt_set_clear_attrs

```c
int lt_set_clear_attrs(lt_attr fg, lt_attr bg);
```

Sets the foreground and background used to fill cleared cells, both by `lt_clear` and when the buffer grows on a resize. The default is the terminal's own colours, 0 and 0.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `fg` | `lt_attr` | foreground for blank cells, attribute flags allowed |
| `bg` | `lt_attr` | background for blank cells |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the attributes are set |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_set_output_mode(LT_OUTPUT_TRUECOLOR);
lt_set_clear_attrs(LT_DEFAULT, LT_RGB(18, 18, 24));   /* a dark canvas */
lt_clear();
```

#### See also

[lt_clear](#lt_clear), [Colors and attributes](../guides/colors-and-attributes).

## lt_present

```c
int lt_present(void);
```

Renders the back buffer. It compares the buffer with the last presented frame and emits only the changed cells, as cursor moves, SGR sequences and glyphs, inside a DEC 2026 synchronized-update bracket. A frame with no changes writes nothing. Call it once after a batch of drawing calls.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the frame is on screen |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| a write or move error code | the terminal write failed, `lt_last_errno` has the cause |

#### Example

```c
lt_print(0, 0, LT_DEFAULT, LT_DEFAULT, "frame 1");
lt_present();                 /* writes "frame 1" */
lt_present();                 /* nothing changed, writes nothing */
```

#### See also

[lt_invalidate](#lt_invalidate), [Screen and rendering](../guides/screen-and-rendering#presenting-a-frame).

## lt_invalidate

```c
int lt_invalidate(void);
```

Forces the next `lt_present` to repaint every cell, bypassing the diff. Use it after `lt_send`, `lt_sendf` or any other out-of-band write has made the terminal differ from libterm's model of it.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the next present will repaint everything |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_sendf("\x1b]0;%s\x07", "my app");   /* set the window title */
lt_invalidate();
lt_present();
```

#### See also

[lt_send](raw-output#lt_send), [lt_present](#lt_present).
