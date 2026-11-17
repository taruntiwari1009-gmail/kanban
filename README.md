# Kanban Board

A lightweight, browser-based Kanban board built with React. Organize work across three workflow columns, edit cards inline and drag cards between stages.

## Features

- Three workflow columns: To Do, In Progress and Completed
- Add cards to any column
- Edit card titles and descriptions inline
- Drag and drop cards between columns
- Automatically save board changes in browser local storage
- Responsive layout for desktop, tablet and mobile

## Tech stack

- React 18
- Create React App
- React Draggable
- Browser Local Storage

## Getting started

### Requirements

- Node.js (LTS recommended)
- npm

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test -- --watchAll=false
```

### Create a production build

```bash
npm run build
```

## Data storage

The board is saved in the current browser's local storage under the key `data`. It is not synchronized across devices and clearing browser storage will remove the saved board. Do not use this demo to store sensitive information.

## Current limitations

- The board has three fixed workflow columns; custom columns are not supported.
- There is no account system, cloud synchronization or collaboration.
- Cards can be edited and moved, but there is not yet a dedicated delete-card or due-date workflow.

## License

No license has been specified. Contact the repository owner before reusing or redistributing this project.
