# Contributing

Thank you for improving the Twilic JavaScript/TypeScript bindings.

## Scope

This repository contains:

- TypeScript API (`src/`)
- N-API native addon (`crates/twilic-napi`, `native/`)
- WebAssembly build (`crates/twilic-wasm`, `wasm/`)
- Node and integration tests (`tests/`)

Keep changes aligned with the normative spec in [twilic/twilic](https://github.com/twilic/twilic).

## Development

Requirements:

- Node.js 24+
- Rust stable
- `wasm-pack` for WASM builds

Rust dependencies are pinned in the workspace `Cargo.lock`. Use `cargo build --locked` / `cargo test --locked` (the `pnpm` scripts pass these flags). When updating crates, refresh the lockfile in a dedicated commit.

```bash
pnpm install
pnpm build
pnpm test
pnpm fmt:check
pnpm lint
```

CI and publish workflows clone [twilic/twilic-rust](https://github.com/twilic/twilic-rust) as a sibling directory at the commit recorded in `.github/twilic-rust-ref` (shallow `git fetch` of that ref). Bump that file when a release requires a newer Rust crate revision.

npm releases use the `npm-publish` GitHub Environment (required reviewers) and only grant `id-token: write` in the minimal publish job after the package tarball is built.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

Use this format:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, and `chore`.

Examples:

- `feat: add encodePatch transport helper`
- `fix(napi): handle empty batch payloads`

After `pnpm install`, Husky runs Commitlint on each local commit. Pull requests are also checked in CI so every commit in the branch follows the same rules.

## Pull Requests

Use the pull request template and fill in every required section. PR bodies are validated in CI.

## Contribution Checklist

- Tests added or updated for behavior changes
- `pnpm test`, `pnpm fmt:check`, and `pnpm lint` pass locally
- Documentation updated when the public API changes
- Commit messages follow Conventional Commits

By contributing to this repository, you agree that your contribution may be distributed under the MIT license used by the project.
