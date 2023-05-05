from Endpoints.dossier import *

# Testar create_dossier, read_dossier, insert_dossier, create_underdossier, delete_dossier
def run():
    print("------------ Create 3 Dossiers ------------ ")
    print(create_dossier("Doss1"))
    print(create_dossier("Doss2"))
    print(create_dossier("Doss3"))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name Doss1, Doss2, Doss3")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name))

    print("------------ CHANGE NAME ON Doss1 ------------ ")
    print(insert_dossier(1, "New_Doss1"))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name))


    print("------------ Create 2 Under_Dossiers ------------ ")
    print(create_underdossier("UnderDoss1", 1))
    print(create_underdossier("UnderDoss2", 2))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3, UnderDoss1, Underdoss2")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name), i[0].parent_folder_id)


    print("---------- GET ALL overdossiers -----------")
    print("Should be three with name New_Doss1, Doss2, Doss3")
    getdoss = read_overdossier()
    for i in getdoss:
        print((i[0].id, i[0].name, i[0].parent_folder_id))

    print("---------- DELETE Doss2 -----------")
    print(delete_dossier(2))

    print("---------- GET ALL dossiers -----------")
    print("Should be three with name New_Doss1, Doss3, UnderDoss1")
    getdoss = read_dossier()
    for i in getdoss:
        print((i[0].id, i[0].name, i[0].parent_folder_id))
