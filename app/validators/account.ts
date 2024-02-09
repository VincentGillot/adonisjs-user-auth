import vine from "@vinejs/vine";

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().escape(),
    password: vine.string(),
  })
);

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().escape(),
  })
);

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine.string(),
  })
);

export const changePasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string(),
    newPassword: vine.string(),
  })
);

export const putProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().escape().optional(),
    lastName: vine.string().trim().escape().optional(),
  })
);
