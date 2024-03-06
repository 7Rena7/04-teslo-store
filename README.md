<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo Store

## Prepare Dev Mode

1. Clone repository.
2. Run `npm install` to install all dependencies.

```bash
$ npm install
```

3. Install nestjs cli globally if you don't have it.

```bash
$ npm install -g @nestjs/cli
```

4. Clone **.env.template** file to **.env**.

```bash
$ cp .env.template .env
```

5. Set environment variables in **.env** file.

6. Create local database

```bash
$ docker-compose up -d
```

7. Run application

```bash
$ npm run start:dev
```

<!-- 8. Run seed

```bash
$ cURL -X POST http://localhost:3000/api/v2/seed?amount=600
``` -->
