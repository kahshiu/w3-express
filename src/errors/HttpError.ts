enum HttpErrors {
    "CLIENT_BAD_REQUEST" = "CLIENT_BAD_REQUEST"
    , "CLIENT_UNAUTHORISE" = "CLIENT_UNAUTHORISE"
    , "CLIENT_FORBIDDEN" = "CLIENT_FORBIDDEN"
    , "CLIENT_NOT_FOUND" = "CLIENT_NOT_FOUND"
    , "CLIENT_METHOD" = "CLIENT_METHOD"
    , "CLIENT_NOT_ACCEPTED" = "CLIENT_NOT_ACCEPTED"
    , "CLIENT_UNSUPPORTED_MEDIA" = "CLIENT_UNSUPPORTED_MEDIA"
    , "CLIENT_FAILED_DEPENDENCY" = "CLIENT_FAILED_DEPENDENCY"

    , "SERVER_ERROR" = "SERVER_ERROR"
    , "SERVER_NOT_IMPLEMENTED" = "SERVER_NOT_IMPLEMENTED"
    , "SERVER_BAD_GATEWAY" = "SERVER_BAD_GATEWAY"
    , "SERVER_UNAVAILABLE" = "SERVER_UNAVAILABLE"
}

const HttpMapping = new Map<keyof typeof HttpErrors, { statusCode: number, statusMessage: string }>([
    ["CLIENT_BAD_REQUEST", { statusCode: 400, statusMessage: "Bad Request" }]
    , ["CLIENT_UNAUTHORISE", { statusCode: 401, statusMessage: "Unauthorised" }]
    , ["CLIENT_FORBIDDEN", { statusCode: 403, statusMessage: "Forbidden" }]
    , ["CLIENT_NOT_FOUND", { statusCode: 404, statusMessage: "Not Found" }]
    , ["CLIENT_METHOD", { statusCode: 405, statusMessage: "Method Not Allowed" }]
    , ["CLIENT_NOT_ACCEPTED", { statusCode: 406, statusMessage: "Not Accepted" }]
    , ["CLIENT_UNSUPPORTED_MEDIA", { statusCode: 415, statusMessage: "Unsupported Media Type" }]
    , ["CLIENT_FAILED_DEPENDENCY", { statusCode: 424, statusMessage: "Failed Dependency" }]

    , ["SERVER_ERROR", { statusCode: 500, statusMessage: "Internal Server Error" }]
    , ["SERVER_NOT_IMPLEMENTED", { statusCode: 501, statusMessage: "Not Implemented" }]
    , ["SERVER_BAD_GATEWAY", { statusCode: 502, statusMessage: "Bad Gateway" }]
    , ["SERVER_UNAVAILABLE", { statusCode: 503, statusMessage: "Service Unavailable" }]
])

type TDetails = { statusCode: number, statusMessage: string }

export class HttpError extends Error {
    details: TDetails

    constructor(
        httpError: HttpErrors = HttpErrors.SERVER_ERROR, 
        message: string = "Server Error"
    ) {
        const targetDetails = HttpMapping.get(httpError) as TDetails;
        super(message ?? targetDetails.statusMessage)
        this.details = targetDetails;
    }
}

export class HttpBadRequest extends HttpError {
    constructor(message?: string) {
        super(HttpErrors.CLIENT_BAD_REQUEST, message)
    }
}
