from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr_api import router as ocr_router

app = FastAPI()

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册OCR路由
app.include_router(ocr_router)

@app.get("/")
def root():
    return {"message": "AI阅读助手后端已启动"}

# 启动命令：uvicorn main:app --reload --host 0.0.0.0 --port 8000
