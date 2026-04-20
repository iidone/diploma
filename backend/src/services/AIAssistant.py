from gigachat import GigaChat
import logging

class AIService:
    def __init__(self, credentials: str):
        self.credentials = credentials

    async def get_answer(self, user_text: str, history: list = None) -> str:
        async with GigaChat(credentials=self.credentials, scope="GIGACHAT_API_PERS", verify_ssl_certs=False, timeout=30) as giga:
            system_instruction = (
                "Ты — официальный ИИ-помощник рекламной компании CraftSigns. "
                "Твоя задача: помогать клиентам с выбором рекламных конструкций. "
                "\n\nИНФОРМАЦИЯ О КОМПАНИИ И ЦЕНАХ:\n"
                "- Световые короба: от 5000 руб/кв.м. Срок изготовления: 3-5 дней.\n"
                "- Объемные буквы: от 80 руб/см высоты. Срок: 4-7 дней.\n"
                "- Баннеры: печать от 450 руб/кв.м. Срок: от 1 дня.\n"
                "- Офисные таблички: от 500 руб. за штуку.\n"
                "- Монтаж: рассчитывается индивидуально, обычно 15-20% от стоимости изделия.\n"
                "- Услуги: Фрезеровка материала, монтаж и демонтаж баннера, замена старого баннера на новый, починка сломанного баннера.\n"
                "- Находимся: г. Москва, ул. Пушкина, д. 1. Работаем по договорённости с клиентом (дата и время обсуждаются).\n\n"
                "ПРАВИЛА ОТВЕТОВ:\n"
                "1. Будь вежливым и профессиональным.\n"
                "2. Если клиент спрашивает цену, которой нет в списке, скажи, что менеджер уточнит детали и укажи на средства связи, указанные в разделе контактов.\n"
                "3. Всегда старайся договориться о замере или расчете сметы."
                
            )

            messages = [
                {
                    "role": "system", 
                    "content": system_instruction
                }
            ]
            
            if history:
                messages.extend(history)
            
            messages.append({"role": "user", "content": user_text})
            
            try:

                payload = {
                    "messages": messages,
                    "model": "GigaChat",
                    "temperature": 0.7
                }
                response = await giga.achat(payload)
                return response.choices[0].message.content
            except Exception as e:
                logging.error(f"GigaChat Error: {e}")
                return "Извините, сейчас я не могу ответить. Попробуйте позже."
