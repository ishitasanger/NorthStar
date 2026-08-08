import json
from pathlib import Path


def load_candidates():
    path = Path(__file__).parent.parent / "data" / "candidates.json"

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data["candidates"]

def load_curriculum():
    path = Path(__file__).parent.parent / "data" / "curriculum.json"

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data