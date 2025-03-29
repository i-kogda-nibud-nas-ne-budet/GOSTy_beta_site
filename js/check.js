/**
 * check.js - Скрипт для страницы проверки документов GOSTY
 * Python 3.13 типизация учтена в комментариях для будущей интеграции с Python
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация плавающих элементов
    addFloatingElements();
    
    // Кнопка "Наверх"
    setupBackToTopButton();
    
    // Настройка выбора категории пользователя
    setupCategorySelection();
    
    // Настройка области загрузки файлов
    setupFileUpload();
    
    // Обработка отправки файла
    setupFileSubmission();
});

/**
 * Настраивает выбор категории пользователя
 * @returns {void}
 */
function setupCategorySelection() {
    const categoryButtons = document.querySelectorAll('.select-category');
    const permissionBlock = document.getElementById('permission-block');
    const uploadBlock = document.getElementById('upload-block');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Сбросить активные категории
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Активировать выбранную категорию
            this.parentElement.classList.add('active');
            
            // Показать соответствующий блок в зависимости от категории
            if (category === 'personal') {
                permissionBlock.style.display = 'none';
                uploadBlock.style.display = 'block';
            } else {
                // Для профессионала или организации
                permissionBlock.style.display = 'block';
                uploadBlock.style.display = 'none';
            }
            
            // Плавная прокрутка к следующему блоку
            const nextBlock = category === 'personal' ? uploadBlock : permissionBlock;
            nextBlock.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * Настраивает область загрузки файлов
 * @returns {void}
 */
function setupFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectedFile = document.getElementById('selected-file');
    const fileName = document.getElementById('file-name');
    
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
    
    // Подсветка при пере��аскивании
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
            alert('Пожалуйста, загрузите файл в формате DOCX.');
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
    
    submitButton.addEventListener('click', function() {
        if (!window.uploadedFile) {
            alert('Пожалуйста, сначала выберите файл.');
            return;
        }
        
        // Скрыть блок загрузки и показать блок обработки
        uploadBlock.style.display = 'none';
        processingBlock.style.display = 'block';
        
        // Имитация отправки файла на сервер
        // В реальном приложении здесь будет отправка файла
        simulateFileProcessing();
    });
    
    /**
     * Имитирует обработку файла
     * В реальном приложении будет заменена на отправку в серверлесс-сервис
     * @returns {void}
     */
    function simulateFileProcessing() {
        // Имитация задержки обработки
        setTimeout(function() {
            // Перенаправление на страницу с отчетом
            window.location.href = 'report.html';
        }, 3000); // Задержка 3 секунды для имитации обработки
    }
}

/**
 * Создает и добавляет плавающие элементы (пузырьки) на страницу
 * @returns {void}
 */
function addFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
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