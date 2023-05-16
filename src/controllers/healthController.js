export const healthCheck = async (request, reply) => {
  reply.code(200).send("OK");
};
