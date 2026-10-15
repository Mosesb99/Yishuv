// Runs automatically on Netlify after every verified form submission.
// Adds the person to the MailerLite mailing list.
//
// Set these in Netlify → Site configuration → Environment variables:
//   MAILERLITE_API_KEY   MailerLite → Integrations → API → Generate new token
//   MAILERLITE_GROUP_ID  (optional) MailerLite → Subscribers → Groups → the group's ID
exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const data = payload.data || {};
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (payload.form_name !== "join" || !data.email || !apiKey) {
    return { statusCode: 200, body: "skipped" };
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      email: data.email,
      fields: { name: data.name || "", phone: data.phone || "" },
      groups: groupId ? [groupId] : []
    })
  });

  if (!res.ok) {
    console.error("MailerLite error", res.status, await res.text());
    return { statusCode: 502, body: "mailing list error" };
  }
  return { statusCode: 200, body: "added" };
};
