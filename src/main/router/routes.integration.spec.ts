import { createServer, Server } from "node:http";
import { rm } from "node:fs/promises";
import { join } from "node:path";

import { ProjectStatus, ProposalStatus, UserRole } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { disconnectDatabase, resetDatabase } from "@/test/integration/database";
import {
  createCourse,
  createProject,
  createProposal,
  createUser,
  makeToken,
  uniqueEmail,
} from "@/test/integration/fixtures";
import { startTestServer, TestHttpServer } from "@/test/integration/http";

type AuthContext = {
  admin: { token: string; id: string };
  mediator: { token: string; id: string };
  student: { token: string; id: string };
  society: { token: string; id: string };
};

let server: TestHttpServer;

beforeAll(async () => {
  process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:55432/conecta_fatec_test";
  process.env.PRISMA_DRIVER_ADAPTER ??= "pg";
  process.env.JWT_SECRET ??= "test-secret";
  process.env.JWT_EXPIRES_IN ??= "1h";
  process.env.CORS_ORIGIN ??= "http://localhost:3000";

  const { app } = await import("@/main/app");
  server = await startTestServer(app);
});

beforeEach(async () => {
  await resetDatabase();
  await rm(join(process.cwd(), "data", "mediator-config.json"), { force: true });
});

afterAll(async () => {
  await server.close();
  await disconnectDatabase();
});

async function makeAuthContext(): Promise<AuthContext> {
  const [admin, mediator, student, society] = await Promise.all([
    createUser(UserRole.ADMIN),
    createUser(UserRole.MEDIATOR),
    createUser(UserRole.STUDENT),
    createUser(UserRole.SOCIETY),
  ]);

  return {
    admin: { id: admin.id, token: makeToken(admin) },
    mediator: { id: mediator.id, token: makeToken(mediator) },
    student: { id: student.id, token: makeToken(student) },
    society: { id: society.id, token: makeToken(society) },
  };
}

function expectMessage(body: unknown, message: string): void {
  expect(body).toMatchObject({ message });
}

describe("root and docs routes", () => {
  it("GET / returns the health message", async () => {
    const response = await server.request<{ message: string }>("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, World!" });
  });

  it("GET /health returns 200 without authentication", async () => {
    const response = await server.request("/health");

    expect(response.status).toBe(200);
  });

  it("GET /docs.json returns the swagger document", async () => {
    const response = await server.request<{ openapi: string }>("/docs.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBeDefined();
  });
});

