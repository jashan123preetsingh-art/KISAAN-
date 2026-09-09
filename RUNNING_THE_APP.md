# How to run Vetan Ledger

## Windows — easiest local method

1. Extract `Vetan-Ledger.zip` to a normal folder. Do not run it from inside the ZIP preview.
2. Install the free **Node.js LTS** version from <https://nodejs.org> if it is not already installed.
3. Double-click **`START-VETAN.bat`**.
4. Your browser opens `http://localhost:4173`. Keep the black terminal window open while using Vetan Ledger.
5. To stop the app, close the terminal window.

No `npm install` is needed. The app has no third-party runtime dependencies.

## macOS or Linux

Open Terminal in the extracted folder and run:

```bash
chmod +x start-vetan.sh
./start-vetan.sh
```

Alternatively, on any computer with Node.js:

```bash
npm start
```

Then visit <http://localhost:4173>.

## iPhone / iPad

An iPhone cannot run the included local server directly. Host the folder on any HTTPS static host (GitHub Pages, Cloudflare Pages, or Netlify), then:

1. Open the HTTPS address in **Safari**.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Open Vetan Ledger from its new Home Screen icon.

For the cheapest setup, GitHub Pages is free for a public repository. In the repository, open **Settings → Pages**, select **Deploy from a branch**, select the current branch and `/ (root)`, then save. GitHub displays the HTTPS address when deployment completes.

## Where is the data?

Vetan Ledger saves data in the browser on the device where it is used. Refreshing or restarting the app does not erase it, but clearing browser/site data can.

Use **Settings → Download backup** regularly and keep that JSON file somewhere safe, such as iCloud Drive or Google Drive. Use **Settings → Restore backup** to move or recover the records.

Use only one primary browser/device at a time. This low-cost edition does not synchronize multiple devices; that would require a hosted database and authentication.
