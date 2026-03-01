# AGENTS.md - Skyjt CLI Tool Development Guide

## Build/Lint/Test Commands

```bash
# Install dependencies
npm install

# Run linting (uses StandardJS + ESLint)
npm run eslintfix
# OR manually:
eslint ./jt.js --fix

# Run tests (currently not configured)
npm test

# Commit and publish workflow
npm run cz          # Commitizen workflow
npm run push        # Version bump, publish, and push
npm run bug         # Quick bug fix commit and publish
```

## Code Style Guidelines

### Formatting
- **Indent**: 2 spaces (EditorConfig configured)
- **Line endings**: LF
- **Charset**: UTF-8
- **Trailing whitespace**: Trimmed
- **Final newline**: Required

### JavaScript Standards
- Uses **StandardJS** with custom globals: `$`, `describe`, `it`, `define`, `db`
- Parser: `babel-eslint`
- Key rules:
  - No semicolons
  - Single quotes for strings
  - 2-space indentation
  - No trailing commas
  - CamelCase preferred (though not enforced)

### Imports/Requires
- Use `const` for imports
- Order: built-in modules → external packages → internal modules
- Example:
  ```javascript
  const fs = require('fs')
  const path = require('path')
  const $ = require('meeko')
  ```

### Naming Conventions
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE (for true constants)
- **Modules**: camelCase
- **Classes**: PascalCase

### Error Handling
- Use try/catch blocks
- Log errors with `$.err()` (from meeko)
- Exit process with `process.exit(1)` on critical failures
- Include stack traces in development: `console.log(e.stack)`

### Project Structure
```
bin/           # CLI entry points
lib/           # Core functionality modules
  ├── init/    # Project initialization
  ├── lint/    # Lint config generation
  ├── cc/      # Code complexity scanning
  └── ...      # Other tools
test/          # Test files
exampleConfig/ # Template configurations
```

### CLI Development
- Uses `commander` for CLI argument parsing
- Commands defined in `bin/skyjt.js`
- Each command has an alias and description
- Use `$.Spinner()` for loading indicators
- Global `$` object from `meeko` provides utilities

### Git Workflow
- Uses Commitizen with custom adapter `cz-jt`
- Conventional commits with changelog generation
- Bug fixes use `:bug:` emoji prefix

### Ignored Files
See `.eslintignore`:
- node_modules, coverage, test directories
- Generated files: jtFrontCheck.html, jtFrontEasyCheck.html
- IDE files: .vscode, .idea
- Output directories: /output
