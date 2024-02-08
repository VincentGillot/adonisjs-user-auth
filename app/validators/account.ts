import vine from "@vinejs/vine";

export const putProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().escape().optional(),
    lastName: vine.string().trim().escape().optional(),
  })
);
