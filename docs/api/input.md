---
title: Input
description: lt_poll_event, lt_peek_event and lt_get_fds.
---

# Input

```c
int lt_poll_event(struct lt_event *event);
int lt_peek_event(struct lt_event *event, int timeout_ms);
int lt_get_fds(int *ttyfd, int *resizefd);
```

Event reads fill a `struct lt_event` and return `LT_OK`. When nothing is available they return `LT_ERR_NO_EVENT`. On a genuine I/O failure they return the real error, `LT_ERR_READ` or `LT_ERR_POLL`, with `lt_last_errno` set. A failure is never reported as "no event". [Input and events](../guides/input-and-events) describes the event struct and the two input models.

## lt_poll_event

```c
int lt_poll_event(struct lt_event *event);
```

Blocks until the next event is available.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `event` | `struct lt_event *` | receives the event |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | `*event` holds a key, mouse or resize event |
| `LT_ERR_NO_EVENT` | the wait was interrupted |
| `LT_ERR_READ`, `LT_ERR_POLL` | a real I/O failure, `lt_last_errno` has the cause |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
struct lt_event ev;
while (lt_poll_event(&ev) == LT_OK) {
  if (ev.type == LT_EVENT_KEY && (ev.ch == 'q' || ev.key == LT_KEY_ESC))
    break;
  if (ev.type == LT_EVENT_RESIZE)
    redraw();
}
```

#### See also

[lt_peek_event](#lt_peek_event), [struct lt_event](constants/types#struct-lt_event), [Events and keys](constants/events-and-keys).

## lt_peek_event

```c
int lt_peek_event(struct lt_event *event, int timeout_ms);
```

Waits up to `timeout_ms` for an event.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `event` | `struct lt_event *` | receives the event |
| `timeout_ms` | `int` | 0 returns immediately, a positive value waits that many milliseconds, a negative value blocks forever like `lt_poll_event` |

#### Returns

As `lt_poll_event`. `LT_ERR_NO_EVENT` also when the timeout passes.

#### Example

```c
struct lt_event ev;
for (;;) {
  int rc = lt_peek_event(&ev, 16);          /* about 60 frames a second */
  if (rc == LT_OK && ev.type == LT_EVENT_KEY && ev.ch == 'q')
    break;
  if (rc != LT_OK && rc != LT_ERR_NO_EVENT)
    break;                                   /* a real error */
  tick();
  lt_present();
}
```

#### See also

[lt_poll_event](#lt_poll_event).

## lt_get_fds

```c
int lt_get_fds(int *ttyfd, int *resizefd);
```

POSIX only. Exposes the descriptors libterm waits on, so you can wait on them in your own `select`, `poll` or `epoll` loop instead of blocking in `lt_poll_event`. When either becomes readable, call `lt_peek_event(ev, 0)` until it returns `LT_ERR_NO_EVENT`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `ttyfd` | `int *` | receives the terminal descriptor. May be NULL |
| `resizefd` | `int *` | receives the read end of the SIGWINCH self-pipe. May be NULL |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the descriptors are filled in |
| `LT_ERR_UNSUPPORTED_TERM` | on Windows, where console handles are not pollable descriptors |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
int tty, rsz;
lt_get_fds(&tty, &rsz);
struct pollfd fds[] = {{tty, POLLIN, 0}, {rsz, POLLIN, 0}, {sock, POLLIN, 0}};
poll(fds, 3, -1);
struct lt_event ev;
while (lt_peek_event(&ev, 0) == LT_OK)
  handle(&ev);
```

#### See also

[Input and events](../guides/input-and-events#your-own-event-loop-on-posix), [Platform notes](../guides/platforms).
