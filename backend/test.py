import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_BASE_URL = os.getenv("QWEN_BASE_URL")

client = OpenAI(
    # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx",
    api_key=QWEN_API_KEY,
    base_url=QWEN_BASE_URL
    # base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)
completion = client.chat.completions.create(
    model="qwen-vl-ocr",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241108/ctdzex/biaozhun.jpg",
                    "min_pixels": 28 * 28 * 4,
                    "max_pixels": 28 * 28 * 1280
                },
                # 为保证识别效果，目前模型内部会统一使用"Read all the text in the image."进行识别，用户输入的文本不会生效。
                {"type": "text", "text": "Read all the text in the image."},
            ]
        }
    ])

print(completion.choices[0].message.content)