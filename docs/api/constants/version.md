---
title: Version
description: The compile-time version macros and lt_version.
---

# Version

```c
#define LT_VERSION_MAJOR 0
#define LT_VERSION_MINOR 1
#define LT_VERSION_PATCH 1
```

The compile-time version of the header you are building against. `lt_version()` returns the version of the library you link, as a `"MAJOR.MINOR.PATCH"` string.

Versioning is semantic with a pre-1.0 caveat: minor versions may contain breaking API changes, patch versions never do. The CMake package file encodes the same rule, so `find_package(Libterm 0.1)` accepts any 0.1.x.

:::note
As of v0.1.3 the header's `LT_VERSION_PATCH` still reads 1 while `lt_version()` returns `"0.1.3"`. Prefer `lt_version()` until the macros are brought back in step.
:::
