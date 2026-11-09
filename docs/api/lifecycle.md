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

Every program opens with one of the three init calls and closes with `lt_shutdown`. Pair them on every exit path, including errors, or the user's shell is left in raw mode.

## lt_init

```c
int lt_init(void);
```

Initialises libterm against the controlling terminal. On POSIX it opens `/dev/tty`. On Windows it uses the active console. It puts the terminal in raw mode, switches to the alternate screen, hides the cursor, allocates the cell buffers at the current size, and on POSIX negotiates the kitty keyboard protocol without blocking. Call it before any drawing or input function.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the terminal is ready |
| `LT_ERR_INIT_ALREADY` | libterm is already initialised |
| `LT_ERR_INIT_OPEN` | the terminal could not be opened, `lt_last_errno` has the cause |
| `LT_ERR_MEM` | the cell buffers could not be allocated |

#### Example

```c
int rc = lt_init();
if (rc != LT_OK) {
  fprintf(stderr, "lt_init: %s\n", lt_strerror(rc));
  return 1;
}
```

#### See also

[lt_shutdown](#lt_shutdown), [Your first program](../getting-started/first-program), [Errors and return codes](../guides/errors).

## lt_init_fd

```c
int lt_init_fd(int ttyfd);
```

POSIX only. Initialises against a terminal descriptor the caller already holds. The descriptor must be a tty, which libterm checks with `isatty`. libterm does not close it on shutdown, so the caller keeps ownership.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `ttyfd` | `int` | an open descriptor that refers to a terminal |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the terminal is ready |
| `LT_ERR_INIT_ALREADY` | libterm is already initialised |
| `LT_ERR_INIT_OPEN` | `ttyfd` is not a tty, or the platform is not POSIX |
| `LT_ERR_MEM` | the cell buffers could not be allocated |

#### Example

```c
int fd = open("/dev/tty", O_RDWR);
if (fd < 0 || lt_init_fd(fd) != LT_OK)
  return 1;
/* ... */
lt_shutdown();
close(fd);   /* still ours to close */
```

#### See also

[lt_init_file](#lt_init_file), [lt_get_fds](input#lt_get_fds).

## lt_init_file

```c
int lt_init_file(const char *path);
```

POSIX only. Opens `path` read-write and initialises against it. libterm owns the resulting descriptor and closes it on shutdown, unlike `lt_init_fd`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `path` | `const char *` | a terminal device path such as `/dev/tty` or `/dev/pts/3` |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the terminal is ready |
| `LT_ERR_INIT_ALREADY` | libterm is already initialised |
| `LT_ERR_INIT_OPEN` | the path cannot be opened or is not a tty, `lt_last_errno` has the cause. Also on non-POSIX platforms |
| `LT_ERR_MEM` | the cell buffers could not be allocated |

#### Example

```c
if (lt_init_file("/dev/tty") != LT_OK)
  return 1;
```

#### See also

[lt_init_fd](#lt_init_fd), [Platform notes](../guides/platforms).

## lt_shutdown

```c
int lt_shutdown(void);
```

Restores the terminal to its state before init. It leaves the alternate screen, disables mouse reporting, shows the cursor, restores the saved termios or console modes, and frees the cell buffers and the grapheme cluster table. The descriptor opened by `lt_init` or `lt_init_file` is closed. A descriptor passed to `lt_init_fd` stays open.

#### Parameters

None.

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the terminal is restored |
| `LT_ERR_NOT_INIT` | libterm was never initialised |

#### Example

```c
struct lt_event ev;
while (lt_poll_event(&ev) == LT_OK) {
  if (ev.type == LT_EVENT_KEY && ev.ch == 'q')
    break;
}
return lt_shutdown() == LT_OK ? 0 : 1;
```

#### See also

[lt_init](#lt_init), [Errors and return codes](../guides/errors#shutting-down-on-every-path).
