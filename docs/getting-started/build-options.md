---
title: Build options
description: The CMake options libterm understands, and how the SIMD backend is chosen.
---

# Build options

Pass any of these to `cmake -B build -D<OPTION>=<value>`. `cmake -LH build` lists them with their current values.

| Option | Default | Effect |
|---|---|---|
| `LIBTERM_BUILD_STATIC` | `ON` | build the static library |
| `LIBTERM_BUILD_SHARED` | `ON` when top level | build the shared library |
| `LIBTERM_BUILD_EXAMPLES` | `ON` when top level | build the programs in `examples/` |
| `LIBTERM_BUILD_TESTS` | `ON` when top level | build the unit tests for `ctest` |
| `LIBTERM_BUILD_BENCH` | `ON` when top level | build the benchmarks |
| `LIBTERM_INSTALL` | `ON` when top level | generate install rules |
| `LIBTERM_BUILD_FUZZERS` | `OFF` | build the libFuzzer targets, Clang only |
| `LIBTERM_WARNINGS_AS_ERRORS` | `OFF` | compile with `-Werror` |
| `LIBTERM_SIMD` | `auto` | the cell-scan backend, see below |

"When top level" means the option defaults to `ON` when libterm is the project being configured and to `OFF` when it is pulled in as a subproject with `add_subdirectory` or `FetchContent`.

## The SIMD backend

`lt_present` finds changed cells with a vectorised scan. `LIBTERM_SIMD` selects how that scan is built.

With `auto`, the default, every backend the target architecture supports is compiled in and the best one is chosen at startup from the CPU's own capabilities:

| Architecture | Candidates, in order of preference |
|---|---|
| x86-64 | AVX-512, AVX2, scalar, chosen with `cpuid` |
| Linux AArch64 | SVE, NEON, chosen from `hwcap` |
| macOS arm64 | NEON only, so the build is static |
| Linux riscv64 | RVV, scalar |

One binary is fast on capable CPUs and never executes an illegal instruction on older ones.

Pin a single backend with `scalar`, `avx2`, `avx512`, `neon`, `sve` or `rvv`. That builds only the named backend with no dispatch, which is useful for benchmarks and minimal builds. A manual build without CMake always gets `scalar`.

## Windows

Windows builds are validated with MinGW. From a POSIX host:

```sh
cmake -B build-mingw -DCMAKE_TOOLCHAIN_FILE=cmake/toolchains/mingw-w64.cmake \
      -DLIBTERM_BUILD_TESTS=OFF -DLIBTERM_BUILD_EXAMPLES=OFF -DLIBTERM_BUILD_BENCH=OFF
cmake --build build-mingw
```

CI also runs the test suite natively on a Windows runner.
