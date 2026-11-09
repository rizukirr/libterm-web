---
title: Install
description: Build libterm from source, use a prebuilt release, or link it into your own CMake, pkg-config or manual build.
---

# Install

libterm is plain C11 with no dependencies. You can build it with CMake, download a prebuilt release, or compile it with one `cc` command.

## Requirements

- A C11 compiler. GCC and Clang are validated on every commit. MSVC is not validated yet, and Windows builds use MinGW.
- CMake 3.32 or newer, for the CMake build only.

## Build from source

```sh
git clone https://github.com/rizukirr/libterm.git
cd libterm
cmake -B build
cmake --build build
ctest --test-dir build      # the test suite, a few seconds
./build/examples/hello      # try an example
```

The default build produces a static and a shared library plus the examples, benchmarks and tests. [Build options](build-options) lists the switches.

## Prebuilt binaries

Every [release](https://github.com/rizukirr/libterm/releases) ships install trees for Linux (x86_64, aarch64, riscv64), Windows (x86_64, MinGW) and macOS (arm64, x86_64), with a `SHA256SUMS` file. The x86_64 and Linux arm builds select their SIMD backend at runtime, so one binary runs on every CPU of its architecture.

```sh
tar -xzf libterm-v0.1.3-linux-x86_64.tar.gz
sha256sum -c SHA256SUMS --ignore-missing
cmake -B build -DCMAKE_PREFIX_PATH=$PWD/libterm-v0.1.3-linux-x86_64
```

The macOS binaries are unsigned. Run `xattr -d com.apple.quarantine` on the extracted files or build from source.

## Link with CMake

Fetch libterm and link the exported target:

```cmake
include(FetchContent)
FetchContent_Declare(libterm
    GIT_REPOSITORY https://github.com/rizukirr/libterm
    GIT_TAG        v0.1.3)
FetchContent_MakeAvailable(libterm)

target_link_libraries(myapp PRIVATE Libterm::libterm)
```

A vendored checkout works the same way with `add_subdirectory(libterm)`. An installed tree is found with `find_package(Libterm)`.

As a subproject libterm builds only the static library. Examples, benchmarks, tests, the shared library and install rules are skipped, and each can be turned back on with its `LIBTERM_*` option.

Three targets are exported:

| Target | Resolves to |
|---|---|
| `Libterm::libterm` | the static library when built, else the shared one |
| `Libterm::static` | the static archive |
| `Libterm::shared` | the shared library |

The public header is `libterm/libterm.h`:

```c
#include "libterm/libterm.h"
```

## Link with pkg-config

Installed trees, from a release tarball or `cmake --install`, ship a pkg-config file:

```sh
export PKG_CONFIG_PATH=/path/to/prefix/lib/pkgconfig  # only if not a system prefix
cc app.c $(pkg-config --cflags --libs libterm)
```

## Build without a build system

The scalar build is one compiler invocation. CI runs these exact lines in `tests/smoke_manual_build.sh`:

```sh
cc -std=c11 -c src/shared/*.c src/platform/posix/*.c src/intrinsics/scalar.c \
    -Iinclude -Isrc
ar rcs libterm.a *.o
```

On Windows, swap `src/platform/posix/*.c` for `src/platform/windows/*.c`. No defines are needed, since `LT_API` expands to nothing in a static build. A manual build gets the scalar cell scan. Runtime SIMD dispatch needs the CMake build.
