
# PosDesktop

PosDesktop is a minimalist point of sale, that include features like CRUD of products, categories and users.

PosDesktop allows you to record your bussiness' sales so search and view them. This project is oriented for small bussiness and will be continously updated and mainteined.

For more details, please review the documentation section, sorry but the documentation it's only in spanish for the moment. The UML models are in English.

PosDesktop is open source, so, you can modify/extend and use with complety freedom. The project is development in [Electron](https://www.electronjs.org/) for it can make for macOs, Linux and Windows.

Currently, the macOs distributable is not available.

I will be happy if you use this project and report any issues or suggestions.

Thank you for use this project.

## Project structure

```
src/
|-- data/
    |-- datasource/
        |-- ds-interfaces/      # Interface that has dao implements
        |-- ds-sequelize/       # Sequelize implementation
        |-- ds-sqlite/          # sqlite implementation for demo DI
        |-- utils               # util for transform data
    |-- model/                  # Pos'models
    |-- pos-config/             # Pos'config implementation
    |-- repository/             # Intermediary for data and ui
|-- electron/                   # Configure ipcMethods for ui uses
    |-- decorators/             # Configure ipcMethods for each model
|-- icons/                      # App' icons
|-- locales/                    # App' locales
    |-- en/                     # English locale
       |-- global.json
    |-- es/                     # Spanish locale
       |-- global.json
|-- ui/          # Each feature follow the next structure
    |-- feature/
        |-- components/
        |-- stylesheets/
    |-- PosDesktopApp.tsx       # Include de global.window interface for communicates electron and ui
|-- i18n.ts                     # Configure i18n for ui
|-- index.ts                    # Contain the structure for initialize electron
|-- preload.ts                  # Secure expose the data layer' methods for ui
.
..
...
```


## Run Locally

Clone the project

```bash
git clone https://github.com/Caot2204/PosDesktop.git
```

Go to the project directory

```bash
cd PosDesktop
```

Install dependencies

```bash
npm install
```

Start development environment

```bash
npm start
```

## Make the project

Make a installer for your operative system

```bash
npm run make
```

## License

[MIT](https://choosealicense.com/licenses/mit/)