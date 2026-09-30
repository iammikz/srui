# Publishing `@iammikz/srui`

How to publish the library package from this monorepo. The changesets
workflow is already initialized (`.changeset/`) and the package is currently
versioned at `1.0.0`, so the one-time work is an npm account and login.

## One-time setup

### 1. Prerequisite: an npm account (no org needed)

The package publishes as `@iammikz/srui` — a **personal user scope**. npm
grants every user automatic publish rights under their own `@username/*`
scope, so unlike an org scope there is nothing to create or claim: sign up
at [npmjs.com](https://www.npmjs.com) and you're done.

(If the package is ever renamed again, per the implementation plan's gotcha
table that means deleting `node_modules` and `pnpm-lock.yaml` and running
`pnpm install` again, because pnpm's workspace links go stale.)

### 2. Log in from the terminal

```bash
npm login        # opens the browser, stores an auth token
npm whoami       # should print your username
```

## Per-release steps

### 3. Build fresh

Never publish a stale `dist/`:

```bash
pnpm install
pnpm build       # tsup (index.js + index.d.ts) + scripts/build-css.mjs (srui.css)
```

Sanity-check that all four publish artifacts exist and are non-empty:

- `packages/react/dist/index.js`
- `packages/react/dist/index.d.ts`
- `packages/react/dist/srui.css`
- `packages/react/src/styles/` (theme, animations, presets — the CSS export subpaths)

### 4. Set the version

The current version (`1.0.0`) is already set via a consumed changeset. For
every release after it:

```bash
pnpm changeset           # interactive: pick @iammikz/srui, bump type, describe it
pnpm changeset version   # consumes .changeset/*.md, bumps version + CHANGELOG.md
git add -A && git commit -m "chore: version package"
```

### 5. Dry-run the tarball

```bash
cd packages/react
pnpm pack dry-run
```

The tarball must contain `dist/`, `src/styles/`, `llms.txt`,
`ACCESSIBILITY.md`, `package.json`, `CHANGELOG.md` — and nothing from
`src/components` or the tests (the `files` field in `package.json` controls
this).

### 6. Publish

From `packages/react` (or add `--filter @iammikz/srui` from the root):

```bash
pnpm publish --access public --no-git-checks
```

- `--access public` is **mandatory** — scoped packages default to
  `restricted`, which makes installs fail for everyone else.
- If your npm account has 2FA, add `--otp=123456`.
- Drop `--no-git-checks` if you want pnpm to verify a clean working tree on
  a branch — keep it only when publishing from a dirty checkout.

### 7. Verify from the outside world

```bash
npm view @iammikz/srui version     # should print the version just published

mkdir /tmp/smoke && cd /tmp/smoke && npm init -y
npm install @iammikz/srui@0.1.0 tailwindcss @tailwindcss/vite
```

Then follow the [Installation page](http://localhost:5211/docs/installation)
(the `@import`s + `@source` line) and confirm a `<Button>` renders styled.
That satisfies the implementation plan §1.6 Definition of Done:
*installable by version number from a registry, not just via `workspace:*`*.

## Optional safeguards (not yet applied)

- `"prepublishOnly": "pnpm build"` in `packages/react/package.json` — a
  publish can then never ship stale dist output.
- `"publishConfig": { "access": "public" }` — bakes the access flag in so a
  bare `pnpm publish` works.

## Alternative: publish from CI

Instead of publishing from a workstation, use the
[changesets/action](https://github.com/changesets/action) in GitHub Actions:

1. Create an npm **automation/granular token** with publish rights on the
   `@srui` scope.
2. Add it as the `NPM_TOKEN` repository secret.
3. Add a workflow step (can live in `.github/workflows/ci.yml`) that runs
   `changesets/action` — it opens a "Version Packages" PR whenever
   changesets exist and publishes automatically when that PR merges.

## Caveat

Everything up to step 6 has been rehearsed in this repo (the `0.1.0`
tarball packs and installs cleanly), but the actual `publish` against the
real registry can only be verified once you own the `srui` scope.
