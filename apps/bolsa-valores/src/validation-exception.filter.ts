import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const rpcException = new RpcException({
      //@ts-expect-error - message is private
      message: JSON.stringify(exception.getResponse().message),
      code: HttpStatus.PRECONDITION_FAILED,
    });
    return throwError(() => rpcException.getError());
  }
}
