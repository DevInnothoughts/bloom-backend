require('dotenv').config();

const { env } = process;

const config = {
  port: env.PORT,
  applicationName: env.APPLICATION_NAME,
  environment: env.ENVIRONMENT,
  db: {
    connection: {
      user: env.DB_USER,
      url: env.DB_URL,
      host: env.DB_HOST,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      port: env.DB_PORT,
      dialect: env.DB_DIALECT,
    },
  },
  openai: {
    apiUrl: env.OPENAI_API_URL,
    apiKey: env.OPENAI_API_KEY,
    defaultModel: 'gpt-4o-mini', //'gpt-4-1106-preview',
    defaultTemp: 0.8,
    availableTones: [
      'casual and conversational',
      'realistic and down-to-earth',
      'neutral with personal touch',
      'mildly satisfied but critical',
      'informal and honest',
      'friendly and grateful',
      'warm and compassionate',
      'analytical and precise',
      'direct and straightforward',
      'supportive but honest',
      'empathetic and understanding',
      'reserved and cautious',
      'reflective and thoughtful',
    ],
    userPromptPrefix: `Follow these exact instructions when writing the review:

    - Use first person or short storytelling style.
    - Don't mention any star rating or score. Just describe how the experience felt.
    - Write like a real person — easy and simple English, like how someone talks online.
    - Use contractions (I'm, it's, didn't, etc.) to sound natural.
    - It's okay to include light hesitations or vague words like "kind of", "maybe", "I guess" where
    it feels realistic.
    - Sentence fragments and casual phrasing are fine, but avoid being messy.
    - Try to reflect the user's own tone if "Important Question" is answered.
    - STRICTLY avoid flowery, exaggerated, or metaphorical language.
    - STRICTLY avoid rhetorical questions or exclamations for emphasis.
    - STRICTLY avoid repeating adjectives or sounding overly polished.
    - Emojis can be used, but only if they add meaning — and never more than 2.
    - Keep review between 80 and 100 words. Don’t go over or under.
    - If it feels right, break the final thought into a second short paragraph — just like real users
    often do.`,
  },
  corsWhitelist: env.APP_URLS
    ? env.APP_URLS.split(',').map((appUrl) => appUrl.trim())
    : [],
  webServerSecret: process.env.WEB_SERVER_SECRET,
  userApiSecret: process.env.USER_API_SECRET,
};

module.exports = config;
