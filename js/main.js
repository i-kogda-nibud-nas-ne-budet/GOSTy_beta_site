/**
 * main.js - Скрипт для главной страницы GOSTY
 * Python 3.13 типизация учтена в комментариях для будущей интеграции с Python
 * Включает функциональность для работы с API
 */

// Инициализация API клиента
const apiBaseUrl = 'http://localhost:8000'; // URL API сервера


// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const authLink = document.getElementById('auth-link');
    
    // Проверяем, авторизован ли пользователь
    if (window.GOSTyApi && window.GOSTyApi.isAuthenticated()) {
        authLink.textContent = 'Личный кабинет';
        authLink.href = 'dashboard.html';
    } else {
        authLink.textContent = 'Войти';
        authLink.href = 'login.html';
    }
});
// Добавление плавающих элементов
document.addEventListener('DOMContentLoaded', function() {
    // Создание плавающих элементов (пузырьков)
    addFloatingElements();
    initializeFloatingElements()
    // Кнопка "Наверх"
    setupBackToTopButton();
    createParticles(20);
    createClearFloatingElements(15);
    
    // Добавление эффекта свечения для карточек
    setupGlowEffect();
    
    // Инициализация API и проверка его состояния
    if (typeof normifyApi !== 'undefined') {
        normifyApi.setBaseUrl(apiBaseUrl);
        checkApiStatus();
    }
    
    // Инициализация обработчиков для загрузки файлов
    initializeFileUpload();
});

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

/**
 * Настраивает эффект свечения для элементов
 * @returns {void}
 */
function setupGlowEffect() {
    const glowElements = document.querySelectorAll('.glow-on-hover');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 15px rgba(110, 142, 251, 0.3)';
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = '';
        });
    });
}

// Функция для кнопки "Наверх"
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка "Наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Функция для отображения/скрытия кнопки при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Обработчик нажатия на кнопку
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Анимация плавающих элементов (создание дополнительных элементов)
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = Math.random() * 20 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = Math.random() * 10 + 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Эффект печатной машинки для заголовков
    const typewriterElements = document.querySelectorAll('.typewriter h1');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    });
});
// Функция для кнопки "Наверх"
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка "Наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Функция для отображения/скрытия кнопки при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Обработчик нажатия на кнопку
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Создание дополнительных плавающих элементов (пузырьков)
    const floatingElementsContainer = document.querySelector('.floating-elements');
    if (floatingElementsContainer) {
        // Добавляем еще 6 плавающих элементов, всего будет 10
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Случайный размер от 50px до 250px
            const size = Math.floor(Math.random() * 200) + 50;
            element.style.width = size + 'px';
            element.style.height = size + 'px';
            
            // Случайное положение
            element.style.top = Math.floor(Math.random() * 100) + '%';
            element.style.left = Math.floor(Math.random() * 100) + '%';
            
            // Случайная длительность анимации
            element.style.animationDuration = (Math.floor(Math.random() * 15) + 15) + 's';
            
            // Случайная задержка анимации
            element.style.animationDelay = Math.floor(Math.random() * 5) + 's';
            
            // Случайная прозрачность
            element.style.opacity = (Math.random() * 0.5 + 0.1).toFixed(2);
            
            floatingElementsContainer.appendChild(element);
        }
    }
    
    // Анимация частиц на фоне
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        // Создаем много маленьких частиц (30 штук)
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Маленький размер от 5px до 20px
            const size = Math.random() * 15 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Случайное положение
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Продолжительность и задержка анимации
            particle.style.animationDuration = Math.random() * 10 + 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            // Случайная прозрачность
            particle.style.opacity = (Math.random() * 0.3 + 0.1).toFixed(2);
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Эффект печатной машинки для заголовков
    const typewriterElements = document.querySelectorAll('.typewriter h1');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    });
});
/**
 * Создает плавающие элементы (пузырьки) в фоне
 * @param {number} count - Количество элементов для создания
 * @returns {void}
 */
function createFloatingElements(count = 15) {
    const container = document.querySelector('.floating-elements');
    
    // Очищаем существующие элементы
    container.innerHTML = '';
    
    // Создаем новые элементы
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Случайный размер от 80 до 400px
        const size = Math.floor(Math.random() * 320) + 80;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Случайная позиция
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        
        // Случайная длительность анимации от 15 до 35 секунд
        element.style.animationDuration = `${Math.random() * 20 + 15}s`;
        
        // Случайная задержка анимации
        element.style.animationDelay = `${Math.random() * 10}s`;
        
        // Случайная прозрачность от 0.05 до 0.15
        element.style.opacity = (Math.random() * 0.1 + 0.05).toFixed(2);
        
        container.appendChild(element);
    }
}

