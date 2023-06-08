import time
import models
from sqlalchemy import select, insert, update, delete
from fastapi import APIRouter, BackgroundTasks
from .helpers import make_list, session
from enum import Enum


class Status(Enum):
    PENDING = 0
    COMPLETED = 1


class Task():
    def __init__(self, id: int):
        self.id = id
        self.percentage = 0
        self.status = Status.PENDING

    def background_work(self):
        while self.percentage < 100:
            time.sleep(0.1)
            self.percentage += 1
            print("Task " + str(self.id) + " percentage: " + str(self.percentage))
        self.status = Status.COMPLETED

    def get_id(self):
        return self.id

    def get_percentage(self):
        return self.percentage

    def get_status(self):
        return self.status


class TaskManager():
    def __init__(self):
        self.tasks = []







