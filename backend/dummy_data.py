from sqlalchemy import insert, update
from Endpoints.helpers import Soundclass
import models
import datetime
import time



def insert_dummy(session):
    ######## CREATE TIME ########
    print("-------- creating time --------")
    datum1 = datetime.datetime(2023, 3, 18, 0, 0, 0)
    datum2 = datetime.datetime(1970, 1, 1, 1, 1, 0)
    datum3 = datetime.datetime(2023, 3, 18, 0, 16, 47)

    datum4 = datetime.datetime(2023, 5, 10, 2, 0, 0)
    datum5 = datetime.datetime(1970, 1, 2, 2, 1, 0)
    datum6 = datetime.datetime(2023, 5, 11, 2, 2, 0)

    datum7 = datetime.datetime(2022, 2, 3, 3, 0, 0)
    datum8 = datetime.datetime(1970, 1, 3, 3, 1, 0)
    datum9 = datetime.datetime(2022, 2, 3, 3, 2, 0)

    datum10 = datetime.datetime(2099, 1, 3, 4, 0, 0)
    datum11 = datetime.datetime(1970, 1, 3, 4, 1, 0)
    datum12 = datetime.datetime(2099, 1, 3, 4, 2, 0)


    time1 = time.mktime(datum1.timetuple())
    time2 = time.mktime(datum2.timetuple())
    time3 = time.mktime(datum3.timetuple())

    time4 = time.mktime(datum4.timetuple())
    time5 = time.mktime(datum5.timetuple())
    time6 = time.mktime(datum6.timetuple())

    time7 = time.mktime(datum7.timetuple())
    time8 = time.mktime(datum8.timetuple())
    time9 = time.mktime(datum9.timetuple())

    time10 = time.mktime(datum10.timetuple())
    time11 = time.mktime(datum11.timetuple())
    time12 = time.mktime(datum12.timetuple())

    timelist= [time1, time2, time3, time4, time5, time6, time7, time8, time9, time10, time11, time12]

    ######## CREATE INVESTIGATIONS ########
    print("-------- creating inestigations --------")
    session.execute(insert(models.Investigations).values(name = "Case-A24"))
    session.execute(insert(models.Investigations).values(name = "Case-A31"))
    session.execute(insert(models.Investigations).values(name = "Case-B02"))
    session.execute(insert(models.Investigations).values(name = "Case-B14"))

    ######## CREATE SOUNDCLASSES ########
    print("-------- creating soundclasses --------")

    for column in list(Soundclass):
        session.execute(insert(models.SoundClass).values(name = column.name))


    ######## CREATE SOUNDCHAINS ########
    print("-------- creating soundchains --------")
    session.execute(insert(models.SoundChain).values(start_time = time1, end_time =  time3, investigations_id = 1, chain_state = "1"))
    session.execute(insert(models.SoundChain).values(start_time =  time4, end_time =  time6, investigations_id = 1, chain_state = "0"))
    session.execute(insert(models.SoundChain).values(start_time =  time7, end_time =  time9, investigations_id = 2, chain_state = "2"))
    session.execute(insert(models.SoundChain).values(start_time =  time10, end_time =  time12, investigations_id = 2, chain_state = "3"))


    ######## CREATE SOUNDFILES ########

    ########## BEGIN DATA NEEDED FOR DEMO
    print("-------- creating soundfiles --------")
    t1_rw = datetime.datetime(2023, 3, 18, 0, 0, 0);
    t2_rw = datetime.datetime(2023, 3, 18, 0, 2, 5);
    file_name_rw = t1_rw.strftime("%Y-%m-%d_%H%M") + "_" + t2_rw.strftime("%H%M") + ".mp3";
    session.execute(insert(models.SoundFile).values(start_time = time.mktime(t1_rw.timetuple()),
                                                    end_time =   time.mktime(t2_rw.timetuple()),
                                                    file_name = file_name_rw,
                                                    sound_chain_id = 1,
                                                    file_state = "0"))
    t3_rw = datetime.datetime(2023, 3, 18, 0, 2, 5);
    t4_rw = datetime.datetime(2023, 3, 18, 0, 7, 44);
    file_name_rw = t3_rw.strftime("%Y-%m-%d_%H%M") + "_" + t4_rw.strftime("%H%M") + ".mp3";
    session.execute(insert(models.SoundFile).values(start_time = time.mktime(t3_rw.timetuple()),
                                                    end_time =   time.mktime(t4_rw.timetuple()),
                                                    file_name = file_name_rw,
                                                    sound_chain_id = 1,
                                                    file_state = "1"))
    t5_rw = datetime.datetime(2023, 3, 18, 0, 7, 44);
    t6_rw = datetime.datetime(2023, 3, 18, 0, 11, 30);
    file_name_rw = t5_rw.strftime("%Y-%m-%d_%H%M") + "_" + t6_rw.strftime("%H%M") + ".mp3";
    session.execute(insert(models.SoundFile).values(start_time = time.mktime(t5_rw.timetuple()),
                                                    end_time =   time.mktime(t6_rw.timetuple()),
                                                    file_name = file_name_rw,
                                                    sound_chain_id = 1,
                                                    file_state = "2"))
    t7_rw = datetime.datetime(2023, 3, 18, 0, 11, 30);
    t8_rw = datetime.datetime(2023, 3, 18, 0, 16, 47);
    file_name_rw = t7_rw.strftime("%Y-%m-%d_%H%M") + "_" + t8_rw.strftime("%H%M") + ".mp3";
    session.execute(insert(models.SoundFile).values(start_time = time.mktime(t7_rw.timetuple()),
                                                    end_time =   time.mktime(t8_rw.timetuple()),
                                                    file_name = file_name_rw,
                                                    sound_chain_id = 1,
                                                    file_state = "3"))
    ########## END DATA NEEDED FOR DEMO

    session.execute(insert(models.SoundFile).values(start_time = time4,
                                                    end_time =  time5,
                                                    file_name = "soundfile_5",
                                                    sound_chain_id = 2,
                                                    file_state = "0"))
    session.execute(insert(models.SoundFile).values(start_time = time5,
                                                    end_time =  time6,
                                                    file_name = "soundfile_6",
                                                    sound_chain_id = 2,
                                                    file_state = "0"))
    session.execute(insert(models.SoundFile).values(start_time = time7,
                                                    end_time =  time8,
                                                    file_name = "soundfile_7",
                                                    sound_chain_id = 3,
                                                    file_state = "0"))
    session.execute(insert(models.SoundFile).values(start_time = time8,
                                                    end_time =  time9,
                                                    file_name = "soundfile_8",
                                                    sound_chain_id = 3,
                                                    file_state = "0"))
    session.execute(insert(models.SoundFile).values(start_time = time10,
                                                    end_time =  time11,
                                                    file_name = "soundfile_9",
                                                    sound_chain_id = 4,
                                                    file_state = "0"))
    session.execute(insert(models.SoundFile).values(start_time = time11,
                                                    end_time =  time12,
                                                    file_name = "soundfile_10",
                                                    sound_chain_id = 4,
                                                    file_state = "0"))


    ######## CREATE COMMENTS ########
    print("--------  creating comments --------")
    t1_cw = datetime.datetime(2023, 3, 18, 0, 0, 0)
    comment_time1 = time.mktime(t1_rw.timetuple())
    session.execute(insert(models.Comments).values(time_file =  40,
                                                   time_chain = (comment_time1 + 40) - time1,
                                                   text = "Prat mellan X och Y",
                                                   sound_file_id = 1,
                                                   time_stamp = 1683586800))
    session.execute(insert(models.Comments).values(time_file =  50,
                                                   time_chain = (comment_time1 + 50) - time1,
                                                   text = "Viskning mellan X och Y",
                                                   sound_file_id = 1,
                                                   time_stamp = 1683589800))

    t2_cw = datetime.datetime(2023, 3, 18, 0, 2, 5)
    comment_time2 = time.mktime(t2_cw.timetuple())
    session.execute(insert(models.Comments).values(time_file =  5,
                                                   time_chain = (comment_time2 + 5) - time1,
                                                   text = "Skrik",
                                                   sound_file_id = 2,
                                                   time_stamp = 1693586800))
    session.execute(insert(models.Comments).values(time_file = 10,
                                                   time_chain = (comment_time2 + 10) - time1,
                                                   text = "Bil kommer",
                                                   sound_file_id = 2,
                                                   time_stamp = 1695586800))




    ######## CREATE SOUNDINTERVALS ########
    print("-------- creating soundintervals --------")

    for i in range(8):
        for j in range(6):
            start_t = timelist[i] + 10*j
            end_t = start_t + 10
            session.execute(insert(models.SoundInterval).values(start_time = start_t, end_time = end_t, highest_volume = 5000, sound_file_id = i + 1))


     ######## CREATE SOUNDS ########
    print("-------- creating sounds --------")
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "Speech", sound_interval_id = 1))
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "Shout", sound_interval_id = 1))
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "Whispering", sound_interval_id = 7))
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "Laughter", sound_interval_id = 8))
    session.execute(insert(models.Sound).values(trust_value = 0.6, sound_class = "Crying", sound_interval_id = 9))


    ######## CREATE TAGS ########
    print("-------- creating tags --------")
    session.execute(update(models.SoundChain).where(models.SoundChain.id == 1).values(chain_state = "1"))




    ######## CREATE DOSSIERS ########
    print("-------- creating dossiers --------")
    session.execute(insert(models.Dossier).values(name = "Favoriter"))
    session.execute(insert(models.Dossier).values(name = "Telefonsamtal"))


    ######## CREATE UNDER-DOSSIERS ########
    print("-------- creating under-dossiers --------")
    session.execute(insert(models.Dossier).values(name = "Bil i Case A & B", parent_folder_id = 2))
    session.execute(insert(models.Dossier).values(name = "Promenad i Case A & B", parent_folder_id = 2))
    session.execute(insert(models.Dossier).values(name = "Demo"))


    ######## CONNECTIING FILES TO DOSSIER ########
    print("-------- connecting files to dossiers --------")
    session.execute(insert(models.Folder).values(dossier_id = 1, sound_file_id = 1))
    session.execute(insert(models.Folder).values(dossier_id = 1, sound_file_id = 2))
    session.execute(insert(models.Folder).values(dossier_id = 2, sound_file_id = 3))
    session.execute(insert(models.Folder).values(dossier_id = 3, sound_file_id = 4))
    session.execute(insert(models.Folder).values(dossier_id = 4, sound_file_id = 7))
    session.execute(insert(models.Folder).values(dossier_id = 4, sound_file_id = 8))


    return 200