// Запускаем создание плавающих элементов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Создаем 15 плавающих элементов (как в отчете)
    createFloatingElements(15);
    
    // Остальной код...
});
/**
 * Создает частицы для фонового эффекта
 * @param {number} count - Количество частиц для создания
 * @returns {void}
 */
function createParticles(count = 20) {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    // Очищаем существующие частицы
    container.innerHTML = '';
    
    // Создаем новые частицы
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайный размер от 5 до 25px
        const size = Math.floor(Math.random() * 20) + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Случайная позиция
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Случайная длительность анимации от 10 до 20 секунд
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        // Случайная задержка анимации
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Случайная прозрачность от 0.3 до 0.7
        particle.style.opacity = (Math.random() * 0.4 + 0.3).toFixed(2);
        
        container.appendChild(particle);
    }
}

// Добавляем вызов функции при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Создаем плавающие элементы
    createFloatingElements(15);
    
    // Создаем частицы
    createParticles(20);
    
    // Остальной код...
});

/**
 * Создает плавающие элементы (пузырьки) с четким видом как в отчете
 * @param {number} count - Количество элементов для создания
 * @returns {void}
 */
function createClearFloatingElements(count = 15) {
    const container = document.querySelector('.floating-elements');
    
    // Очищаем существующие элементы
    container.innerHTML = '';
    
    // Создаем новые элементы
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Случайный размер от 80 до 350px для большего разнообразия
        const size = Math.floor(Math.random() * 270) + 80;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Случайная позиция
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        
        // Случайная длительность анимации от 15 до 35 секунд
        element.style.animationDuration = `${Math.random() * 20 + 15}s`;
        
        // Случайная задержка анимации
        element.style.animationDelay = `${Math.random() * 10}s`;
        
        // Низкая прозрачность как в отчете - от 0.05 до 0.15
        element.style.opacity = (Math.random() * 0.1 + 0.05).toFixed(2);
        
        // Добавить к градиенту небольшой поворот
        const angle = Math.floor(Math.random() * 90) + 90; // от 90 до 180 градусов
        element.style.background = `linear-gradient(${angle}deg, rgba(110, 142, 251, 0.1), rgba(167, 119, 227, 0.1))`;
        
        container.appendChild(element);
    }
}



