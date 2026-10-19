# Security and privacy notes

- The site is static HTML and CSS generated at build time. It ships no JavaScript, sets no cookies,
  loads no third-party resources (fonts, analytics, embeds) and has no forms.
- Contact is through the public GitHub profile only. No e-mail address, phone number, LinkedIn link
  or résumé is published; those need the owner's explicit approval of the specific detail.
- All text is rendered by React (escaped); attribute values in the document head are escaped
  separately and covered by a unit test.
- The secret scan (`npm run secrets`) runs in the verification script and in CI.
- The local registry check reads `../portfolio-control/projects.json` only on the developer's
  machine; that private folder is never copied into the build.

Report problems through a private security advisory on the repository once it is published, or by
contacting the owner through GitHub.
