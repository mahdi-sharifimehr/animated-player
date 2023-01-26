
export const loggerMiddleware = storeAPI => next => action => {
    let result = next(action)
    return result
}