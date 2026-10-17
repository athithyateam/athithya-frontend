<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# File Mutation and Snapshot Gating
- All file edits must strictly execute through native tools (`replace_file_content` or `write_to_file`) to preserve `/rewind` snapshot lineage.
- If an exact-match replacement returns an error, execute `view_file` on the target line range to inspect exact whitespace and re-attempt native replacement.
- Terminal execution (`run_command`) is restricted to build tools, tests, and version control; stream editors (`sed`, `awk`, `perl`) are prohibited for file modifications.

