const express = require("express");
const hbs = require("hbs");
const multer = require("multer");
const path = require("path");

const app = express();

// Конфигурация хранилища для multer:
//  - destination: папка для сохранения загружаемых файлов ("files")
//  - filename: сохраняем файл под оригинальным именем

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
// Создаем middleware для загрузки файлов с указанным хранилищем
const upload = multer({ storage: storageConfig });

app.set("view engine", "hbs"); // устанавливаем Handlebars как движок шаблонов
// Подключаем папку "public" как статическую для отдачи CSS, JS, изображений и т.п.
app.use(express.static(path.join(__dirname, "public"))); // или "files"
// Регистрируем частичные шаблоны Handlebars для повторяющихся фрагментов в "views/partial"
hbs.registerPartials(path.join(__dirname, "views/partial"));
// Главная страница – рендерим шаблон "index" с данными
app.get("/", (req, res) => {
    res.render("index", {
        title: "ГЛАВНАЯ СТРАНИЦА",
        description: "Вывод хранимых файлов"
    });
});
// Страница загрузки файла – рендерим шаблон "upload" с кнопкой загрузки
app.get("/upload", (req, res) => {
    res.render("upload", {
        title: "kuku",
        btn: "Загрузить"
    });
});
// Обработка POST-запроса на загрузку файла - СРАБОТАЕТ ПРИ НАЖАТИИ КНОПКИ
// Middleware upload.single("filedata") обрабатывает одно поле с именем "filedata"
app.post("/upload", upload.single("filedata"), (req, res) => {
    if (!req.file) {// если файл не был загружен, отправляем сообщение об ошибке
        return res.send("Ошибка при загрузке файла");
    }
    // если загрузка успешна – отображаем форму загрузки с кнопкой
    res.render("upload", {
        title: "kuku",
        btn: "Загрузить"
    });
});
// Запускаем сервер на порту 3000 и выводим сообщение в консоль
app.listen(3000, () => {
    console.log("Запущен сервер на порту 3000");
});