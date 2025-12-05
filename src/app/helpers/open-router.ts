import OpenAI from 'openai';
import config from '../../config';
import axios from 'axios';

// export const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: config.openRouterApiKey,
// });

export const askOpenRouter = async (messages: any[]) => {
  const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages
  }, {
    headers: {
      Authorization: `Bearer ${config.openRouterApiKey}`,
      "Content-Type": 'application/json',
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Password Suggestion System"
    }
  })

  return response.data.choices[0].message.content;
}
