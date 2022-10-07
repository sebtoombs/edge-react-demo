/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";
import type { Request } from "itty-router";

import ReactDOMServer from "react-dom/server";
import Document from "./document";
import { Page } from "../types";

const renderToResponse = async (page: Page, ctx: any) => {
  const { getEdgeProps, default: Page } = page;
  const edgeProps =
    typeof getEdgeProps === "function" ? await getEdgeProps(ctx) : {};

  const { props = {}, revalidate = null } = edgeProps;

  const html = ReactDOMServer.renderToString(
    Document({ children: Page(props) })
  );
  const response = new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
  if (revalidate > 0) {
    response?.headers.append("Cache-Control", `s-maxage=${revalidate}`);
  }
  return response;
};

const router = Router();

router.get("/", async ({ params }: Request) => {
  const page: Page = await import("./pages/index");

  return renderToResponse(page, {
    path: "/",
    params,
  });
});

router.get("/hello/:name", async ({ params }: Request) => {
  const page: Page = await import("./pages/hello");
  return renderToResponse(page, {
    path: `/hello/${params?.name}`,
    params,
  });
});

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);

    if (!response) {
      response = await router.handle(request);

      ctx.waitUntil(cache.put(cacheKey, response!.clone()));
    }

    return response!;
  },
};