function initializeFloatingElements() {
    const floatingElements = document.querySelector('.floating-elements');
    
    if (floatingElements) {
        // Добавление эффекта параллакса при движении мыши
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const elements = floatingElements.querySelectorAll('.floating-element');
            
            elements.forEach((element, index) => {
                const depth = (index + 1) * 0.05;
                const moveX = mouseX * depth * 100;
                const moveY = mouseY * depth * 100;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.05}deg)`;
            });
        });
    }
}

/**
 * Проверка состояния API
 * @returns {Promise<void>}
 */
async function checkApiStatus() {
    try {
        const status = await normifyApi.healthCheck();
        console.log('API status:', status);
    } catch (error) {
        console.error('API недоступен:', error);
        // Здесь можно показать пользователю уведомление о проблемах с API
    }
}

/**
 * Инициализация обработчиков для загрузки файлов
 * @returns {void}
 */
function initializeFileUpload() {
    // Элементы формы загрузки файла
    const fileInput = document.getElementById('file-input');
    const fileSelectButton = document.getElementById('file-select-button');
    const uploadButton = document.getElementById('upload-button');
    const selectedFileDiv = document.getElementById('selected-file');
    const fileNameSpan = document.getElementById('file-name');
    const processingDiv = document.getElementById('processing');
    const validationResultsDiv = document.getElementById('validation-results');
    const resultsContentDiv = document.getElementById('results-content');
    const dropArea = document.getElementById('drop-area');
    
    // Если элементы не найдены, значит мы не на странице загрузки
    if (!fileInput || !dropArea) return;
    
    // Обработчики событий для выбора файла
    if (fileSelectButton) {
        fileSelectButton.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            handleFileSelection(fileInput.files[0]);
        });
    }
    
    // Обработчик Drag & Drop
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('highlight');
        }
        
        function unhighlight() {
            dropArea.classList.remove('highlight');
        }
        
        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            handleFileSelection(file);
        });
    }
    
    // Обработчик загрузки файла
    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            if (fileInput.files.length > 0) {
                uploadDocument(fileInput.files[0]);
            }
        });
    }
    
    /**
     * Функция обработки выбора файла
     * @param {File} file - Выбранный файл
     * @returns {void}
     */
    function handleFileSelection(file) {
        if (!file) return;
        
        // Проверяем тип файла
        if (!file.name.endsWith('.docx')) {
            showError('Поддерживаются только файлы формата .docx');
            return;
        }
        
        fileNameSpan.textContent = file.name;
        selectedFileDiv.style.display = 'block';
    }
    
    /**
     * Функция загрузки документа
     * @param {File} file - Файл для загрузки
     * @returns {Promise<void>}
     */
    async function uploadDocument(file) {
        // Показываем анимацию загрузки
        selectedFileDiv.style.display = 'none';
        processingDiv.style.display = 'flex';
        validationResultsDiv.style.display = 'none';
        
        try {
            // Отправляем файл на проверку
            const results = await normifyApi.validateDocumentAnonymous(file);
            
            // Показываем результаты
            displayValidationResults(results);
        } catch (error) {
            if (error.limitExceeded) {
                // Если превышен лимит запросов
                showLimitExceededMessage();
            } else {
                showError(error.message || 'Ошибка при проверке документа');
            }
            
            processingDiv.style.display = 'none';
            selectedFileDiv.style.display = 'block';
        }
    }
    
    /**
     * Функция отображения результатов проверки
     * @param {Object} results - Результаты проверки
     * @returns {void}
     */
    function displayValidationResults(results) {
        processingDiv.style.display = 'none';
        validationResultsDiv.style.display = 'block';
        
        const summary = results.summary;
        
        // Формируем HTML с результатами
        let html = `
            <div class="validation-summary">
                <h3>Сводка проверки</h3>
                <p>Соответствие стандартам: <strong>${summary.compliance_percentage}%</strong></p>
                <p>Всего правил: ${summary.total_rules}</p>
                <p>Пройдено успешно: ${summary.passed_rules}</p>
                <p>Нарушений: ${summary.failed_rules}</p>
            </div>
        `;
        
        // Если есть нарушения, показываем их
        if (results.items && results.items.length > 0) {
            html += `<div class="violations-list">
                <h3>Обнаруженные нарушения</h3>
                <ul>`;
            
            results.items.forEach(item => {
                const severityClass = getSeverityClass(item.severity);
                html += `<li class="${severityClass}">
                    <h4>${item.rule_name}</h4>
                    <p>${item.description}</p>
                    ${item.location ? `<p class="violation-location">Расположение: ${item.location}</p>` : ''}
                </li>`;
            });
            
            html += `</ul></div>`;
        } else {
            html += `<div class="no-violations">
                <h3>Нарушений не обнаружено</h3>
                <p>Документ соответствует проверенным стандартам ГОСТ.</p>
            </div>`;
        }
        
        // Если есть ссылка на отчет, добавляем кнопку
        if (results.report_url) {
            html += `<div class="report-link">
                <a href="${results.report_url}" target="_blank" class="glow-button">Открыть полный отчет</a>
            </div>`;
        }
        
        // Кнопка для новой проверки
        html += `<div class="new-check">
            <button class="glow-button" id="new-check-button">Проверить другой документ</button>
        </div>`;
        
        resultsContentDiv.innerHTML = html;
        
        // Обработчик для кнопки новой проверки
        document.getElementById('new-check-button').addEventListener('click', () => {
            // Сбрасываем форму
            fileInput.value = '';
            selectedFileDiv.style.display = 'none';
            validationResultsDiv.style.display = 'none';
            fileNameSpan.textContent = '';
        });
    }
    
    /**
     * Получение класса CSS в зависимости от серьезности нарушения
     * @param {string} severity - Уровень серьезности
     * @returns {string} - CSS класс
     */
    function getSeverityClass(severity) {
        switch (severity.toLowerCase()) {
            case 'error': return 'severity-error';
            case 'warning': return 'severity-warning';
            case 'info': return 'severity-info';
            default: return '';
        }
    }
    
    /**
     * Показать сообщение об ошибке
     * @param {string} message - Текст сообщения
     * @returns {void}
     */
    function showError(message) {
        alert(message);
    }
    
    /**
     * Показать сообщение о превышении лимита запросов
     * @returns {void}
     */
    function showLimitExceededMessage() {
        const html = `
            <div class="limit-exceeded">
                <h3>Превышен лимит запросов</h3>
                <p>Вы достигли лимита бесплатных проверок с вашего IP-адреса.</p>
                <p>Для продолжения работы вы можете:</p>
                <ul>
                    <li>Подождать до завтра для сброса счетчика</li>
                    <li>Зарегистрироваться для получения дополнительных проверок</li>
                </ul>
                <div class="register-prompt">
                    <p>Хотите больше проверок?</p>
                    <a href="auth.html" class="glow-button">Зарегистрироваться</a>
                </div>
            </div>
        `;
        
        validationResultsDiv.style.display = 'block';
        resultsContentDiv.innerHTML = html;
    }
}
// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});