---
title: Raw output
description: lt_send and lt_sendf write bytes straight to the terminal.
---

# Raw output

```c
int lt_send(const char *buf, size_t nbuf);
int lt_sendf(const char *fmt, ...);
```

Both bypass the cell buffer. They exist for escape sequences libterm does not model. After a raw write that changes what is on screen, call `lt_invalidate` so the next `lt_present` repaints everything.

## lt_send

```c
int lt_send(const char *buf, size_t nbuf);
```

Writes `nbuf` bytes verbatim to the terminal. They are buffered and flushed immediately. The caller owns their correctness and any effect on the rendered screen.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `buf` | `const char *` | the bytes to write |
| `nbuf` | `size_t` | how many of them |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the bytes were written |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `buf` is NULL |

#### Example

```c
static const char bell[] = "\a";
lt_send(bell, 1);                       /* ring the terminal bell */
```

#### See also

[lt_sendf](#lt_sendf), [lt_invalidate](screen#lt_invalidate).

## lt_sendf

```c
int lt_sendf(const char *fmt, ...);
```

A `printf`-style wrapper over `lt_send`. The text is formatted into an internal fixed buffer, truncated if it would exceed it, and then sent.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `fmt`, `...` | `const char *` | a `printf` format and its arguments |

#### Returns

As `lt_send`.

#### Example

```c
lt_sendf("\x1b]0;%s\x07", "my app");    /* OSC 0: set the window title */
lt_invalidate();
```

#### See also

[lt_send](#lt_send), [Screen and rendering](../guides/screen-and-rendering#when-the-terminal-and-libterm-disagree).
