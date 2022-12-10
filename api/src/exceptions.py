from fastapi import Request
from fastapi.responses import JSONResponse


class ApplicationException(Exception):
    def __init__(self, status_code: int, context: dict):
        self.exception_case = self.__class__.__name__
        self.status_code = status_code
        self.context = context

    def __str__(self):
        return f'<ApplicationException {self.exception_case} \
            status_code={self.status_code} context={self.context}>'


class NotFoundException(ApplicationException):
    def __init__(self, status_code: int = 404, context: dict = { 'message': 'Not found' }):
        super().__init__(status_code, context)


async def application_exception_handler(request: Request, exc: ApplicationException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            'application_exception': exc.exception_case,
            'context': exc.context
        }
    )
