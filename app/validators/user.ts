import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().escape().email(),
    password: vine.string().trim().escape(),
  })
);

export const showUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
  })
);
