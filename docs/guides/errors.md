---
title: Errors and return codes
description: How libterm reports failure, what lt_strerror and lt_last_errno give you, and which codes each area returns.
---

# Errors and return codes

Every function that can fail returns an `int`: `LT_OK`, which is 0, on success, or a negative `LT_ERR_*` code. Functions that return a mode (`lt_set_input_mode`, `lt_set_output_mode`, `lt_detect_color_depth`) return the mode instead, and functions that return a measurement (`lt_width`, `lt_wcwidth`, the UTF-8 helpers) document their own conventions.

```c
int rc = lt_init();
if (rc != LT_OK) {
  fprintf(stderr, "lt_init: %s", lt_strerror(rc));
  if (lt_last_errno())
    fprintf(stderr, " (%s)", strerror(lt_last_errno()));
  fputc('\n', stderr);
  return 1;
}
```

## Describing a code

`lt_strerror(code)` returns a static, human-readable description such as `"coordinates out of bounds"`. It never returns NULL. An unknown code gives `"unknown error"`. Do not free or modify the string.

## The errno behind a failure

Some codes come from a failed system call: the `open` or `tcsetattr` behind `LT_ERR_INIT_OPEN`, the `read` or `select` behind `LT_ERR_READ` and `LT_ERR_POLL`. `lt_last_errno()` returns the `errno` captured at the most recent such failure, or 0 if nothing has failed. Pass it to `strerror(3)`.

Only the platform syscall paths set it. Logical errors such as `LT_ERR_OUT_OF_BOUNDS` or `LT_ERR_NOT_INIT` leave it unchanged.

## Codes you will see in practice

| Code | When |
|---|---|
| `LT_ERR_NOT_INIT` | any drawing or input call before `lt_init`, or `lt_shutdown` without an init |
| `LT_ERR_INIT_ALREADY` | a second `lt_init` without a shutdown |
| `LT_ERR_INIT_OPEN` | the terminal could not be opened or is not a tty, and on Windows from `lt_init_fd` and `lt_init_file` |
| `LT_ERR_OUT_OF_BOUNDS` | an off-buffer `(x, y)`, a negative cursor coordinate, or a `what` outside -2 to 255 in `lt_query_color` |
| `LT_ERR_NO_EVENT` | `lt_peek_event` timed out, or a colour query got no reply in time |
| `LT_ERR_UNSUPPORTED_TERM` | `lt_get_fds` on Windows, or a Windows colour query for a palette index above 15 |
| `LT_ERR_MEM` | the buffers could not be allocated, or the grapheme cluster table is full |
| `LT_ERR` | a NULL pointer argument, or an empty cluster |
| `LT_ERR_READ`, `LT_ERR_POLL` | a real I/O failure while reading input, with `lt_last_errno` set |

The complete table with numeric values is in [Return codes](../api/constants/return-codes).

## Shutting down on every path

`lt_init` leaves the terminal in raw mode on the alternate screen. If the process exits without `lt_shutdown`, the user's shell inherits that state. Pair every `lt_init` with an `lt_shutdown`, including on error paths and in signal handlers you install yourself. `lt_shutdown` itself returns `LT_ERR_NOT_INIT` when there is nothing to undo, so calling it defensively is safe.
