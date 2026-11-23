# ANORA Support

A minimal black-and-white web app where visitors give any amount to support the ANORA ministry, then listen to or download the ministry's songs. Includes a link to the ANORA YouTube channel.

Built with Next.js (App Router), Tailwind CSS, Supabase Storage (private audio) and Paystack (Naira and international card payments).

## How it works

1. A visitor taps **Listen** or **Download** on a song.
2. A window asks for an amount (any amount above the minimum, in NGN or USD) and an email for the receipt.
3. The server starts a Paystack checkout and sends the visitor to Paystack's secure page.
4. After paying, Paystack sends them back to `/unlock`. The server asks Paystack to confirm the payment, then creates a one-hour private link to the song.
5. The song stays unlocked on that device. Every play or download re-confirms the payment, so links can't be shared around.



