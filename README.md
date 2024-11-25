## Описание

Проект ToDo App — это веб-приложение для управления задачами с использованием WebSocket и библиотеки fabric.js. Пользователи могут создавать, редактировать и удалять задачи, которые отображаются как интерактивные элементы на Canvas. Приложение поддерживает синхронизацию данных между клиентами в режиме реального времени благодаря WebSocket, что делает его идеальным для совместной работы. Адаптивный дизайн от 360px.


## Используемые технологии

### Frontend:
- Next.js
- React
- TypeScript
- Socket.IO-client
- Tailwind CSS
- ESLint
- Prettier
- 
### Backend:
- Node.js
- Socket.IO
- JSON-server
### Интерактивный Canvas:
- Fabric.js


## Функционал

- **Создание задач:** Пользователи могут добавлять задачи с названием, описанием и дедлайном.
- **Редактирование задач:** Возможность изменять уже существующие задачи.
- **Удаление задач:** Задачи можно удалять, и изменения сразу же отображаются на всех подключенных клиентах.
- **Реальное время:** Все изменения синхронизируются между клиентами через WebSocket.
- **Отображение на Canvas:** адачи визуализируются на Canvas с использованием библиотеки fabric.js.

## Установка и запуск

- Клонируйте репозиторий на свой локальный компьютер.
- Установите зависимости, выполнив команду npm install.
- Для запуска приложения необходимо запустить три процесса: сервер данных, сервер WebSocket и клиентскую часть. Это можно сделать одной командой: npm run dev.



