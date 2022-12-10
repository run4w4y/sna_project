from result import Result
import functools
from typing import Any

def handle_result(res: Result[Any, Exception]):
    if not res.is_ok():
        raise res.value
    return res.value

# TODO: make the decorator work for both async and sync functions
def handled_result_async(f):
    @functools.wraps(f)
    async def wrapper(*args, **kwargs):
        res = await f(*args, **kwargs)
        return handle_result(res)
    return wrapper
