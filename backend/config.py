from enum import Enum

class Paths(str, Enum):
    # Where we store uploaded soundfiles.
    # (uploads/[Investigation.id]/[Soundchain.id]/files/[soundfiles])
    uploads = "uploads/"

