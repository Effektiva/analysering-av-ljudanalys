from Endpoints.soundChains import *
from Endpoints.investigations import *

def run():
    print("------------ Create 1 Investigations and 2 soundchains ------------ ")
    print(create_investigations("Inv1"))
    sound_files = [{"start_time": "08:10", "end_time": "09:10", "inv_id": "1", "file_name": "File1"},
    {"start_time": "09:10", "end_time": "09:20", "inv_id": "1", "file_name": "File2"},
    {"start_time": "09:25", "end_time": "09:55", "inv_id": "1", "file_name": "File3"}]
    print(create_investigationsSoundChains(sound_files))

    print(read_investigations()[0][0].id)

    print("---------- GET ALL soundchains -----------")
    print("Should be two with (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20) (ID: 2, Inv_id: Inv1, Star_time: 09:25, End_time: 09:55)")
    getsoundchains = read_investigationsSoundChains(1)
    for i in getsoundchains:
        print((f"ID: {i[0].id} Inv_id: {i[0].investigations_id} Start_time: {i[0].start_time} End_time: {i[0].end_time}"))

    print("---------- Update soundchains (EJ FIXAT) -----------")

    print("---------- DELETE Soundchain with ID: 2 -----------")
    print(remove_investigationsSoundChains(2))

    print("---------- GET ALL soundchains -----------")
    print("Should be one with (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20)")
    getsoundchains = read_investigationsSoundChains(1)
    for i in getsoundchains:
        print((f"ID: {i[0].id} Inv_id: {i[0].investigations_id} Start_time: {i[0].start_time} End_time: {i[0].end_time}"))

    print("-------------- ADD COMMENT ----------------")
    print(create_comment(1, "08:20", "Kommentar1"))
    print(create_comment(1, "08:30", "Kommentar2"))
    print("---------- READ Soundchain data -----------")
    print("Sould be (ID: 1, Inv_id: Inv1, Star_time: 08:10, End_time: 09:20)")
    data = read_soundchaindata(1,1)
    print(data)
    chain = data[0][0]
    print((f"ID: {chain.id} Inv_id: {chain.investigations_id} Start_time: {chain.start_time} End_time: {chain.end_time}"))
    print("-------------- Soundfiles data -------------")
    for i in range(1, len(data)):
        chain = data[i][0]

        if isinstance(data[i][0], models.SoundFile):
            print((f"ID: {chain.id} Sound_Chain_ID: {chain.sound_chain_id} Start_time: {chain.start_time} End_time: {chain.end_time} File_name: {chain.file_name}"))
        elif isinstance(data[i][0], models.Comments):
             print((f"ID: {chain.sound_chain_id} Sound_Chain_ID: {chain.sound_chain_id} Time: {chain.time} Text: {chain.text}"))
    print()
