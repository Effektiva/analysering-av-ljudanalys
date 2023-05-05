
# Testar create_investigations, read_investigations, insert_investigations, remove_investigations
def run():
    print("------------ Create 3 investigations ------------ ")
    print(create_investigations("Inv1"))
    print(create_investigations("Inv2"))
    print(create_investigations("Inv3"))


    print("---------- GET ALL investigations -----------")
    print("Should be three with name Inv1, Inv2, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))

    print("------------ CHANGE NAME ON Inv1 ------------ ")
    print(insert_investigations(1, "New_Inv1"))


    print("---------- GET ALL investigations -----------")
    print("Should be three with name New_Inv1, Inv2, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))

    print("---------- DELETE Inv2 -----------")
    print(remove_investigations(2))

    print("---------- GET ALL investigations -----------")
    print("Should be two with name New_Inv1, Inv3")
    getinvest = read_investigations()
    for i in getinvest:
        print((i[0].id, i[0].name))
