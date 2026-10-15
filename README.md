# Yishuv — community website (yishuvchasidi.com)

A one-page site for the Chassidishe moshav in Binyamin, with an admin editor, a sign-up form and a
mailing list.

| Part | Tool | Cost |
| --- | --- | --- |
| Hosting | Netlify (builds the site from this GitHub repo) | Free |
| Admin editor | Decap CMS at `/admin` (log in with GitHub) | Free |
| Sign-ups | Netlify Forms (emailed to you; up to 100 a month free) | Free |
| Mailing list | MailerLite (every sign-up is added automatically) | Free up to 1,000 |
| Email `info@yishuvchasidi.com` | Cloudflare Email Routing → forwards to Gmail | Free |
| Domain | Cloudflare Registrar | ~$11/year |

## How it fits together

- **All text, numbers and images** live in `_data/site.json`. Don't edit it by hand; use the editor
  at `yishuvchasidi.com/admin`.
- `index.njk` is the page layout; `styles.css` is the design; `script.js` handles the menu, animations,
  garin squares and form.
- When you click **Publish** in the editor, it saves to GitHub, and Netlify rebuilds the site in about
  a minute.
- `netlify/functions/submission-created.js` adds each sign-up to MailerLite.

## Launch checklist (one time)

1. **Buy the domain** at <https://dash.cloudflare.com> → Domain Registration → Register
   `yishuvchasidi.com` (consider `yishuvchassidi.com` too and redirect it).
2. **Netlify:** sign up at <https://app.netlify.com> with GitHub → *Add new project* → *Import from
   Git* → `Mosesb99/Yishuv`, branch `claude/community-recruitment-site-t98qrh`. Build settings are
   picked up from `netlify.toml`.
3. **Connect the domain:** Netlify → *Domain management* → *Add domain* `yishuvchasidi.com`. Add the
   DNS records Netlify shows in Cloudflare → DNS (set them to "DNS only", grey cloud).
4. **Admin login:**
   - GitHub → Settings → Developer settings → OAuth Apps → *New*. Homepage
     `https://yishuvchasidi.com`, callback URL `https://api.netlify.com/auth/done`. Copy the Client
     ID and generate a secret.
   - Netlify → *Project configuration* → *Access & security* → *OAuth* → *Install provider* → GitHub,
     and paste both.
   - Log in at `https://yishuvchasidi.com/admin`.
5. **Sign-ups:** Netlify → *Forms* → enable form detection, then redeploy. Under *Form notifications*,
   add an email notification to `info@yishuvchasidi.com` (or Gmail).
6. **Mailing list:** create a free MailerLite account → *Integrations* → *API* → generate a token. In
   *Subscribers* → *Groups*, create "Yishuv sign-ups" and copy its ID. In Netlify → *Environment
   variables*, add `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID`, then redeploy.
7. **Email on the domain:** Cloudflare → `yishuvchasidi.com` → *Email* → *Email Routing* → create
   `info@yishuvchasidi.com` → forward to `yishuvproject@gmail.com`. To also *send* as that address
   from Gmail, open Gmail → Settings → *Accounts* → *Send mail as* → add it, with SMTP server
   `smtp.gmail.com`, port 587, your Gmail address, and a Google *app password* (this needs 2-step
   verification turned on).
8. In the editor, change the contact email to the new address.

## Preview on your computer

```sh
npm install
npm start                 # site at http://localhost:8080
npx decap-server          # in a second window: lets /admin edit local files
```
