# cp-admin-panel

This is a `TypeScript + Next.js` application based on `Materialize` template for AllPay Crypto Payment Widget admin dashboard and a widget page

# How to use?
### 1. Set correct NPM_TOKEN (ex. `export NPM_TOKEN=npm_qweQWE`) for successfully install bof-utils
### 2. Update `.env` file (ask your teammates)
### 3. Run `yarn install`
### 4. Run `yarn dev`

Note: 
- for `/merchant` route you need to register or use existing user (email: admin@bitoftrade.com, password: admin)
- for `/payment/[orderId]` you should only connect wallet (currently only metamask) and put existing order in url (need to create him on WooCommerce) 
