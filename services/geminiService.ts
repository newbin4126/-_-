import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getEncouragement = async (taskTitle: string): Promise<string> => {
  if (!apiKey) {
    return "오늘 하루도 정말 고생 많았어요. 당신의 속도대로 가면 돼요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User just completed a small self-care or study task: "${taskTitle}".
      Provide a very short, warm, gentle, and healing one-sentence encouragement in Korean.
      Tone: Calm, supportive, "it's okay to be slow". Do not use emojis.
      Example: "조금씩 나아가는 당신의 모습이 참 멋져요."`,
    });
    return response.text?.trim() || "한 걸음 더 나아간 당신을 응원해요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "한 걸음 더 나아간 당신을 응원해요.";
  }
};

export const getSuggestedChallenge = async (): Promise<string> => {
    if (!apiKey) return "창문 열고 1분간 환기하기";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest one very small, easy-to-do task for someone who is socially withdrawn or feeling low energy.
            Category: Can be about tidying up, small study, or self-care.
            Output: Just the task name in Korean. No explanation.
            Example: "물 한 잔 천천히 마시기"`
        });
        return response.text?.trim() || "좋아하는 음악 한 곡 듣기";
    } catch (e) {
        return "좋아하는 음악 한 곡 듣기";
    }
}
