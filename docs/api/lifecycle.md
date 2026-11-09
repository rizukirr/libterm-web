---
title: Lifecycle
description: lt_init, lt_init_fd, lt_init_file and lt_shutdown.
---

# Lifecycle

```c
int lt_init(void);
int lt_init_fd(int ttyfd);
int lt_init_file(const char *path);
int lt_shutdown(void);
```

## lt_init

Initialises libterm against the controlling terminal. On POSIX it opens `/dev/tty`. On Windows it uses the active console. It puts the terminal in raw mode, switches to the alternate screen, hides the cursor, and allocates the cell buffers at the current size. On POSIX it also negotiates the kitty keyboard protocol without blocking.

Call it before any drawing or input function.

| Returns | When |
|---|---|
| `LT_OK` | success |
| `LT_ERR_INIT_ALREADY` | already initialised |
| `LT_ERR_INIT_OPEN` | the terminal could not be opened, `lt_last_errno` has the cause |
| `LT_ERR_MEM` | the buffers could not be allocated |

## lt_init_fd

POSIX only. Initialises against a caller-supplied terminal descriptor. The descriptor must be a tty, checked with `isatty`. libterm does not close it on shutdown. The caller owns it.

Returns the same codes as `lt_init`. On non-POSIX platforms it returns `LT_ERR_INIT_OPEN`.

## lt_init_file

POSIX only. Opens `path`, for example `/dev/tty` or `/dev/pts/3`, read-write and initialises against it. libterm owns the resulting descriptor and closes it on shutdown, unlike `lt_init_fd`.

Returns `LT_ERR_INIT_OPEN` if the path cannot be opened or is not a tty, with `lt_last_errno` set. On non-POSIX platforms it returns `LT_ERR_INIT_OPEN`.

## lt_shutdown

Restores the terminal to its state before init: leaves the alternate screen, disables mouse reporting, shows the cursor, restores the saved termios or console modes, and frees the cell buffers and the grapheme cluster table. The descriptor opened by `lt_init` or `lt_init_file` is closed. A descriptor passed to `lt_init_fd` stays open.

Returns `LT_ERR_NOT_INIT` if libterm was never initialised.

## See also

[Your first program](../getting-started/first-program), [Errors and return codes](../guides/errors).