describe("auth routes", () => {
  it("POST /auth/register creates a society user", async () => {
    const response = await server.request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: {
        email: uniqueEmail("register"),
        password: "Password123",
        name: "Registered User",
        phone: "11999999999",
        phoneIsWhats: true,
      },
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toContain("register");
  });

  it("POST /auth/register returns an error for duplicate email", async () => {
    const user = await createUser();

    const response = await server.request("/auth/register", {
      method: "POST",
      body: {
        email: user.email,
        password: "Password123",
        name: "Duplicate User",
        phone: "11999999999",
      },
    });

    expect(response.status).toBe(409);
    expectMessage(response.body, "User already exists");
  });

  it("POST /auth/login returns a token for valid credentials", async () => {
    const user = await createUser(UserRole.STUDENT);

    const response = await server.request<{ accessToken: string; user: { role: string } }>("/auth/login", {
      method: "POST",
      body: { email: user.email, password: user.password },
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.role).toBe(UserRole.STUDENT);
  });

  it("POST /auth/login returns unauthorized for invalid credentials", async () => {
    const user = await createUser();

    const response = await server.request("/auth/login", {
      method: "POST",
      body: { email: user.email, password: "wrong-password" },
    });

    expect(response.status).toBe(401);
    expectMessage(response.body, "Invalid credentials");
  });

  it("PUT /auth/register/:id fully updates a user when the caller is admin", async () => {
    const auth = await makeAuthContext();

    const response = await server.request<{ email: string; phoneIsWhats: boolean }>(
      `/auth/register/${auth.society.id}`,
      {
        method: "PUT",
        token: auth.admin.token,
        body: {
          email: uniqueEmail("updated"),
          password: "NewPassword123",
          name: "Updated User",
          avatar: "https://i.imgur.com/avatar123.png",
          phone: "11888888888",
          phoneIsWhats: false,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.email).toContain("updated");
    expect(response.body.phoneIsWhats).toBe(false);
  });

  it("PUT /auth/register/:id rejects missing fields", async () => {
    const auth = await makeAuthContext();

    const response = await server.request(`/auth/register/${auth.society.id}`, {
      method: "PUT",
      token: auth.admin.token,
      body: { name: "Missing fields" },
    });

    expect(response.status).toBe(400);
    expectMessage(response.body, "Missing required fields");
  });

  it("PATCH /auth/register/:id lets a user partially update itself", async () => {
    const auth = await makeAuthContext();

    const response = await server.request<{ name: string }>(`/auth/register/${auth.student.id}`, {
      method: "PATCH",
      token: auth.student.token,
      body: { name: "Student Updated" },
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Student Updated");
  });

  it("PATCH /auth/register/:id rejects updates to another user", async () => {
    const auth = await makeAuthContext();

    const response = await server.request(`/auth/register/${auth.student.id}`, {
      method: "PATCH",
      token: auth.society.token,
      body: { name: "Forbidden Update" },
    });

    expect(response.status).toBe(403);
    expectMessage(response.body, "Forbidden");
  });

  it("DELETE /auth/register/:id soft-deletes a user when the caller is admin", async () => {
    const auth = await makeAuthContext();

    const response = await server.request(`/auth/register/${auth.society.id}`, {
      method: "DELETE",
      token: auth.admin.token,
    });

    expect(response.status).toBe(204);
  });

  it("DELETE /auth/register/:id rejects callers below admin", async () => {
    const auth = await makeAuthContext();

    const response = await server.request(`/auth/register/${auth.society.id}`, {
      method: "DELETE",
      token: auth.mediator.token,
    });

    expect(response.status).toBe(403);
    expectMessage(response.body, "Forbidden");
  });
});

describe("course routes", () => {
  it("covers create, list, update and delete happy paths", async () => {
    const auth = await makeAuthContext();

    const created = await server.request<{ id: string; name: string }>("/courses", {
      method: "POST",
      token: auth.mediator.token,
      body: { name: "ADS", description: "Technology course" },
    });
    expect(created.status).toBe(201);
    expect(created.body.name).toBe("ADS");

    const listed = await server.request<{ items: unknown[] }>("/courses", {
      token: auth.student.token,
    });
    expect(listed.status).toBe(200);
    expect(listed.body.items).toHaveLength(1);

    const updated = await server.request<{ description: string }>(`/courses/${created.body.id}`, {
      method: "PUT",
      token: auth.mediator.token,
      body: { description: "Updated course" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.description).toBe("Updated course");

    const deleted = await server.request(`/courses/${created.body.id}`, {
      method: "DELETE",
      token: auth.mediator.token,
    });
    expect(deleted.status).toBe(204);
  });

  it("returns auth, role, payload, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/courses", { method: "POST", body: { name: "No token" } })).status)
      .toBe(401);
    expect((await server.request("/courses", {
      method: "POST",
      token: auth.student.token,
      body: { name: "Wrong role" },
    })).status).toBe(403);
    expect((await server.request("/courses", {
      method: "POST",
      token: auth.mediator.token,
      body: {},
    })).status).toBe(400);
    expect((await server.request("/courses?page=0", { token: auth.student.token })).status).toBe(400);
    expect((await server.request("/courses/00000000-0000-0000-0000-000000000000", {
      method: "PUT",
      token: auth.mediator.token,
      body: { name: "Missing" },
    })).status).toBe(500);
  });
});

describe("proposal routes", () => {
  it("covers create, list, list mine, update and delete happy paths", async () => {
    const auth = await makeAuthContext();

    const created = await server.request<{ id: string; attachments: string }>("/proposals", {
      method: "POST",
      token: auth.society.token,
      body: {
        title: "Proposal",
        description: "Proposal description",
        submissionDate: "2026-05-20T12:00:00.000Z",
        status: ProposalStatus.IN_REVIEW,
        attachments: Buffer.from("file").toString("base64"),
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.attachments).toBe(Buffer.from("file").toString("base64"));

    expect((await server.request("/proposals", { token: auth.student.token })).status).toBe(200);
    expect((await server.request("/proposals/mine", { token: auth.society.token })).status).toBe(200);

    const updated = await server.request<{ title: string }>(`/proposals/${created.body.id}`, {
      method: "PUT",
      token: auth.society.token,
      body: { title: "Updated proposal" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe("Updated proposal");

    const deleted = await server.request(`/proposals/${created.body.id}`, {
      method: "DELETE",
      token: auth.society.token,
    });
    expect(deleted.status).toBe(204);
  });

  it("returns auth, role, payload, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/proposals", { method: "POST", body: {} })).status).toBe(401);
    expect((await server.request("/proposals", { token: auth.society.token })).status).toBe(403);
    expect((await server.request("/proposals", {
      method: "POST",
      token: auth.society.token,
      body: { title: "Missing" },
    })).status).toBe(400);
    expect((await server.request("/proposals", {
      method: "POST",
      token: auth.society.token,
      body: {
        title: "Proposal",
        description: "Proposal description",
        submissionDate: "not-a-date",
        status: ProposalStatus.IN_REVIEW,
        attachments: Buffer.from("file").toString("base64"),
      },
    })).status).toBe(400);
    expect((await server.request("/proposals?page=0", { token: auth.student.token })).status).toBe(400);
    expect((await server.request("/proposals/00000000-0000-0000-0000-000000000000", {
      method: "PUT",
      token: auth.society.token,
      body: { title: "Missing" },
    })).status).toBe(500);
  });
});

describe("project routes", () => {
  it("covers create, list, update and delete happy paths", async () => {
    const auth = await makeAuthContext();
    const course = await createCourse();
    const proposal = await createProposal(auth.society.id);

    const created = await server.request<{ id: string; title: string }>("/projects", {
      method: "POST",
      token: auth.mediator.token,
      body: {
        title: "Project",
        description: "Project description",
        deadline: "2026-06-20T12:00:00.000Z",
        status: ProjectStatus.PENDING,
        attachments: "project-file",
        courseId: course.id,
        proposalId: proposal.id,
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Project");

    expect((await server.request("/projects", { token: auth.student.token })).status).toBe(200);

    const updated = await server.request<{ status: string }>(`/projects/${created.body.id}`, {
      method: "PUT",
      token: auth.mediator.token,
      body: { status: ProjectStatus.COMPLETED },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe(ProjectStatus.COMPLETED);

    expect((await server.request(`/projects/${created.body.id}`, {
      method: "DELETE",
      token: auth.mediator.token,
    })).status).toBe(204);
  });

  it("returns auth, role, payload, date, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/projects", { method: "POST", body: {} })).status).toBe(401);
    expect((await server.request("/projects", {
      method: "POST",
      token: auth.student.token,
      body: {},
    })).status).toBe(403);
    expect((await server.request("/projects", {
      method: "POST",
      token: auth.mediator.token,
      body: {},
    })).status).toBe(400);
    expect((await server.request("/projects", {
      method: "POST",
      token: auth.mediator.token,
      body: {
        title: "Project",
        description: "Project description",
        deadline: "bad-date",
        status: ProjectStatus.PENDING,
        courseId: "00000000-0000-0000-0000-000000000000",
        proposalId: "00000000-0000-0000-0000-000000000000",
      },
    })).status).toBe(400);
    expect((await server.request("/projects?limit=101", { token: auth.student.token })).status).toBe(400);
    expect((await server.request("/projects/00000000-0000-0000-0000-000000000000", {
      method: "DELETE",
      token: auth.mediator.token,
    })).status).toBe(500);
  });
});

describe("feedback routes", () => {
  it("covers create, list, update and delete happy paths", async () => {
    const auth = await makeAuthContext();
    const project = await createProject();

    const created = await server.request<{ id: string; comment: string }>("/feedbacks", {
      method: "POST",
      token: auth.student.token,
      body: {
        comment: "Great project",
        attachments: "feedback-file",
        userId: auth.student.id,
        projectId: project.id,
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.comment).toBe("Great project");

    expect((await server.request("/feedbacks")).status).toBe(200);

    const updated = await server.request<{ comment: string }>(`/feedbacks/${created.body.id}`, {
      method: "PUT",
      token: auth.student.token,
      body: { comment: "Updated feedback" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.comment).toBe("Updated feedback");

    expect((await server.request(`/feedbacks/${created.body.id}`, {
      method: "DELETE",
      token: auth.student.token,
    })).status).toBe(204);
  });

  it("returns auth, role, payload, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/feedbacks", { method: "POST", body: {} })).status).toBe(401);
    expect((await server.request("/feedbacks", {
      method: "POST",
      token: auth.society.token,
      body: {},
    })).status).toBe(403);
    expect((await server.request("/feedbacks", {
      method: "POST",
      token: auth.student.token,
      body: {},
    })).status).toBe(400);
    expect((await server.request("/feedbacks?page=abc")).status).toBe(400);
    expect((await server.request("/feedbacks/00000000-0000-0000-0000-000000000000", {
      method: "PUT",
      token: auth.student.token,
      body: { comment: "Missing" },
    })).status).toBe(500);
  });
});

describe("notification routes", () => {
  it("covers create, list, update and delete happy paths", async () => {
    const auth = await makeAuthContext();

    const created = await server.request<{ id: string; message: string }>("/notifications", {
      method: "POST",
      token: auth.mediator.token,
      body: { message: "Hello", userId: auth.student.id },
    });
    expect(created.status).toBe(201);
    expect(created.body.message).toBe("Hello");

    expect((await server.request("/notifications")).status).toBe(200);

    const updated = await server.request<{ message: string }>(`/notifications/${created.body.id}`, {
      method: "PUT",
      token: auth.mediator.token,
      body: { message: "Updated notification" },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.message).toBe("Updated notification");

    expect((await server.request(`/notifications/${created.body.id}`, {
      method: "DELETE",
      token: auth.mediator.token,
    })).status).toBe(204);
  });

  it("returns auth, role, payload, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/notifications", { method: "POST", body: {} })).status).toBe(401);
    expect((await server.request("/notifications", {
      method: "POST",
      token: auth.student.token,
      body: {},
    })).status).toBe(403);
    expect((await server.request("/notifications", {
      method: "POST",
      token: auth.mediator.token,
      body: {},
    })).status).toBe(400);
    expect((await server.request("/notifications?limit=0")).status).toBe(400);
    expect((await server.request("/notifications/00000000-0000-0000-0000-000000000000", {
      method: "DELETE",
      token: auth.mediator.token,
    })).status).toBe(500);
  });
});

describe("project-student routes", () => {
  it("covers create, list, update and delete happy paths", async () => {
    const auth = await makeAuthContext();
    const project = await createProject();
    const newProject = await createProject();

    const created = await server.request<{ id: string; userId: string }>("/project-students", {
      method: "POST",
      token: auth.student.token,
      body: { userId: auth.student.id, projectId: project.id },
    });
    expect(created.status).toBe(201);
    expect(created.body.userId).toBe(auth.student.id);

    expect((await server.request("/project-students", { token: auth.student.token })).status).toBe(200);

    const updated = await server.request<{ projectId: string }>(`/project-students/${created.body.id}`, {
      method: "PUT",
      token: auth.student.token,
      body: { projectId: newProject.id },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.projectId).toBe(newProject.id);

    expect((await server.request(`/project-students/${created.body.id}`, {
      method: "DELETE",
      token: auth.student.token,
    })).status).toBe(204);
  });

  it("returns auth, role, payload, pagination and missing-record errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/project-students", { method: "POST", body: {} })).status).toBe(401);
    expect((await server.request("/project-students", {
      method: "POST",
      token: auth.society.token,
      body: {},
    })).status).toBe(403);
    expect((await server.request("/project-students", {
      method: "POST",
      token: auth.student.token,
      body: {},
    })).status).toBe(400);
    expect((await server.request("/project-students?page=-1", { token: auth.student.token })).status)
      .toBe(400);
    expect((await server.request("/project-students/00000000-0000-0000-0000-000000000000", {
      method: "DELETE",
      token: auth.student.token,
    })).status).toBe(500);
  });
});

