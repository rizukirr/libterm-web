---
title: Raw output
description: lt_send and lt_sendf write bytes straight to the terminal.
---

# Raw output

```c
int lt_send(const char *buf, size_t nbuf);
int lt_sendf(const char *fmt, ...);
```

## lt_send

Writes `nbuf` raw bytes straight to the terminal, bypassing the cell buffer. Use it for escape sequences libterm does not model, such as setting the window title or toggling a custom mode. The bytes are buffered and flushed immediately, and emitted verbatim. The caller owns their correctness and any effect on the rendered screen.

After a raw write that changes what is on screen, call `lt_invalidate` so the next `lt_present` repaints everything.

| Returns | When |
|---|---|
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `buf` is NULL |

## lt_sendf

A `printf`-style wrapper over `lt_send`. Formats into an internal fixed buffer, truncating if the result would exceed it, then sends the result.

## See also

[Screen and rendering](../guides/screen-and-rendering#when-the-terminal-and-libterm-disagree).
