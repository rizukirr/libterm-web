---
title: Return codes
description: LT_OK and every LT_ERR_* code with its value and its lt_strerror text.
---

# Return codes

Every code is an `int`. `LT_OK` is 0 and every error is negative, so `rc < 0` tests for failure. `lt_strerror` returns the text in the last column.

| Code | Value | Meaning | `lt_strerror` |
|---|---|---|---|
| `LT_OK` | 0 | success | ok |
| `LT_ERR` | -1 | a generic failure, usually a NULL pointer or an empty argument | generic error |
| `LT_ERR_NEED_MORE` | -2 | an escape sequence is incomplete and more input is needed | need more input |
| `LT_ERR_INIT_ALREADY` | -3 | `lt_init` called while already initialised | already initialized |
| `LT_ERR_INIT_OPEN` | -4 | the terminal could not be opened or is not a tty, `lt_last_errno` has the cause | failed to open terminal |
| `LT_ERR_MEM` | -5 | an allocation failed or the grapheme cluster table is full | out of memory |
| `LT_ERR_NO_EVENT` | -6 | no event within the timeout, or no reply to a colour query | no event |
| `LT_ERR_NO_TERM` | -7 | no terminal is available | no terminal |
| `LT_ERR_NOT_INIT` | -8 | a call that needs a terminal before `lt_init` | not initialized |
| `LT_ERR_OUT_OF_BOUNDS` | -9 | a coordinate or index outside the valid range | coordinates out of bounds |
| `LT_ERR_READ` | -10 | reading input failed, `lt_last_errno` has the cause | read error |
| `LT_ERR_RESIZE_IOCTL` | -11 | the terminal size ioctl failed | resize: ioctl failed |
| `LT_ERR_RESIZE_PIPE` | -12 | the resize self-pipe could not be created | resize: pipe failed |
| `LT_ERR_RESIZE_SIGACTION` | -13 | the SIGWINCH handler could not be installed | resize: sigaction failed |
| `LT_ERR_POLL` | -14 | waiting for input failed, `lt_last_errno` has the cause | poll failed |
| `LT_ERR_TCGETATTR` | -15 | reading the terminal attributes failed | tcgetattr failed |
| `LT_ERR_TCSETATTR` | -16 | setting the terminal attributes failed | tcsetattr failed |
| `LT_ERR_UNSUPPORTED_TERM` | -17 | the operation is not available on this terminal or platform | unsupported terminal |
| `LT_ERR_RESIZE_WRITE` | -18 | writing to the resize self-pipe failed | resize: write failed |
| `LT_ERR_RESIZE_POLL` | -19 | polling the resize self-pipe failed | resize: poll failed |
| `LT_ERR_RESIZE_READ` | -20 | reading the resize self-pipe failed | resize: read failed |
| `LT_ERR_RESIZE_SSCANF` | -21 | parsing a size report failed | resize: sscanf failed |
| `LT_ERR_CAP_COLLISION` | -22 | two terminal capabilities collided | capability collision |

The values mirror termbox2's `TB_ERR_*` codes, so code that compares against numbers keeps working through the compat header.

See [Errors and return codes](../../guides/errors) for which calls return which codes.
