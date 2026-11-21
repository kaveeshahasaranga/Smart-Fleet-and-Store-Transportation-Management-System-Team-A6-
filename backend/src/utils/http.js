export function httpError(status, message, details) {
  return Object.assign(new Error(message), { status, details });
}

export const asyncHandler = handler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export function serialize(record) {
  const object = record.toObject();
  const { _id, __v, deletedAt, ...fields } = object;
  return { ...fields, id: String(_id), version: __v };
}
