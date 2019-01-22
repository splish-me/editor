# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased](https://github.com/splish-me/editor/compare/0.4.5..HEAD)

### Breaking Changes

- `@splish-me/editor` replaces `@splish-me/editor-core`, `@splish-me/editor-core-contexts`, `@splish-me/editor-core-document` and `@splish-me/editor-core-types`
- `@splish-me/editor-html-renderer` replaces `@splish-me/editor-core-html-renderer`
- `@splish-me/editor-renderer` replaces `@splish-me/editor-core-renderer`
- `@splish-me/editor-ui` replaces `@splish-me/editor-ui-add-sidebar`, `@splish-me/editor-ui-mode-toolbar`, `@splish-me/editor-ui-plugin-sidebar` and `@splish-me/editor-ui-sidebar`
- Don't provide `module` entry anymore

### Added

- Add shortcuts for undo and redo
- Pass plugins as dictionary

### Deprecated

- Passing plugins as array is deprecated and will be removed in the next minor version. Pass plugins as dictionary instead.

### Fixed

- Serialize nested documents correctly
- Handle edge cases of undo/redo correctly

## [0.4.5](https://github.com/splish-me/editor/compare/bfdbd94d9a7af0b47bbf88e4eaeb3b541a150c53..0.4.5) - January 14, 2019
