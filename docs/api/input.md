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

Event reads return `LT_OK` with an event, or `LT_ERR_NO_EVENT` when none is available because the timeout passed or the wait was interrupted. On a genuine I/O failure they return the real error, `LT_ERR_READ` or `LT_ERR_POLL`, with `lt_last_errno` set. A failure is never reported as "no event". Before `lt_init` they return `LT_ERR_NOT_INIT`.

## lt_poll_event

Blocks until the next event is available and fills `*event`.

## lt_peek_event

Waits up to `timeout_ms` for an event. A timeout of 0 returns immediately. A negative timeout blocks forever, like `lt_poll_event`.

## lt_get_fds

POSIX only. Exposes the file descriptors libterm waits on, so you can wait on them in your own `select`, `poll` or `epoll` loop instead of blocking in `lt_poll_event`. `*ttyfd` receives the terminal descriptor and `*resizefd` the read end of the SIGWINCH self-pipe. When either becomes readable, call `lt_peek_event(ev, 0)` until it returns `LT_ERR_NO_EVENT`. Either pointer may be NULL to skip it.

| Returns | When |
|---|---|
| `LT_ERR_UNSUPPORTED_TERM` | on Windows, where console handles are not pollable descriptors |
| `LT_ERR_NOT_INIT` | before `lt_init` |

## See also

[Input and events](../guides/input-and-events), [`struct lt_event`](constants/types#struct-lt_event), [Events and keys](constants/events-and-keys).
