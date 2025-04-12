/**
 * check-page-handler.js - Обработчик для страницы проверки документов
 * Отвечает за загрузку, валидацию и отправку файлов на проверку
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация плавающих элементов
    addFloatingElements();
    
    // Кнопка "Наверх"
    setupBackToTopButton();
    
    // Настройка области загрузки файлов
    setupFileUpload();
    
    // Обработка отправки файла
    setupFileSubmission();
    
    // Настройка блока ошибки
    setupErrorHandling();
});

/**
 * Настраивает область загрузки файлов
 * @returns {void}
 */
function setupFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectedFile = document.getElementById('selected-file');
    const fileName = document.getElementById('file-name');
    
    if (!dropZone || !fileInput || !selectedFile || !fileName) {
        console.error('Не удалось найти необходимые элементы для загрузки файла');
        return;
    }
    
    // Клик по зоне загрузки открывает диалог выбора файла
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Предотвращение стандартного поведения при перетаскивании
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Подсветка при перетаскивании
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.remove('highlight');
        }, false);
    });
    
    // Обработка брошенного файла
    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFile(files[0]);
        }
    }, false);
    
    // Обработка выбранного файла через диалог
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFile(this.files[0]);
        }
    });
    
    /**
     * Обрабатывает загруженный файл
     * @param {File} file - Загруженный файл
     * @returns {void}
     */
    function handleFile(file) {
        // Проверка типа файла (только DOCX)
        if (!file.name.endsWith('.docx')) {
            showNotification('Ошибка', 'Пожалуйста, загрузите файл в формате DOCX.', 'error');
            return;
        }
        
        // Проверка размера файла (максимум 10МБ)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('Ошибка', 'Размер файла превышает 10МБ. Пожалуйста, загрузите файл меньшего размера.', 'error');
            return;
        }
        
        // Отображение информации о файле
        fileName.textContent = file.name;
        selectedFile.style.display = 'block';
        
        // Сохранение ссылки на файл в глобальной переменной
        window.uploadedFile = file;
    }
}

/**
 * Настраивает отправку файла
 * @returns {void}
 */
function setupFileSubmission() {
    const submitButton = document.getElementById('submit-file');
    const uploadBlock = document.getElementById('upload-block');
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    
    if (!submitButton || !uploadBlock || !processingBlock || !errorBlock) {
        console.error('Не удалось найти необходимые элементы для отправки файла');
        return;
    }
    
    submitButton.addEventListener('click', function() {
        if (!window.uploadedFile) {
            showNotification('Ошибка', 'Пожалуйста, сначала выберите файл.', 'error');
            return;
        }
        
        // Скрыть блок загрузки и показать блок обработки
        uploadBlock.style.display = 'none';
        processingBlock.style.display = 'block';
        errorBlock.style.display = 'none';
        
        // Отправка файла на сервер или имитация
        sendFileToServer(window.uploadedFile);
    });
    
    /**
     * Отправляет файл на сервер для проверки
     * @param {File} file - Файл для отправки
     * @returns {void}
     */
    function sendFileToServer(file) {
        // Создание FormData для отправки файла
        const formData = new FormData();
        formData.append('document', file);
        
        // В тестовой версии имитируем отправку
        // В реальной версии здесь будет fetch или XMLHttpRequest
        const simulateServerResponse = Math.random() > 0.3; // 70% успех, 30% ошибка
        
        setTimeout(() => {
            if (simulateServerResponse) {
                // Успешная обработка
                window.location.href = 'report-example.html';
            } else {
                // Ошибка обработки
                showError();
            }
        }, 3000); // Задержка 3 секунды для имитации обработки
        
        /**
         * Пример реальной отправки файла на сервер:
         * 
         * fetch('http://127.0.0.1:5000/api/check-document', {
         *     method: 'POST',
         *     body: formData
         * })
         * .then(response => {
         *     if (!response.ok) {
         *         throw new Error('Ошибка сервера: ' + response.status);
         *     }
         *     return response.json();
         * })
         * .then(data => {
         *     // Перенаправление на страницу с результатами
         *     window.location.href = `report.html?id=${data.reportId}`;
         * })
         * .catch(error => {
         *     console.error('Ошибка при отправке файла:', error);
         *     showError();
         * });
         */
    }
    
    /**
     * Показывает блок с ошибкой и скрывает блок обработки
     * @returns {void}
     */
    function showError() {
        processingBlock.style.display = 'none';
        errorBlock.style.display = 'block';
    }
}

/**
 * Настраивает обработку ошибок на странице
 * @returns {void}
 */
function setupErrorHandling() {
    const tryAgainButton = document.getElementById('try-again-btn');
    const uploadBlock = document.getElementById('upload-block');
    const errorBlock = document.getElementById('error-block');
    
    if (!tryAgainButton || !uploadBlock || !errorBlock) {
        console.error('Не удалось найти необходимые элементы для обработки ошибок');
        return;
    }
    
    tryAgainButton.addEventListener('click', function() {
        // Скрыть блок ошибки и показать блок загрузки
        errorBlock.style.display = 'none';
        uploadBlock.style.display = 'block';
        
        // Сбросить загруженный файл
        window.uploadedFile = null;
        
        // Сбросить отображение выбранного файла
        const selectedFile = document.getElementById('selected-file');
        if (selectedFile) {
            selectedFile.style.display = 'none';
        }
    });
}

/**
 * Создает и добавляет плавающие элементы (пузырьки) на страницу
 * @returns {void}
 */
function addFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    if (!container) {
        console.error('Не удалось найти контейнер для плавающих элементов');
        return;
    }
    
    // Добавление дополнительных пузырьков
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Случайные размеры и позиции
        const size = Math.random() * 50 + 20; // от 20px до 70px
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Случайная позиция
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        
        // Случайная задержка анимации
        element.style.animationDelay = `${Math.random() * 10}s`;
        element.style.animationDuration = `${Math.random() * 10 + 10}s`; // от 10s до 20s
        
        container.appendChild(element);
    }
}

/**
 * Настраивает кнопку "Наверх"
 * @returns {void}
 */
function setupBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) {
        console.error('Не удалось найти кнопку "Наверх"');
        return;
    }
    
    // Показывать кнопку только когда пользователь прокрутил страницу вниз
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Прокрутка вверх при клике
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Показывает уведомление пользователю
 * @param {string} title - Заголовок уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error, warning, info)
 * @returns {void}
 */
function showNotification(title, message, type = 'info') {
    // Проверка наличия внешней функции уведомлений
    if (typeof window.showNotification === 'function') {
        window.showNotification(title, message, type);
    } else {
        // Если внешней функции нет, используем alert
        alert(`${title}: ${message}`);
    }
}