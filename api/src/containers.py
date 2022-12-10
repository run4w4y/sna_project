from dependency_injector import containers, providers
from .db import Database
from .modules.tasks.crud import TasksCRUD
from .modules.tasks.service import TasksService
import config


class Container(containers.DeclarativeContainer):
    db = providers.Singleton(Database, db_url=config.db.get_async_url())

    tasks_crud = providers.Factory(TasksCRUD, session_factory=db.provided.session)
    tasks_service = providers.Factory(TasksService, tasks_crud=tasks_crud)
