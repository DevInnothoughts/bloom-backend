MySQL local installation: https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-22-04

```bash
sudo mysql
mysql> CREATE USER 'bloom-user'@'localhost' IDENTIFIED BY 'bloompassword123@';
mysql -u bloom-user -p
mysql> CREATE DATABASE bloomlocaldb;
```

```bash
mysql> SHOW COLUMNS FROM business_details;
+-----------------------+--------------+------+-----+---------+----------------+
| Field                 | Type         | Null | Key | Default | Extra          |
+-----------------------+--------------+------+-----+---------+----------------+
| id                    | bigint       | NO   | PRI | NULL    | auto_increment |
| business_name         | varchar(255) | YES  |     | NULL    |                |
| business_website_link | varchar(255) | YES  |     | NULL    |                |
| whatsapp              | varchar(255) | YES  |     | NULL    |                |
| created_at            | datetime(6)  | YES  |     | NULL    |                |
| updated_at            | datetime(6)  | YES  |     | NULL    |                |
| version               | bigint       | YES  |     | NULL    |                |
| email_id              | varchar(255) | YES  |     | NULL    |                |
| mobile_number         | varchar(255) | YES  | UNI | NULL    |                |
| user_name             | varchar(255) | YES  |     | NULL    |                |
+-----------------------+--------------+------+-----+---------+----------------+
10 rows in set (0.00 sec)


mysql> SHOW COLUMNS FROM business_response;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | bigint       | NO   | PRI | NULL    | auto_increment |
| business_id | varchar(255) | YES  |     | NULL    |                |
| created_at  | datetime(6)  | YES  |     | NULL    |                |
| response    | blob         | YES  |     | NULL    |                |
| updated_at  | datetime(6)  | YES  |     | NULL    |                |
| version     | bigint       | YES  |     | NULL    |                |
| response_id | varchar(255) | YES  | UNI | NULL    |                |
| review      | blob         | YES  |     | NULL    |                |
| form_id     | varchar(255) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
9 rows in set (0.01 sec)


mysql> SHOW COLUMNS FROM form_draft;
+-----------------------+--------------+------+-----+---------+----------------+
| Field                 | Type         | Null | Key | Default | Extra          |
+-----------------------+--------------+------+-----+---------+----------------+
| id                    | bigint       | NO   | PRI | NULL    | auto_increment |
| about_form            | blob         | YES  |     | NULL    |                |
| business_website_link | varchar(255) | YES  |     | NULL    |                |
| created_at            | datetime(6)  | YES  |     | NULL    |                |
| form_id               | varchar(255) | YES  | UNI | NULL    |                |
| form_name             | varchar(255) | YES  |     | NULL    |                |
| updated_at            | datetime(6)  | YES  |     | NULL    |                |
| form_content          | blob         | YES  |     | NULL    |                |
| form_theme            | blob         | YES  |     | NULL    |                |
| company_id            | varchar(255) | YES  |     | NULL    |                |
+-----------------------+--------------+------+-----+---------+----------------+
10 rows in set (0.01 sec)


mysql> SHOW COLUMNS FROM user;
+--------------+--------------+------+-----+---------+----------------+
| Field        | Type         | Null | Key | Default | Extra          |
+--------------+--------------+------+-----+---------+----------------+
| id           | bigint       | NO   | PRI | NULL    | auto_increment |
| company_id   | varchar(255) | YES  | UNI | NULL    |                |
| company_logo | blob         | YES  |     | NULL    |                |
| company_name | varchar(255) | YES  |     | NULL    |                |
| created_at   | datetime(6)  | YES  |     | NULL    |                |
| email_id     | varchar(255) | YES  | UNI | NULL    |                |
| updated_at   | datetime(6)  | YES  |     | NULL    |                |
| user_id      | varchar(255) | YES  | UNI | NULL    |                |
| version      | bigint       | YES  |     | NULL    |                |
+--------------+--------------+------+-----+---------+----------------+
9 rows in set (0.01 sec)
```

