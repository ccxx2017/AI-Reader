import os
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from openai import OpenAI
from dotenv import load_dotenv
import base64

load_dotenv()

QWEN_API_KEY = os.getenv('QWEN_API_KEY')
QWEN_BASE_URL = os.getenv('QWEN_BASE_URL')

client = OpenAI(
    api_key=QWEN_API_KEY,
    base_url=QWEN_BASE_URL
)

router = APIRouter()

@router.post('/api/ocr/upload')
async def ocr_upload(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img_base64 = base64.b64encode(img_bytes).decode()
    try:
        completion = client.chat.completions.create(
            model="qwen-vl-ocr",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": f"data:{file.content_type};base64,{img_base64}",
                            "min_pixels": 28 * 28 * 4,
                            "max_pixels": 28 * 28 * 1280
                        },
                        {"type": "text", "text": "Read all the text in the image."}
                    ]
                }
            ]
        )
        result_text = completion.choices[0].message.content
        return JSONResponse({"text": result_text})
    except Exception as e:
        return JSONResponse({"text": f"识别失败: {str(e)}"}, status_code=500)