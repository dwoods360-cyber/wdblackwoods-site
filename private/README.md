# Private Early Reader Data

Copy `early-readers.example.csv` to `early-readers.csv` for local use.

Keep actual names and email addresses local only. Back up the real CSV privately, and never commit it.

Use `Status` values:

- `active`
- `paused`
- `do_not_contact`

Only `active` readers are eligible for local Gmail mail-merge CSV generation.

Generated files are written to `private/out/` and must remain local.

Copy `early-reader-send-log.example.csv` to `early-reader-send-log.csv` when you
want to keep a local send history. The real send log is ignored by git and
should remain append-only by default.

Use send-log `Status` values:

- `prepared`
- `sent`
- `cancelled`
- `expired`
