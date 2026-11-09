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

All three work before `lt_init`.

## lt_strerror

```c
const char *lt_strerror(int code);
```

Describes an `LT_*` return code. The full table of codes and their text is in [Return codes](constants/return-codes).

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `code` | `int` | any value returned by a libterm function |

#### Returns

A static, human-readable string such as `"coordinates out of bounds"`. Never NULL. `"unknown error"` for a code libterm does not recognise. The string must not be freed or modified.

#### Example

```c
int rc = lt_set_cell(-1, 0, 'x', 0, 0);
if (rc != LT_OK)
  fprintf(stderr, "lt_set_cell: %s\n", lt_strerror(rc));   /* coordinates out of bounds */
```

#### See also

[lt_last_errno](#lt_last_errno), [Errors and return codes](../guides/errors).

## lt_version

```c
const char *lt_version(void);
```

The version of the library you are linked against.

#### Parameters

None.

#### Returns

A static `"MAJOR.MINOR.PATCH"` string, for example `"0.1.3"`.

#### Example

```c
printf("libterm %s\n", lt_version());
```

#### See also

[Version](constants/version).

## lt_last_errno

```c
int lt_last_errno(void);
```

The `errno` captured at the most recent failing system call inside libterm: the `open` or `tcsetattr` behind `LT_ERR_INIT_OPEN`, or the `read` or `select` behind `LT_ERR_READ` and `LT_ERR_POLL`. Only the platform syscall paths set it. Logical errors such as `LT_ERR_OUT_OF_BOUNDS` and `LT_ERR_NOT_INIT` leave it unchanged.

#### Parameters

None.

#### Returns

The saved `errno`, or 0 if nothing has failed.

#### Example

```c
int rc = lt_init();
if (rc == LT_ERR_INIT_OPEN)
  fprintf(stderr, "cannot open the terminal: %s\n", strerror(lt_last_errno()));
```

#### See also

[lt_strerror](#lt_strerror), [Errors and return codes](../guides/errors#the-errno-behind-a-failure).
