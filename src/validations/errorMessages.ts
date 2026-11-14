// Zod 4 replaced `required_error` / `invalid_type_error` with a single `error` param.
// These helpers keep the Zod 3 semantics: the message only applies to its own case.

type Issue = { input?: unknown };

export const required = (message: string) => ({
    error: (issue: Issue) => (issue.input === undefined ? message : undefined),
});

export const invalidType = (message: string) => ({
    error: (issue: Issue) => (issue.input === undefined ? undefined : message),
});
