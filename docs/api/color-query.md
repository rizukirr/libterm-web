---
title: Colour query
description: lt_query_color and lt_is_dark_background read back the colours the terminal is using.
---

# Colour query

```c
int lt_query_color(int what, uint32_t *rgb, int timeout_ms);
int lt_is_dark_background(int timeout_ms);
```

## lt_query_color

Queries the terminal's actual colour for `what`: `LT_COLOR_DEFAULT_FG`, `LT_COLOR_DEFAULT_BG`, or a palette index 0 to 255. On success it writes a packed `0x00RRGGBB`, 8 bits per channel and the same packing as a truecolor `lt_attr`, to `*rgb` and returns `LT_OK`.

On POSIX this is a real round-trip. libterm emits OSC 10, 11 or 4 with the index, reads the reply off the tty, and waits at most `timeout_ms`. A negative timeout selects the 1000 ms default. Key bytes that arrive during the wait are preserved and delivered by the next `lt_poll_event` or `lt_peek_event`.

On Windows the answer comes immediately from the console colour table through `GetConsoleScreenBufferInfoEx`. There is no escape round-trip and `timeout_ms` is ignored. The table has 16 entries, so palette indexes above 15 return `LT_ERR_UNSUPPORTED_TERM`.

| Returns | When |
|---|---|
| `LT_ERR_NO_EVENT` | no usable reply arrived in time, as on older terminals and some multiplexers. tmux answers OSC 10 and 11 with its own colours |
| `LT_ERR_UNSUPPORTED_TERM` | Windows, palette index above 15 |
| `LT_ERR_OUT_OF_BOUNDS` | `what` outside -2 to 255 |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `rgb` is NULL |

## lt_is_dark_background

Queries the default background and reports whether it is dark: 1 for dark, 0 for light, or a negative `LT_ERR_*` passed through from `lt_query_color`. The threshold is the ITU-R BT.709 relative luminance at 50 percent. Treat an error as "unknown" and fall back to a default theme.

## See also

[Colors and attributes](../guides/colors-and-attributes#querying-the-terminals-colours), the `theme` example.
