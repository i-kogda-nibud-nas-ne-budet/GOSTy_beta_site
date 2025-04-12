
/**
 * check.js - Скрипт для страницы проверки документов GOSTY
 * Python 3.13 типизация учтена в комментариях для будущей интеграции с Python
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация скриптов...');
    
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

    // Настройка блока ошибки
    setupErrorHandling();
    
    console.log('Инициализация скриптов завершена');
});

/**
 * Настраивает выбор категории пользователя
 * @returns {void}
 */
function setupCategorySelection() {
    const categoryButtons = document.querySelectorAll('.select-category');
    const permissionBlock = document.getElementById('permission-block');
    const uploadBlock = document.getElementById('upload-block');
    
    if (!categoryButtons.length || !permissionBlock || !uploadBlock) {
        console.warn('Элементы выбора категории не найдены');
        return;
    }
    
    console.log('Настройка выбора категории пользователя...');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log(`Выбрана категория: ${category}`);
            
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
    console.log('Настройка области загрузки файлов...');
    
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectedFile = document.getElementById('selected-file');
    const fileName = document.getElementById('file-name');
    
    // Выводим информацию об элементах для отладки
    console.log('Элементы для загрузки файлов:');
    console.log('- dropZone:', dropZone);
    console.log('- fileInput:', fileInput);
    console.log('- selectedFile:', selectedFile);
    console.log('- fileName:', fileName);
    
    if (!dropZone || !fileInput) {
        console.error('ОШИБКА: Не удалось найти основные элементы для загрузки файла');
        return;
    }
    
    // Клик по зоне загрузки открывает диалог выбора файла
    dropZone.addEventListener('click', function() {
        console.log('Клик по зоне загрузки, открываем диалог выбора файла');
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
            console.log(`Событие ${eventName}: добавляем подсветку`);
            dropZone.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            console.log(`Событие ${eventName}: убираем подсветку`);
            dropZone.classList.remove('highlight');
        }, false);
    });
    
    // Обработка брошенного файла
    dropZone.addEventListener('drop', function(e) {
        console.log('Файл перетащен в зону загрузки');
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            console.log(`Получен файл через drag&drop: ${files[0].name}`);
            handleFile(files[0]);
        }
    }, false);
    
    // Обработка выбранного файла через диалог
    fileInput.addEventListener('change', function(e) {
        console.log('Событие выбора файла через input');
        if (this.files && this.files.length) {
            console.log(`Выбран файл через диалог: ${this.files[0].name}`);
            handleFile(this.files[0]);
        } else {
            console.warn('Файл не выбран или событие сработало некорректно');
        }
    });
    
    /**
     * Обрабатывает загруженный файл
     * @param {File} file - Загруженный файл
     * @returns {void}
     */
    function handleFile(file) {
        console.log(`Обработка файла: ${file.name}, размер: ${file.size} байт, тип: ${file.type}`);
        
        // Проверка типа файла (только DOCX)
        if (!file.name.endsWith('.docx')) {
            console.warn('Файл не в формате DOCX');
            showNotification('Ошибка', 'Пожалуйста, загрузите файл в формате DOCX.', 'error');
            return;
        }
        
        // Проверка размера файла (максимум 10МБ)
        if (file.size > 10 * 1024 * 1024) {
            console.warn('Файл слишком большой');
            showNotification('Ошибка', 'Размер файла превышает 10МБ. Пожалуйста, загрузите файл меньшего размера.', 'error');
            return;
        }
        
        // Отображение информации о файле
        if (selectedFile && fileName) {
            fileName.textContent = file.name;
            selectedFile.style.display = 'block';
            console.log('Информация о файле отображена');
        } else {
            console.warn('Не удалось отобразить информацию о файле (элементы не найдены)');
        }
        
        // Сохранение ссылки на файл в глобальной переменной
        window.uploadedFile = file;
        console.log('Файл сохранен в window.uploadedFile');
    }
}

