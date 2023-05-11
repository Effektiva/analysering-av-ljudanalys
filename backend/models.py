
from datetime import datetime
from xmlrpc.client import DateTime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, LargeBinary

from sqlalchemy.orm import relationship

import datetime
import time

from database import Base


class SoundClass(Base):
    __tablename__ = "sound_class"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)


class Investigations(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)

    #sound_chains = relationship("SoundChain", back_populates = "investigations")


class SoundChain(Base):
    __tablename__ = "sound_chain"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    chain_state = Column(String, nullable=True)

    investigations_id = Column(Integer, ForeignKey("investigations.id"))
    #investigations = relationship("Investigations", back_populates = "sound_chains")
    #tags = relationship("Tags", back_populates = "sound_chain")
    #comments = relationship("Comments", back_populates = "sound_chain")
    #sound_files = relationship("SoundFile", back_populates = "sound_chain")




class SoundFile(Base):
    __tablename__ = "sound_file"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    file_name = Column(String, index=True)
    file_state = Column(String, nullable=True)
    #audio_file = Column(LargeBinary, nullable=False)
    sound_chain_id = Column(Integer, ForeignKey("sound_chain.id"))
    #sound_chain = relationship("SoundChain", back_populates = "sound_files")
    #sound_intervals = relationship("SoundInterval", back_populates = "sound_file")
    #folder = relationship("Folder", back_populates = "sound_file")

class Tags(Base):
    __tablename__ = "tags"

    tag_id = Column(String, primary_key=True)

    sound_file_id = Column(Integer, ForeignKey("sound_file.id"), primary_key=True)
    #sound_file = relationship("SoundFile", back_populates = "tags")

class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    time_file = Column(Integer)
    time_chain = Column(Integer)
    text = Column(String)
    time_stamp = Column(Integer)

    sound_file_id = Column(Integer, ForeignKey("sound_file.id"))
    #sound_chain = relationship("SoundChain", back_populates = "comments")


class SoundInterval(Base):
    __tablename__ = "sound_interval"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    highest_volume = Column(Integer, index=True)

    sound_file_id = Column(Integer, ForeignKey("sound_file.id"))
    #sound_file = relationship("SoundFile", back_populates = "sound_intervals")
    #sounds = relationship("Sound", back_populates = "sound_interval")


class Sound(Base):
    __tablename__ = "sound"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    trust_value = Column(Integer, index=True)
    sound_class = Column(String, index=True)

    sound_interval_id = Column(Integer, ForeignKey("sound_interval.id"))
    #sound_interval = relationship("SoundInterval", back_populates = "sounds")


class Dossier(Base):
    __tablename__ = "dossier"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    name = Column(String, index=True)

    parent_folder_id = Column(Integer, ForeignKey("dossier.id"), nullable=True)
    #parent_folder = relationship("Dossier", remote_side=[id])
    #folders = relationship("Folder", back_populates = "dossier")


class Folder(Base):
    __tablename__ = "folder"

    dossier_id = Column(Integer, ForeignKey("dossier.id"), primary_key = True)
    sound_file_id = Column(Integer, ForeignKey("sound_file.id"), primary_key=True)
    #dossier = relationship("Dossier", back_populates = "folders")
    #sound_file = relationship("SoundFile", back_populates = "folder")