describe("mediator routes", () => {
  it("POST /mediator/config saves the mediator URL from form-data", async () => {
    const auth = await makeAuthContext();
    const form = new FormData();
    form.set("url", "http://127.0.0.1:39999");

    const response = await server.request<{ message: string }>("/mediator/config", {
      method: "POST",
      token: auth.admin.token,
      form,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Mediator config saved");
  });

  it("POST /mediator/config rejects missing url and non-admin callers", async () => {
    const auth = await makeAuthContext();
    const form = new FormData();

    expect((await server.request("/mediator/config", {
      method: "POST",
      token: auth.admin.token,
      form,
    })).status).toBe(400);
    expect((await server.request("/mediator/config", {
      method: "POST",
      token: auth.mediator.token,
      form,
    })).status).toBe(403);
  });

  it("POST /mediator/pre-approval proxies to the configured mediator service", async () => {
    const auth = await makeAuthContext();
    const upstream = await startUpstreamMediator();
    const form = new FormData();
    form.set("url", upstream.url);

    try {
      await server.request("/mediator/config", {
        method: "POST",
        token: auth.admin.token,
        form,
      });

      const response = await server.request<{ approved: boolean }>("/mediator/pre-approval", {
        method: "POST",
        token: auth.mediator.token,
        body: { title: "Project idea" },
      });

      expect(response.status).toBe(202);
      expect(response.body).toEqual({ approved: true });
    } finally {
      await upstream.close();
    }
  });

  it("POST /mediator/pre-approval returns auth, role and configuration errors", async () => {
    const auth = await makeAuthContext();

    expect((await server.request("/mediator/pre-approval", {
      method: "POST",
      body: {},
    })).status).toBe(401);
    expect((await server.request("/mediator/pre-approval", {
      method: "POST",
      token: auth.student.token,
      body: {},
    })).status).toBe(403);

    const notConfigured = await server.request<{ error: string }>("/mediator/pre-approval", {
      method: "POST",
      token: auth.mediator.token,
      body: {},
    });
    expect(notConfigured.status).toBe(500);
    expect(notConfigured.body.error).toBe("Mediator URL not configured");
  });
});

async function startUpstreamMediator(): Promise<{ url: string; close: () => Promise<void> }> {
  const upstream = await new Promise<Server>((resolve) => {
    const mediator = createServer((req, res) => {
      if (req.method === "POST" && req.url === "/pre-approval") {
        res.writeHead(202, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ approved: true }));
        return;
      }

      res.writeHead(404);
      res.end();
    });

    mediator.listen(0, () => resolve(mediator));
  });

  const address = upstream.address();

  if (!address || typeof address === "string") {
    throw new Error("Unable to start upstream mediator");
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => {
      upstream.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    }),
  };
}
