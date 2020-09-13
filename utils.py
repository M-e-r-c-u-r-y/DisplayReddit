import re


def cleanse_text(text, flatten=False):
    """In-place modification of the dictonary passed to the function"""
    if flatten:
        text = re.sub(r"\[NEWLINE\]", " ", text)
    else:
        text = re.sub(r"\[NEWLINE\]", r"\n", text)
    text = text.replace("[COMMA]", ",")
    text = re.sub(r"/r/(\w+)", r"\1 subreddit", text)
    # text = re.sub("[^A-Za-z0-9 ]+", " ", text)
    text = re.sub(r"\[([^]]+)\]\(([^)]+)\)", r"\1 at \2", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"/u/(\w+)", "[USER]", text)
    return text
