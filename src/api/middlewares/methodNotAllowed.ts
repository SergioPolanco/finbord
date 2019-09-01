const methodNotAllowedHandler = (_req, res, _next) => res.status(405).send()

export default methodNotAllowedHandler