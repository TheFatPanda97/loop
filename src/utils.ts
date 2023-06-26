import { Configuration, OpenAIApi } from 'openai';
import type { ChatCompletionRequestMessage } from 'openai';

export const isInteger = (str: string) =>
  !isNaN(parseFloat(str)) && Number.isInteger(parseFloat(str));

export const generateCode = async (testCases: string, OPENAI_API_KEY: string, model: string) => {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const messages: Array<ChatCompletionRequestMessage> = [
    {
      role: 'user',
      content:
        'I sent you a test suite, write code that passes it. Respond only with the code. Do NOT provide any explanations',
    },
    { role: 'user', content: testCases },
  ];

  const chatCompletion = await openai.createChatCompletion({
    model,
    messages,
  });

  return chatCompletion.data.choices[0].message?.content || '';
};
