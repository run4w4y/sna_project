from ...base_classes import ORMModel
from . import models
from datetime import datetime


class CreateTask(ORMModel[models.Task]):
    title: str


class TaskDTO(ORMModel[models.Task]):
    id: int
    title: str
    created_ts: datetime
