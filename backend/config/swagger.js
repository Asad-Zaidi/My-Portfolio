const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "My Portfolio API",
      version: "1.0.0",
      description: "API documentation for the portfolio backend.",
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Local server",
        variables: {
          port: {
            default: "5000",
          },
        },
      },
    ],
    tags: [
      { name: "System", description: "Server status" },
      { name: "Auth", description: "Administrator authentication" },
      { name: "Portfolio", description: "Portfolio content" },
      { name: "Contact", description: "Contact form messages" },
      { name: "Upload", description: "Cloudinary file uploads" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Invalid request." },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@example.com" },
            password: { type: "string", format: "password", example: "your-password" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            id: { type: "string", example: "665b8f2d8e9f4c0012345678" },
            name: { type: "string", example: "Portfolio Admin" },
            email: { type: "string", format: "email" },
            role: { type: "string", example: "admin" },
          },
        },
        ContactMessageRequest: {
          type: "object",
          required: ["name", "email", "subject", "message"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@example.com" },
            subject: { type: "string", example: "Project inquiry" },
            message: { type: "string", example: "I would like to discuss a project." },
          },
        },
        ContactMessage: {
          allOf: [
            { $ref: "#/components/schemas/ContactMessageRequest" },
            {
              type: "object",
              properties: {
                _id: { type: "string" },
                read: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          ],
        },
        Portfolio: {
          type: "object",
          description: "Portfolio document. Sections mirror the frontend portfolio data.",
          additionalProperties: true,
          properties: {
            slug: { type: "string", example: "main" },
            meta: { type: "object", additionalProperties: true },
            personal: { type: "object", additionalProperties: true },
            stats: { type: "array", items: { type: "object", additionalProperties: true } },
            education: { type: "array", items: { type: "object", additionalProperties: true } },
            experience: { type: "array", items: { type: "object", additionalProperties: true } },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["System"],
          summary: "Get API information",
          responses: {
            200: {
              description: "Backend status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Backend is running" },
                      status: { type: "string", example: "success" },
                      version: { type: "string", example: "1.0.0" },
                      docs: { type: "string", example: "/docs" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Check API health",
          responses: {
            200: {
              description: "API is healthy",
              content: { "application/json": { schema: { type: "object", example: { status: "ok" } } } },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Log in as administrator",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
          },
          responses: {
            200: {
              description: "Login successful",
              content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" }, admin: { $ref: "#/components/schemas/Admin" } } } } },
            },
            400: { description: "Email or password missing", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get the authenticated administrator",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Authenticated administrator", content: { "application/json": { schema: { $ref: "#/components/schemas/Admin" } } } },
            401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/portfolio": {
        get: {
          tags: ["Portfolio"],
          summary: "Get portfolio content",
          responses: {
            200: { description: "Portfolio document", content: { "application/json": { schema: { $ref: "#/components/schemas/Portfolio" } } } },
          },
        },
        patch: {
          tags: ["Portfolio"],
          summary: "Update portfolio content",
          description: "Object sections are shallow-merged; array sections are replaced wholesale.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/Portfolio" } } },
          },
          responses: {
            200: { description: "Updated portfolio document", content: { "application/json": { schema: { $ref: "#/components/schemas/Portfolio" } } } },
            401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            403: { description: "Administrator access required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/contact": {
        post: {
          tags: ["Contact"],
          summary: "Send a contact message",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ContactMessageRequest" } } },
          },
          responses: {
            201: { description: "Message created", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" }, id: { type: "string" } } } } } },
            400: { description: "Required field missing", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            503: { description: "Message saved but SMTP notification failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        get: {
          tags: ["Contact"],
          summary: "List contact messages",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Contact messages", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/ContactMessage" } } } } },
            401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/contact/{id}/read": {
        patch: {
          tags: ["Contact"],
          summary: "Mark a contact message as read",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Message ID" }],
          responses: {
            200: { description: "Updated message", content: { "application/json": { schema: { $ref: "#/components/schemas/ContactMessage" } } } },
            404: { description: "Message not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/contact/{id}": {
        delete: {
          tags: ["Contact"],
          summary: "Delete a contact message",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Message ID" }],
          responses: {
            200: { description: "Message deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            404: { description: "Message not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/upload": {
        post: {
          tags: ["Upload"],
          summary: "Upload a file to Cloudinary",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: { file: { type: "string", format: "binary" } },
                },
              },
            },
          },
          responses: {
            201: { description: "File uploaded", content: { "application/json": { schema: { type: "object", properties: { url: { type: "string", format: "uri" }, publicId: { type: "string" } } } } } },
            400: { description: "No file received", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJSDoc(options);