/**
 * Настраивает отправку файла
 * @returns {void}
 */
function setupFileSubmission() {
    console.log('Настройка отправки файла...');
    
    const submitButton = document.getElementById('submit-file');
    const uploadBlock = document.getElementById('upload-block');
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    
    // Выводим информацию об элементах для отладки
    console.log('Элементы для отправки файла:');
    console.log('- submitButton:', submitButton);
    console.log('- uploadBlock:', uploadBlock);
    console.log('- processingBlock:', processingBlock);
    console.log('- errorBlock:', errorBlock);
    
    if (!submitButton) {
        console.error('ОШИБКА: Не найдена кнопка отправки файла');
        return;
    }
    
    submitButton.addEventListener('click', function() {
        console.log('Нажата кнопка отправки файла');
        
        if (!window.uploadedFile) {
            console.warn('Не выбран файл для отправки');
            showNotification('Ошибка', 'Пожалуйста, сначала выберите файл.', 'error');
            return;
        }
        
        console.log(`Подготовка к отправке файла: ${window.uploadedFile.name}`);
        
        // Скрыть блок загрузки и показать блок обработки
        if (uploadBlock) uploadBlock.style.display = 'none';
        if (processingBlock) processingBlock.style.display = 'block';
        if (errorBlock) errorBlock.style.display = 'none';
        
        // Отправка файла на сервер
        sendFileToServer(window.uploadedFile);
    });
}

/**
 * Отправляет файл на сервер для проверки
 * @param {File} file - Файл для отправки
 * @returns {void}
 */
function sendFileToServer(file) {
    console.log(`Отправка файла на сервер: ${file.name}`);
    
    // Создание FormData для отправки файла
    const formData = new FormData();
    formData.append('file', file);
    
    // API endpoint для валидации
    const apiUrl = 'http://127.0.0.1:8000/api/documents/validate-anonymous';
    console.log(`URL API: ${apiUrl}`);
    
    // Отправка файла на сервер
    console.log('Выполнение fetch запроса...');
    fetch(apiUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log(`Получен ответ от сервера, статус: ${response.status}`);
        console.log('Заголовки ответа:', response.headers);
        
        if (!response.ok) {
            throw new Error('Ошибка сервера: ' + response.status);
        }
        
        // Проверяем тип ответа
        const contentType = response.headers.get('content-type');
        console.log(`Тип содержимого ответа: ${contentType}`);
        
        // Если сервер возвращает файл (не JSON)
        if (contentType && (
            contentType.includes('application/octet-stream') || 
            contentType.includes('application/pdf') || 
            contentType.includes('application/vnd.openxmlformats') ||
            contentType.includes('application/msword')
        )) {
            console.log('Сервер вернул файл, обрабатываем как бинарные данные');
            // Обрабатываем файл
            return response.blob().then(blob => {
                return { isFile: true, blob: blob, contentType: contentType };
            });
        } else {
            console.log('Сервер вернул JSON, парсим ответ');
            // Обрабатываем JSON-ответ
            return response.json().then(data => {
                return { isFile: false, data: data };
            }).catch(error => {
                console.error('Ошибка при парсинге JSON:', error);
                // Попробуем получить текст ответа
                return response.text().then(text => {
                    console.log('Содержимое ответа:', text);
                    throw new Error('Неверный формат JSON в ответе сервера');
                });
            });
        }
    })
    .then(result => {
        console.log('Успешный ответ:', result);
        
        // Скрываем блок обработки
        const processingBlock = document.getElementById('processing-block');
        if (processingBlock) {
            processingBlock.style.display = 'none';
        }
        
        if (result.isFile) {
            // Если сервер вернул файл - скачиваем его
            console.log('Скачивание файла...');
            downloadFile(result.blob, getFileName(file.name, result.contentType));
            showNotification('Успех', 'Файл успешно проверен и скачан.', 'success');
            
            // Показываем блок загрузки для новой проверки
            const uploadBlock = document.getElementById('upload-block');
            if (uploadBlock) {
                uploadBlock.style.display = 'block';
            }
            
            // Сбрасываем загруженный файл
            resetUploadedFile();
        } else {
            const data = result.data;
            console.log('Обработка JSON-ответа:', data);
            
            // Если в ответе есть fileUrl, открываем файл
            if (data.fileUrl) {
                console.log(`Открытие файла по URL: ${data.fileUrl}`);
                window.open(data.fileUrl, '_blank');
                showNotification('Успех', 'Файл успешно проверен и открыт.', 'success');
                resetUploadToStart();
            }
            // Если в ответе есть fileData (base64), скачиваем файл
            else if (data.fileData) {
                console.log('Скачивание файла из base64 данных');
                downloadFileFromData(
                    data.fileData, 
                    data.fileName || 'downloaded_file', 
                    data.fileType || 'application/octet-stream'
                );
                showNotification('Успех', 'Файл успешно проверен и скачан.', 'success');
                resetUploadToStart();
            }
            // Если есть reportId, переходим на страницу отчета
            else if (data.reportId) {
                console.log(`Переход на страницу отчета: report.html?id=${data.reportId}`);
                window.location.href = `report.html?id=${data.reportId}`;
            } 
            // Если есть result, но нет fileUrl/fileData/reportId
            else if (data.result) {
                console.log('Сохранение результата и переход на страницу примера отчета');
                localStorage.setItem('validationResult', JSON.stringify(data));
                window.location.href = 'report-example.html';
            } 
            // Если нет ни одного из ожидаемых полей
            else {
                console.log('В ответе нет ожидаемых полей');
                showNotification('Информация', 'Файл успешно проверен, но сервер не вернул данные для отображения.', 'info');
                resetUploadToStart();
            }
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке файла:', error);
        showError(error.message);
    });
}

