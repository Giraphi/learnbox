<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Prefer inline callbacks over excessive function definitions

If a function is used only once (e.g. as a callback) and is very short, e.g. only one line, prefer to just define it inline with arrow notation
