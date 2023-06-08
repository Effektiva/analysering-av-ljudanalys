from sqlalchemy import Column, ForeignKey, Integer, String
from database import Base


class SoundClass(Base):
    __tablename__ = "sound_class"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    color = Column(String, index=True)


class Investigations(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)


class SoundChain(Base):
    __tablename__ = "sound_chain"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    chain_state = Column(String, nullable=True)

    investigations_id = Column(Integer, ForeignKey("investigations.id"))


class SoundFile(Base):
    __tablename__ = "sound_file"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    file_name = Column(String, index=True)
    file_state = Column(String, nullable=True)
    analysis_percentage = Column(Integer, nullable=True)
    sound_chain_id = Column(Integer, ForeignKey("sound_chain.id"))


class Tags(Base):
    __tablename__ = "tags"

    tag_id = Column(String, primary_key=True)
    sound_file_id = Column(Integer, ForeignKey("sound_file.id"), primary_key=True)


class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    time_file = Column(Integer)
    time_chain = Column(Integer)
    text = Column(String)
    time_stamp = Column(Integer)
    sound_file_id = Column(Integer, ForeignKey("sound_file.id"))


class SoundInterval(Base):
    __tablename__ = "sound_interval"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    start_time = Column(Integer)
    end_time = Column(Integer)
    highest_volume = Column(Integer, index=True)
    sound_file_id = Column(Integer, ForeignKey("sound_file.id"))


class Sound(Base):
    __tablename__ = "sound"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    trust_value = Column(Integer, index=True)
    sound_class = Column(String, index=True)
    sound_interval_id = Column(Integer, ForeignKey("sound_interval.id"))


class Dossier(Base):
    __tablename__ = "dossier"

    id = Column(Integer, primary_key=True, index=True, autoincrement = True)
    name = Column(String, index=True)
    parent_folder_id = Column(Integer, ForeignKey("dossier.id"), nullable=True)


class Folder(Base):
    __tablename__ = "folder"

    dossier_id = Column(Integer, ForeignKey("dossier.id"), primary_key = True)
    sound_file_id = Column(Integer, ForeignKey("sound_file.id"), primary_key=True)
