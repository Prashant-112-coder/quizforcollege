import io, os, json, re
from typing import Optional
import fitz
import httpx
from docx import Document
from pptx import Presentation
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="QuizForge AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class TopicRequest(BaseModel):
    topic: str
    count: int = 10
    difficulty: str = "mixed"
    exam_type: str = "General"
    mode: str = "exam"

def clean(text:str)->str:
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", text)).strip()

def extract_pdf(data:bytes):
    pages=[]
    doc=fitz.open(stream=data,filetype="pdf")
    for i,p in enumerate(doc):
        pages.append({"location":f"Page {i+1}","text":clean(p.get_text())})
    return pages

def extract_docx(data:bytes):
    d=Document(io.BytesIO(data))
    text="\n".join(p.text for p in d.paragraphs if p.text.strip())
    return [{"location":"Document","text":clean(text)}]

def extract_pptx(data:bytes):
    prs=Presentation(io.BytesIO(data)); slides=[]
    for i,s in enumerate(prs.slides):
        parts=[]
        for sh in s.shapes:
            if hasattr(sh,"text") and sh.text.strip(): parts.append(sh.text)
        slides.append({"location":f"Slide {i+1}","text":clean("\n".join(parts))})
    return slides

async def extract_file(filename:str,data:bytes):
    ext=filename.lower().rsplit(".",1)[-1] if "." in filename else ""
    if ext=="pdf": return extract_pdf(data)
    if ext=="docx": return extract_docx(data)
    if ext=="pptx": return extract_pptx(data)
    if ext in ("txt","md","csv"): return [{"location":"Document","text":clean(data.decode("utf-8","ignore"))}]
    raise HTTPException(400, "Supported formats: PDF, DOCX, PPTX, TXT, MD, CSV")

def source_text(pages):
    return "\n\n".join(f"[{p['location']}]\n{p['text']}" for p in pages if p["text"])[:90000]

async def generate_with_openai(context:str, req:dict):
    key=os.getenv("OPENAI_API_KEY")
    if not key: return None
    prompt=f"""Create {req['count']} high-quality multiple-choice questions from the supplied study material.
Difficulty: {req['difficulty']}. Exam type: {req['exam_type']}. Mode: {req['mode']}.
Return ONLY valid JSON: {{"title":"...","questions":[{{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"...","source":"Page/Slide/section"}}]}}
Every answer and explanation must be supported by the material. Do not invent facts.
MATERIAL:
{context}"""
    async with httpx.AsyncClient(timeout=90) as c:
        r=await c.post("https://api.openai.com/v1/chat/completions",headers={"Authorization":f"Bearer {key}","Content-Type":"application/json"},json={"model":os.getenv("OPENAI_MODEL","gpt-4.1-mini"),"messages":[{"role":"system","content":"You generate grounded educational MCQs."},{"role":"user","content":prompt}],"temperature":0.3,"response_format":{"type":"json_object"}})
        r.raise_for_status()
        return json.loads(r.json()["choices"][0]["message"]["content"])

def fallback(context:str,count:int,topic:str):
    chunks=[x.strip() for x in re.split(r"(?<=[.!?])\s+",context) if len(x.strip())>40]
    qs=[]
    for i,ch in enumerate(chunks[:count]):
        words=re.findall(r"\b[A-Za-z][A-Za-z-]{5,}\b",ch)
        answer=words[0] if words else topic
        qs.append({"question":f"According to the study material, which statement is directly supported?","options":[ch[:120],f"{answer} is unrelated to the material.","None of the above.","The material provides no information."],"answer":0,"explanation":f"This question is grounded in the extracted source text: {ch[:300]}","source":"Uploaded material"})
    return {"title":f"{topic or 'Study'} Quiz","questions":qs}

@app.get("/health")
def health(): return {"status":"ok","service":"quizforge-backend"}

@app.post("/api/extract")
async def extract(file:UploadFile=File(...)):
    data=await file.read(); pages=await extract_file(file.filename,data)
    return {"filename":file.filename,"pages":pages,"text":source_text(pages)}

@app.post("/api/generate")
async def generate(file:Optional[UploadFile]=File(None), topic:Optional[str]=Form(None), count:int=Form(10), difficulty:str=Form("mixed"), exam_type:str=Form("General"), mode:str=Form("exam")):
    context=""
    title=topic or "Uploaded Material"
    if file:
        data=await file.read(); pages=await extract_file(file.filename,data); context=source_text(pages); title=file.filename
    elif topic:
        context=f"Topic requested by learner: {topic}"
    else: raise HTTPException(400,"Upload a document or enter a topic.")
    req={"count":max(1,min(count,50)),"difficulty":difficulty,"exam_type":exam_type,"mode":mode}
    result=await generate_with_openai(context,req)
    if not result: result=fallback(context,req["count"],topic or title)
    result["title"]=result.get("title",title); result["source_filename"]=file.filename if file else None
    return result

@app.post("/api/topic-quiz")
async def topic_quiz(req:TopicRequest):
    return await generate(topic=req.topic,count=req.count,difficulty=req.difficulty,exam_type=req.exam_type,mode=req.mode)