/**
 * Получает имя для скачиваемого файла на основе исходного имени и типа содержимого
 * @param {String} originalName - Исходное имя файла
 * @param {String} contentType - Тип содержимого (MIME)
 * @returns {String} - Имя файла с расширением
 */
function getFileName(originalName, contentType) {
    // Получаем имя файла без расширения
    const baseName = originalName.replace(/\.[^/.]+$/, '') + '_processed';
    
    // Определяем расширение по типу содержимого
    let extension = '.file';
    if (contentType.includes('pdf')) {
        extension = '.pdf';
    } else if (contentType.includes('openxmlformats')) {
        extension = '.docx';
    } else if (contentType.includes('msword')) {
        extension = '.doc';
    }
    
    return baseName + extension;
}

/**
 * Скачивает файл
 * @param {Blob} blob - Содержимое файла
 * @param {String} fileName - Имя файла для скачивания
 */
function downloadFile(blob, fileName) {
    console.log(`Скачивание файла: ${fileName}, размер: ${blob.size} байт`);
    
    try {
        // Создаем URL для скачивания
        const url = window.URL.createObjectURL(blob);
        
        // Создаем элемент для скачивания
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        
        // Добавляем элемент на страницу, эмулируем клик и удаляем
        document.body.appendChild(a);
        console.log('Эмуляция клика для скачивания');
        a.click();
        
        // Очищаем ресурсы
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            console.log('Ресурсы скачивания очищены');
        }, 100);
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        showNotification('Ошибка', 'Не удалось скачать файл: ' + error.message, 'error');
    }
}

/**
 * Скачивает файл из данных (например, base64)
 * @param {String} data - Данные файла (обычно в формате base64)
 * @param {String} fileName - Имя файла
 * @param {String} fileType - MIME-тип файла
 */
