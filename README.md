File Upload
===========

Features
--------

-	File Upload
-	User authentication
-	Docker deployment

Run
---

1.	Clone the repository

2.	Setup environment variables

	```py
	DATABASE_URL=postgresql://billeasy:billeasy@localhost:5432/billeasy
	JWT_SECRET=**JWT_SECRET**
	REDIS_URL=redis://localhost:6379

	# Generate a random string for JWT_SECRET. If python is installed use
	# `py -c "import secrets;print(secrets.token_hex(16))"`
	# command to generate a random string
	```

3.	Use docker for isolated and stable environment

	```sh
	docker-compose up -d
	```

	If docker-compose is not working (as bugged on my system), you can use 'start.sh' file

	```sh
	sudo chmod a+x start.sh
	./start.sh
	```

4.	API will be available at http://localhost:3000

Design Choices
--------------

1.	I have used TypeScript for the project as it is easier to use than JavaScript.

2.	Prisma ORM is used as it is easier to use than Sequelize and it supports typescript directly. Also its more secure than writing raw SQL queries directly in code. In my opinion Node.js is not secure enough to write SQL queries directly, compared to other languages such as GoLang, C#, etc.

3.	I have use BullMQ for background jobs as per requirement mentioned in the project. It was first time I used it, so I am not sure if it is the best choice. But it intuitive use, and docs are easier to read.

4.	I have used docker for deployment via script, as my primary system is currently facing issues with docker-compose.

5.	Due to time constraints, I have only added authentication routes for login and registerations, as they are the most important ones for JWT authentication.

Limitation
----------

-	Rate limiting is not implemented (although it is supported by BullMQ)
-	API documentation is not provided (although it can be supported by Swagger) as it automation is more complicated with typescript
-	More auth related routes can be added

### License

[License](./LICENSE)
