import { describe, expect, it } from "vitest";

import { swaggerDocument } from "@/main/docs/swagger";

describe("swagger route security", () => {
  const paths = swaggerDocument.paths;

  it("documents only login, register, health, feedback list and notification list as public", () => {
    expect("security" in paths["/auth/login"].post).toBe(false);
    expect("security" in paths["/auth/register"].post).toBe(false);
    expect("security" in paths["/health"].get).toBe(false);
    expect("security" in paths["/feedbacks"].get).toBe(false);
    expect("security" in paths["/notifications"].get).toBe(false);
  });

  it("documents protected auth mutation routes with bearer auth", () => {
    expect(paths["/auth/register/{id}"].put.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/auth/register/{id}"].patch.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/auth/register/{id}"].delete.security).toEqual([{ bearerAuth: [] }]);
  });

  it("documents proposal permissions consistently with route guards", () => {
    expect(paths["/proposals"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/proposals"].get.description).toContain("role mínima STUDENT");
    expect(paths["/proposals"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/proposals"].post.description).toContain("sem role mínima");
    expect(paths["/proposals/mine"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/proposals/{id}"].put.security).toEqual([{ bearerAuth: [] }]);
  });

  it("documents domain protected routes with bearer auth", () => {
    expect(paths["/courses"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/courses"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/projects"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/projects"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/project-students"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/project-students"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/feedbacks"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/notifications"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/mediator/config"].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths["/mediator/pre-approval"].post.security).toEqual([{ bearerAuth: [] }]);
  });
});
