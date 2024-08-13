from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

class Item(BaseModel): #Itme이란 클래스는 이런 포맷이 정해져있다.
    id:int# id는 정수값을가지고
    content:str # content는 문자열을 값으로 가진다.



answer='APPLE'

@app.get('/answer') # 해당 경로로 가면 정보를 요청한다.
def get_answer(): #서버의 지정된 해당 값을 리턴한다.
    return answer

app.mount("/wordle", StaticFiles(directory="static", html=True), name="static") 
#/wordle로 접속할때 static폴더에 있는 정적파일들을 서버에서 가져온다 그리고 거기에 있는 html을 실행한다 정도로 이해했다.
#어떤 경로의 정적파일들을 어떤 경로에서 보여줄지도 서버에서 결정할 수 있다.