function downloadFileFromData(data, fileName, fileType) {
    console.log(`Скачивание файла из данных: ${fileName}, тип: ${fileType}`);
    
    try {
        let blob;
        
        // Если данные в формате base64
        if (typeof data === 'string' && (data.includes('base64') || /^[A-Za-z0-9+/=]+$/.test(data))) {
            console.log('Обработка данных в формате base64');
            
            // Убираем префикс data:application/pdf;base64, если он есть
            let base64Content = data;
            if (data.includes(',')) {
                base64Content = data.split(',')[1];
                console.log('Удален префикс из base64');
            }
            
            try {
                const byteCharacters = atob(base64Content);
                const byteArrays = [];
                
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                
                blob = new Blob(byteArrays, { type: fileType });
                console.log(`Создан Blob из base64, размер: ${blob.size} байт`);
            } catch (e) {
                console.error('Ошибка при декодировании base64:', e);
                throw new Error('Неверный формат base64');
            }
        } else {
            console.error('Неподдерживаемый формат данных файла');
            throw new Error('Неподдерживаемый формат данных файла');
        }
        
        // Скачиваем blob как файл
        downloadFile(blob, fileName);
    } catch (error) {
        console.error('Ошибка при обработке данных файла:', error);
        showNotification('Ошибка', 'Не удалось обработать данные файла: ' + error.message, 'error');
    }
}

/**
 * Сбрасывает состояние загрузки файла
 */
function resetUploadedFile() {
    console.log('Сброс информации о загруженном файле');
    window.uploadedFile = null;
    const selectedFile = document.getElementById('selected-file');
    if (selectedFile) {
        selectedFile.style.display = 'none';
    }
    
    // Очищаем input файла, если он существует
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        try {
            fileInput.value = '';
            console.log('Input файла очищен');
        } catch (e) {
            console.warn('Не удалось очистить input файла:', e);
        }
    }
}

/**
 * Сбрасывает интерфейс в начальное состояние
 */
function resetUploadToStart() {
    console.log('Сброс интерфейса в начальное состояние');
    const uploadBlock = document.getElementById('upload-block');
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    
    if (uploadBlock) uploadBlock.style.display = 'block';
    if (processingBlock) processingBlock.style.display = 'none';
    if (errorBlock) errorBlock.style.display = 'none';
    
    resetUploadedFile();
}

/**
 * Показывает блок с ошибкой и скрывает блок обработки
 * @param {String} errorMessage - Сообщение об ошибке
 */
function showError(errorMessage) {
    console.error(`Отображение ошибки: ${errorMessage}`);
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    const errorText = document.getElementById('error-message');
    
    if (processingBlock) processingBlock.style.display = 'none';
    
    if (errorBlock) {
        errorBlock.style.display = 'block';
        if (errorText) {
            errorText.textContent = errorMessage || 'Произошла ошибка при обработке файла.';
        }
    } else {
        // Если блок ошибки не найден, используем уведомление
        showNotification('Ошибка', errorMessage || 'Произошла ошибка при обработке файла.', 'error');
        resetUploadToStart();
    }
}

/**
 * Настраивает обработку ошибок на странице
 */
function setupErrorHandling() {
    console.log('Настройка обработки ошибок');
    const tryAgainButton = document.getElementById('try-again-btn');
    
    if (!tryAgainButton) {
        console.warn('Кнопка "Попробовать снова" не найдена');
        return;
    }
    
    tryAgainButton.addEventListener('click', function() {
        console.log('Нажата кнопка "Попробовать снова"');
        resetUploadToStart();
    });
}

/**
 * Создает и добавляет плавающие элементы (пузырьки) на страницу
 * @returns {void}
 */
function addFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    if (!container) {
        console.warn('Не удалось найти контейнер для плавающих элементов');
        return;
    }
    
    console.log('Добавление плавающих элементов');
    
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
        console.warn('Не удалось найти кнопку "Наверх"');
        return;
    }
    
    console.log('Настройка кнопки "Наверх"');
    
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
    console.log(`Уведомление [${type}]: ${title} - ${message}`);
    
    // Проверка наличия внешней функции уведомлений
    if (typeof window.showNotification === 'function') {
        window.showNotification(title, message, type);
    } else {
        // Если внешней функции нет, используем alert
        alert(`${title}: ${message}`);
    }
}
