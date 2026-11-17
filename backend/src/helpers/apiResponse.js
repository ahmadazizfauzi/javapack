/**
 * Standardized API Response Helper.
 * Always includes `success`, `statusCode`, and `message` in English.
 */
class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  static error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
    const response = {
      success: false,
      statusCode,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }
}

module.exports = ApiResponse;
