# Branch Builder

A simple Tauri (Desktop) application to generate a folder tree structure with ability to replace
variables in the folder names. You can also store and load a structure to and from a JSON file.

### Development

The code is mainly React with some key libraries like `@react-spectrum`. You can test it on a
web browser by running

```sh
pnpm dev
```

To run in as a desktop app:

```sh
pnpm tauri dev
```

For new releases just push to the `release` branch. Don't forget to update the version both in the
`package.json` in the root and `src-tauri/tauri.conf.json`. The release with binaries should be
created automatically by github actions.
