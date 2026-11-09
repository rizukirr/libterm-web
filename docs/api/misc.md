---
title: Miscellaneous
description: lt_strerror, lt_version and lt_last_errno.
---

# Miscellaneous

```c
const char *lt_strerror(int code);
const char *lt_version(void);
int lt_last_errno(void);
```

## lt_strerror

Returns a static, human-readable description of an `LT_*` return code, for example `"coordinates out of bounds"`. Never NULL. An unrecognised code gives `"unknown error"`. The string must not be freed or modified. The full table is in [Return codes](constants/return-codes).

## lt_version

Returns the library version as a static `"MAJOR.MINOR.PATCH"` string, for example `"0.1.3"`.

## lt_last_errno

Returns the `errno` captured at the most recent failing system call inside libterm: the `open` or `tcsetattr` behind `LT_ERR_INIT_OPEN`, or the `read` or `select` behind `LT_ERR_READ` and `LT_ERR_POLL`. Pass it to `strerror(3)` to see the underlying cause. Returns 0 if nothing has failed.

Only the platform syscall paths set it. Logical errors such as `LT_ERR_OUT_OF_BOUNDS` and `LT_ERR_NOT_INIT` leave it unchanged.

## See also

[Errors and return codes](../guides/errors).
