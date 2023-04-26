
# Endpoints:

  
  

### 1) "/"

Форма для создания юзера. После submit выводится объект userа.

  

### 2) "/api/docs"

  

Для более удобного описания API был использован Swagger, на странице будут изображены все endpoint и их краткое описание.

  
  
  
# Требования:
  

### 1) Typescript

Проект полностью написан на typescript.

  

### 2) Node fraemwork + orm + relation db (edited)

В проекте используются Sequlize ORM + Node JS + PostgreSQL.

  

### 3) Авторизация

Клиент отправляет POST запрос по /login с логином и паролем(body запроса) Веб-приложение проверяет логин и пароль, и если они верны, то генерирует JWT-токен и отправляет его обратно клиенту. Всякий раз, когда пользователь хочет получить доступ к защищенному маршруту или ресурсу, пользовательский агент должен отправить JWT, в заголовке **Authorization**, используя схему **Bearer** .

### 4) Docker и Docker-compose 
В двух Docker-контейнерах разворачиваются само приложение(api) и база данных (database).


