import { Server } from "node:http";
import { AddressInfo } from "node:net";

import { Express } from "express";

type JsonValue = Record<string, unknown> | unknown[] | null;

type RequestOptions = {
  method?: string;
  token?: string;
  body?: JsonValue;
  form?: FormData;
};

export type TestHttpServer = {
  baseUrl: string;
  close: () => Promise<void>;
  request: <T = unknown>(path: string, options?: RequestOptions) => Promise<{
    status: number;
    body: T;
    text: string;
    headers: Headers;
  }>;
};

export async function startTestServer(app: Express): Promise<TestHttpServer> {
  const server = await new Promise<Server>((resolve) => {
    const listeningServer = app.listen(0, () => resolve(listeningServer));
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    }),
    request: async <T = unknown>(path: string, options: RequestOptions = {}) => {
      const headers = new Headers();
      let body: BodyInit | undefined;

      if (options.token) {
        headers.set("Authorization", `Bearer ${options.token}`);
      }

      if (options.form) {
        body = options.form;
      } else if (options.body !== undefined) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(options.body);
      }

      const response = await fetch(`${baseUrl}${path}`, {
        method: options.method ?? "GET",
        headers,
        body,
      });
      const text = await response.text();
      const contentType = response.headers.get("content-type") ?? "";
      const parsedBody = contentType.includes("application/json") && text
        ? JSON.parse(text) as T
        : text as T;

      return {
        status: response.status,
        body: parsedBody,
        text,
        headers: response.headers,
      };
    },
  };
}
