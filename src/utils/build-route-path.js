export function builRoutePath(path) {
  const routeParameterRegex = /:([a-zA-Z]+)/g;

  const routeWithParams = path.replace(routeParameterRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${routeWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}