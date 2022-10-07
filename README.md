# Edge React Demo with Cloudflare Workers

Quick demo showing how a React application can be rendered at the edge, and cached - using Cloudflare Workers.

This is _very_ much a demo. There are obviously some significant limitations with this demo repo including;

- Client bundle isn't built or served
  - Would need to build React application as normal
  - Store in workers-sites kv bucket
  - use getAssetFromKV to return
- Routing is hard-coded
- Need something like react-helmet (ssr) to handle head/meta/etc
- Code is missing a lot of things!

## Get started

- Clone the repo
- `npm i`
- `npm start`