```bash
mysql> ALTER TABLE <table_name> ADD COLUMN <column_name> <column_type>;
mysql> ALTER TABLE <table_name> DROP COLUMN <column_name>;
```

# Original Instructions:

openai: {
apiUrl: env.OPENAI_API_URL,
apiKey: env.OPENAI_API_KEY,
defaultModel: 'gpt-4o-mini', //'gpt-4-1106-preview',
defaultTemp: 1.2,
availableTones: [
'professional and formal',
'excited and enthusiastic',
'warm and compassionate',
'skeptical but convinced',
'reflective and thoughtful',
'direct and straightforward',
'critical but fair',
'casual and conversational',
],
userPromptPrefix: `Follow the instructions very strictly:
    \n- Write the review in either a first person perspective or a narrative style.
    \n- Describe the rating value. Do NOT mention the numerical value in the review.
    \n- Keep the fluency in English like that of a 5th grader.
    \n- Understand the tone & quality of user's English based on the answers for "Important Question" if present
    \n- Try to emulate that tone & quality as much as possible in your review.
    \n- Ensure the review sounds authentic and expresses genuine expereince.
    \n- STRICTLY DO NOT use metaphors to describe every aspect of the user's response.
    \n- STRICTLY DO NOT use questions or exclamations to emphasise your point.
    \n- STRICTLY DO NOT use flowery / exaggerated language.
    \n- Include emojis sparingly & avoid repetition of adjectives.
    \n- Break the review in 1 or 2 paragraphs where necessary.
    \n- Keep the review length between 10 to 70 words.`,
},

# Live .env file

export APPLICATION_NAME='bloom-backend'
export PORT='3001'
export NODE_ENV='production'
export ENVIRONMENT='prod'
export DB_HOST='bloom-mysql-do-user-14415900-0.b.db.ondigitalocean.com'
export DB_URL='bloom-mysql-do-user-14415900-0.b.db.ondigitalocean.com'
export DB_NAME='user_db'
export DB_USER='doadmin'
export DB_PASSWORD='AVNS_nQ4CgD2pSHqu6okWkSz'
export DB_PORT='25060'
export DB_DIALECT='mysql'
export APP_URLS='https://bloomapi.in,http://localhost:3000'
export OPENAI_API_URL='https://api.openai.com'
export OPENAI_API_KEY='sk-proj-XqdwYIu9kXkKN27Hu8U0T3BlbkFJjKh7HoIySXTrODjXJaq0'
export USER_API_SECRET='64hn1Pb84kAagmtPlEjeVe2KCrMudiWJOdOpv4mVDfY='
export WEB_SERVER_SECRET='Pb84kAagmtPlEjeVe2KCrMudiWJOdOpv4mVDfY64hn1='

# Local .env file

export APPLICATION_NAME='bloom-backend'
export PORT='3001'
export NODE_ENV='local'
export ENVIRONMENT='local'
export DB_HOST='127.0.0.1'
export DB_URL='127.0.0.1'
export DB_NAME='bloomlocaldb'
export DB_USER='bloom-user'
export DB_PASSWORD='bloompassword123@'
export DB_PORT='3306'
export DB_DIALECT='mysql'
export APP_URLS='https://bloomapi.in,http://localhost:3000,https://thebariatricsurgeon.com'
export OPENAI_API_URL='https://api.openai.com'
export OPENAI_API_KEY=
export USER_API_SECRET='64hn1Pb84kAagmtPlEjeVe2KCrMudiWJOdOpv4mVDfY='
export WEB_SERVER_SECRET='Pb84kAagmtPlEjeVe2KCrMudiWJOdOpv4mVDfY64hn1='

OLD API Key: sk-proj-XqdwYIu9kXkKN27Hu8U0T3BlbkFJjKh7HoIySXTrODjXJaq0
