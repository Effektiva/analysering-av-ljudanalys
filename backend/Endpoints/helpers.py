from database import SessionLocal

session = SessionLocal()

# Takes a response object and make sure that it can be sent back. Object should be with a fetchall()
def makeList(object):
    listObject = []
    for row in object:
        listObject.append(row[0])

    return listObject
