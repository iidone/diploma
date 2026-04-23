from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy import select
from typing import List
from src.database.deps import SessionDep
from src.models.users import UsersModel
from src.models.chat import ChatSession, ChatMessages 
from src.schemas.chat import ChatRequest, ChatResponse
from src.services.AuthService import get_current_user
from src.services.AIAssistant import AIService

router = APIRouter(prefix="/v1/chat", tags=["ИИ-Ассистент"])

ai_service = AIService(credentials="MDE5ZGE5OWEtNzczYy03ZGYwLTk3OWUtZmIxMDgyNGIyZDQ4OjI4OGM5YzFlLTNmY2QtNDVjYy1iMjMyLWY3MjcxMzRmYjhiNg==")

@router.post("/", response_model=ChatResponse, summary="Отправить сообщение ИИ")
async def send_message(
    chat_data: ChatRequest,
    session: SessionDep,
    current_user: UsersModel = Depends(get_current_user)
):
    try:
        if chat_data.chat_id:
            chat_session = await session.get(ChatSession, chat_data.chat_id)
            if not chat_session or chat_session.user_id != current_user.id:
                raise HTTPException(status_code=404, detail="Чат не найден")
        else:
            chat_session = ChatSession(user_id=current_user.id)
            session.add(chat_session)
            await session.flush()

        user_message = ChatMessages(
            chat_id=chat_session.id,
            role="user",
            content=chat_data.message
        )
        session.add(user_message)

        history_result = await session.execute(
            select(ChatMessages)
            .where(ChatMessages.chat_id == chat_session.id)
            .order_by(ChatMessages.timestamp.desc())
            .limit(10)
        )
        history_msgs = history_result.scalars().all()
        ai_history = [{"role": m.role, "content": m.content} for m in reversed(history_msgs)]

        ai_text = await ai_service.get_answer(chat_data.message, session, history=ai_history)

        ai_message = ChatMessages(
            chat_id=chat_session.id,
            role="assistant",
            content=ai_text
        )
        session.add(ai_message)
        
        await session.commit()
        await session.refresh(ai_message)

        return ChatResponse(
            chat_id=chat_session.id,
            role="assistant",
            content=ai_message.content,
            timestamp=ai_message.timestamp
        )

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Chat error: {str(e)}"
        )
