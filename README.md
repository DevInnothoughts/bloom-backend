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