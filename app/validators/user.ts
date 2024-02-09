import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().escape().email(),
    password: vine.string(),
  })
);

export const showUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
  })
);

export const putUserProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().escape().optional(),
    lastName: vine.string().trim().escape().optional(),
    params: vine.object({
      id: vine.number(),
    }),
  })
);

export const deleteUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
  })
);
