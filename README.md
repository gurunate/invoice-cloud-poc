# Invoice Cloud POC

Proof of concept (POC) for Invoice Cloud embedded payments with an iframe. The goal of this POC is to demonstrate how to use the Invoice Cloud embedded payments iframe to allow a user to pay for an invoice.

## Open Questions

This POC was helpful understanding how to embed a payment checkout process but left a lot of questions unaddressed and unanswered.

-   Where's CSS documentation for styling?
    -   What can/can't we change?
    -   Where do we host images?
-   What can be configured in the checkout screens?
    -   Columns
    -   Fields
    -   Labels
    -   Options
-   Where and how do we configure products (e.g. types)
-   How do we navigate away from the final screen in the checkout process?
    -   What does `ReturnURL` do?
-   Is there lexicon of system terms?
    -   Tenant (_e.g._ insurance carrier)
    -   Customer
-   What's configurable and where?
    -   Is there an API to add, update and remove tenant configurations?
-   Are there system events that we can hook into?
    -   Webhooks
    -   Payment transitions

## Getting Started

### Install

```bash
$ yarn install
```

### Run

```bash
$ yarn dev
```

Go to http://localhost:3137/

### Host

Add a `local.invoicecloud.com` entry to your hosts file (_e.g._ `/etc/hosts`) pointed to your loopback.

```
127.0.0.1   local.invoicecloud.com
```

Go to http://local.invoicecloud.com:3137/

## Implementation

This POC was crafted with [Next.js](https://nextjs.org/) and [MUI](https://mui.com/) to echo and reflect the current Omega implementation.

The `164` (Insurance1 - Type TBD) and `165` (Insurance2 - Type TBD) type IDs are fixed and must have been created in the Invoice Cloud admin portal. I'm assuming that the `typeId` will be created by someone in the admin portal and then passed to the frontend.

The POC was intended to include CSS styling, but I was unable to find the supporting documentation to implement the styling. I did find the [Invoice Cloud CSS](https://www.invoicecloud.com/ssotest/sso-gmp.css).

I'm also assuming the payment screen interfaces can be adjusted to include only the fields that are needed for the payment. The **Account #** and **Invoice #** columns may be needed for a payment but may not be ideal to display to the end-user. Additionally the **Options** column with _View Invoice_, _Remove_, _Related Invoice_, and _Remind Me_ may not be needed.

## Screenshots

The following screenshots are from the POC.

### Please review your selection

![Please review your selection](<docs/localhost_3137_%20(1).png> 'Please review your selection')

### How much would you like to pay?

![How much would you like to pay?](<docs/localhost_3137_%20(2).png> 'How much would you like to pay?')

### Please enter your card information

![Please enter your card information](<docs/localhost_3137_%20(3).png> 'Please enter your card information')

### Review your information

![Review your information](<docs/localhost_3137_%20(4).png> 'Review your information')

### Thank you for your payment!

![Thank you for your payment!](<docs/localhost_3137_%20(5).png> 'Thank you for your payment!')

## References

-   [Invoice Cloud](https://www.invoicecloud.com/)
-   [Next.js](https://nextjs.org/)
-   [MUI](https://mui.com/)
