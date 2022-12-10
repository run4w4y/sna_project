from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql.functions import current_timestamp
from datetime import datetime
from ...db import ModelBase


class Task(ModelBase):
    __tablename__ = 'tasks'

    id: int = Column(Integer, primary_key=True)
    title: str = Column(String, nullable=False)
    created_ts: datetime = Column(DateTime, nullable=False, server_default=current_timestamp())
