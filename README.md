# Vetan Ledger

An offline-first employee salary and advance manager for small Indian businesses. It is dependency-free, installable with Safari's **Add to Home Screen**, and keeps records persistently in the browser.

## Run

Download and extract the ZIP, then double-click `START-VETAN.bat` on Windows. On macOS/Linux, run `./start-vetan.sh`. See **[RUNNING_THE_APP.md](RUNNING_THE_APP.md)** for complete local, iPhone, hosting, and backup instructions.

No dependency installation is required. With Node.js installed, you can also run:

```bash
npm start
```

Then open `http://localhost:4173`.

## Test

```bash
npm test
npm run check
```

Use **Settings → Download backup** regularly: browser storage is device-local, so an off-device backup remains important.

Employee CSV imports accept `name,monthly_salary,joining_date,mobile,department,notes`. Name, salary, and joining date are validated before insertion.
