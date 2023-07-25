import time
from sqlalchemy import select, insert, update, delete
from .helpers import make_list, session
import models
from .helpers import npy_to_database


# Class for analysing an investigation and tracking that progress.
# - Analysis_model: ML-Algoritm taking a file.id and analyses the file content returning numpy data.
class AnalyzeInvestigationTask:
    def __init__(self, analysis_model: any):
        self.progress_dict = {}
        self.referens_progress_dict = {}
        self.result = None
        self.analysis_model = analysis_model

    def analyze(self, id: int):
        not_analysed_chains = {}

        sound_chains = make_list(session.execute(select(models.SoundChain).where(models.SoundChain.investigations_id == id)).fetchall())

        for sound_chain in sound_chains:
            state = sound_chain.chain_state
            self.progress_dict[sound_chain.id] = 0
            if state == "0":
                session.execute(update(models.SoundChain).where(models.SoundChain.id == sound_chain.id).values(chain_state = "1"))
                sound_files = make_list(session.execute(select(models.SoundFile).where(models.SoundFile.sound_chain_id == sound_chain.id)).fetchall())
                self.referens_progress_dict[sound_chain.id] = len(sound_files)
                not_analysed_files = []
                for file in sound_files:
                    if file.file_state == "0":
                        not_analysed_files.append(file)
                    else:
                        self.progress_dict[sound_chain.id] += 1
                not_analysed_chains[sound_chain.id] = not_analysed_files

        # Begin analysis
        print(f"Analyzing investigation {id}...")
        for chain_id, files in not_analysed_chains.items():
            for file in files:
                data = self.analysis_model(file.id)
                npy_to_database(file.id, data)
                self.progress_dict[chain_id] += 1

    def get_progress(self, sound_chain_id: int):
        print(f"Analyzing soundChain {sound_chain_id} - {self.progress_dict[sound_chain_id]} / {self.referens_progress_dict[sound_chain_id]}")
        return {"progress": self.progress_dict[sound_chain_id], "total": self.referens_progress_dict[sound_chain_id]}



