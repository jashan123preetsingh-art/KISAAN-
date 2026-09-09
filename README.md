# Vetan Ledger

An offline-first employee salary and advance manager for small Indian businesses. It is dependency-free, installable with Safari's **Add to Home Screen**, and keeps records persistently in the browser.

## Run and test

```bash
npm start
npm test
npm run check
```

Open `http://localhost:4173`. Use **Settings → Download backup** regularly: browser storage is device-local, so an off-device backup remains important.

Employee CSV imports accept `name,monthly_salary,joining_date,mobile,department,notes`. Name, salary, and joining date are validated before insertion.
