export class AppError extends Error {
  statusCode: number
  // message: string
  constructor (message: string, statusCode: number) {
    super(message)
    this.name = Error.name
    this.statusCode = statusCode
    // this.message = message
    Error.captureStackTrace(this, this.constructor)
  }
}