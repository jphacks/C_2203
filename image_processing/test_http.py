import requests

while True:
    query = input("query:")
    r = requests.get('http://localhost:8000/animate?q=' + query)