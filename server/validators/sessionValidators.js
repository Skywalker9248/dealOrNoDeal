const { z } = require("zod");

exports.getSessionSchema = z.object({
  id: z.string().uuid("Session ID must be a valid UUID"),
});

exports.updateCaseSchema = z.object({
  sessionId: z.string().uuid("sessionId must be a valid UUID"),
  caseNumber: z
    .number()
    .int()
    .min(1)
    .max(26, "Case number must be between 1 and 26"),
});

exports.deleteSessionSchema = z.object({
  sessionId: z.string().uuid("sessionId must be a valid UUID"),
});
