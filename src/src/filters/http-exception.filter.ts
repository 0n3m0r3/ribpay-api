import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(
  HttpException,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | HttpException
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.handlePrismaKnownError(exception, response);
    } else if (
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      this.handleOtherPrismaErrors(exception, response);
    } else {
      this.handleUnknownError(exception, response);
    }
  }
  private formatValidationErrors(responsePayload: any): any {
    // Check if the response is a validation error type
    if (
      responsePayload &&
      responsePayload.message &&
      Array.isArray(responsePayload.message)
    ) {
      return responsePayload.message.map((err) => {
        return {
          property: err.property,
          errors: Object.values(err.constraints),
        };
      });
    }
    return responsePayload.message || responsePayload;
  }

  private handleHttpException(exception: HttpException, response: Response) {
    const status = exception.getStatus();
    const responsePayload = exception.getResponse();
    const message = this.formatValidationErrors(responsePayload);
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }

  private handleUnknownError(exception: any, response: Response) {
    // Fallback for completely unhandled errors
    const status = 500; // Internal Server Error
    const detailedMessage = this.extractGenericErrorMessage(exception);
    response.status(status).json({
      statusCode: status,
      message: 'An unexpected error occurred.',
      detailedMessage: detailedMessage,
    });
  }

  private handleOtherPrismaErrors(exception: any, response: Response) {
    // Generic handling for other types of Prisma errors
    const status = 400; // Bad Request as a generic fallback
    const message =
      exception.message || 'An error occurred in the database operation.';
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }

  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: Response,
  ) {
    console.log('Prisma Known Error', exception);
    const status = this.mapPrismaErrorToStatusCode(exception);
    const message = this.getPrismaErrorMessage(exception);
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }

  private extractGenericErrorMessage(exception: any): string {
    if (exception.message) {
      return exception.message;
    } else if (typeof exception.toString === 'function') {
      return exception.toString();
    }
    return 'No additional information available.';
  }

  private mapPrismaErrorToStatusCode(
    error: Prisma.PrismaClientKnownRequestError,
  ): number {
    switch (error.code) {
      case 'P2002':
        return 409;
      default:
        return 500;
    }
  }

  private getPrismaErrorMessage(
    error: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (error.code) {
      case 'P2002':
        return 'A unique constraint violation occurred.';
      default:
        return 'A database error occurred.';
    }
  }
}
