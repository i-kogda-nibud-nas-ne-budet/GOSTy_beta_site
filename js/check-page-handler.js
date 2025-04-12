/**
 * check-page-handler.js - Обработчик для страницы проверки документов
 * Отвечает за загрузку, валидацию и отправку файлов на проверку
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация check-page-handler.js');
    
    // Инициализация плавающих элементов
    addFloatingElements();
    
    // Кнопка "Наверх"
    setupBackToTopButton();
    
    // Настройка выбора категории пользователя (если есть)
    if (document.querySelector('.select-category')) {
        setupCategorySelection();
    }
    
    // Настройка области загрузки файлов
    setupFileUpload();
    
    // Обработка отправки файла
    setupFileSubmission();
    
    // Настройка блока ошибки
    setupErrorHandling();
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
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectedFile = document.getElementById('selected-file');
    const fileName = document.getElementById('file-name');
    
    console.log('Настройка области загрузки файлов с drag-and-drop');
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
        console.log('Клик по зоне загрузки, открываем д��алог выбора файла');
        fileInput.click();
    });
    
    // Обработка перетаскивания файлов
    dropZone.addEventListener('dragenter', handleDragEnter, false);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleDrop, false);
    
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
    
    // Предотвращает стандартное поведение браузера при перетаскивании
    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Событие dragenter: добавляем подсветку');
        dropZone.classList.add('highlight');
    }
    
    // Предотвращает стандартное поведение браузера при перетаскивании
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        // Важно! Нужно установить dropEffect
        e.dataTransfer.dropEffect = 'copy';
        console.log('Событие dragover: поддерживаем подсветку');
        dropZone.classList.add('highlight');
        return false;
    }
    
    // Убирает подсветку при выходе из зоны
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Событие dragleave: убираем подсветку');
        dropZone.classList.remove('highlight');
    }
    
    // Обрабатывает событие сброса файла
    function handleDrop(e) {
        console.log('Событие drop: файл перетащен в зону загрузки');
        e.preventDefault();
        e.stopPropagation();
        
        dropZone.classList.remove('highlight');
        
        const dt = e.dataTransfer;
        if (!dt || !dt.files || !dt.files.length) {
            console.warn('Нет перетаскиваемых файлов в событии drop');
            return;
        }
        
        const file = dt.files[0];
        console.log(`Получен файл через drag&drop: ${file.name}`);
        
        // Обрабатываем полученный файл
        handleFile(file);
        
        return false;
    }
    
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
        console.log('Нажата кнопка отправк�� файла');
        
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
    
    // Получаем ссылки на блоки UI для управления интерфейсом
    const uploadBlock = document.getElementById('upload-block');
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    
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
            console.log('Сервер вернул JSON или текст, парсим ответ');
            // Обрабатываем JSON-ответ или текст
            return response.text().then(text => {
                console.log('Полученный текст ответа:', text.substring(0, 200) + '...');
                try {
                    // Пробуем парсить как JSON
                    const jsonData = JSON.parse(text);
                    console.log('Данные успешно распарсены как JSON:', jsonData);
                    return { isFile: false, data: jsonData };
                } catch (err) {
                    // Это не JSON, возвращаем как текст
                    console.warn('Не удалось распарсить ответ как JSON:', err);
                    return { isFile: false, text: text };
                }
            });
        }
    })
    .then(result => {
        console.log('Обработка результата:', result);
        
        // Скрываем блок обработки
        if (processingBlock) {
            processingBlock.style.display = 'none';
        }
        
        if (result.isFile) {
            // Если сервер вернул файл - скачиваем его
            console.log('Скачивание файла...');
            downloadFile(result.blob, getFileName(file.name, result.contentType));
            showNotification('Успех', 'Файл успешно проверен и скачан.', 'success');
            
            // Показываем блок загрузки для новой проверки
            if (uploadBlock) {
                uploadBlock.style.display = 'block';
            }
            
            // Сбрасываем загруженный файл
            resetUploadedFile();
        } else if (result.data) {
            const data = result.data;
            console.log('Обработка JSON-ответа:', data);
            
            // Если есть html-report, отображаем его
            if (data['html-report'] || data.html_report) {
                console.log('Получен HTML-отчет, отображаем его пользователю');
                
                // Получаем HTML-код отчета (учитываем возможные варианты именования)
                const htmlReport = data['html-report'] || data.html_report;
                
                // Отображаем HTML-отчет
                displayHtmlReport(htmlReport);
                
                showNotification('Успех', 'Документ проверен. Отчет открыт.', 'success');
                return; // Завершаем обработку, т.к. отчет уже отображен
            }
            // Если в ответе есть fileUrl, открываем файл
            else if (data.fileUrl) {
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
            // Если есть result, но нет других ожидаемых полей
            else if (data.result) {
                console.log('Сохранение результата и ��ереход на страницу примера отчета');
                localStorage.setItem('validationResult', JSON.stringify(data));
                window.location.href = 'report-example.html';
            }
            // Если есть summary (результаты проверки)
            else if (data.summary) {
                console.log('Получен результат проверки с summary:', data);
                localStorage.setItem('validationResult', JSON.stringify(data));
                showNotification('Успех', `Документ проверен. Соответствие: ${data.summary.compliance_percentage}%`, 'success');
                window.location.href = 'report-example.html';
            }
            // Если у нас есть какие-то данные, но неизвестной структуры
            else {
                console.log('Получен нестандартный ответ от сервера:', data);
                localStorage.setItem('validationResult', JSON.stringify(data));
                showNotification('Информация', 'Файл проверен, переход к результатам.', 'info');
                window.location.href = 'report-example.html';
            }
        } else if (result.text) {
            console.log('Получен текстовый ответ:', result.text.substring(0, 200) + '...');
            showNotification('Информация', 'Получен ответ от сервера, но формат ответа не распознан.', 'info');
            resetUploadToStart();
        } else {
            console.warn('Получен неизвестный формат результата');
            showNotification('Информация', 'Файл успешно проверен, но сервер не вернул данные для отображения.', 'info');
            resetUploadToStart();
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке файла:', error);
        showError(error.message);
    });
    
    /**
     * Сбрасывает интерфейс в начальное состояние
     */
    function resetUploadToStart() {
        console.log('Сброс интерфейса в начально�� состояние');
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
        if (processingBlock) processingBlock.style.display = 'none';
        
        if (errorBlock) {
            errorBlock.style.display = 'block';
            const errorText = document.getElementById('error-message');
            if (errorText) {
                errorText.textContent = errorMessage || 'Произошла ошибка при обработке файла.';
            }
        } else {
            // Если блок ошибки не найден, используем уведомление
            showNotification('Ошибка', errorMessage || 'Произошла ошибка при обработке файла.', 'error');
            resetUploadToStart();
        }
    }
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
 * @param {String} fileName - Имя фай��а для скачивания
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
 * Сбрасывает информацию о загруженном файле
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
 * Отображает HTML-отчет пользователю
 * @param {String} htmlContent - HTML-содержимое отчета
 */
function displayHtmlReport(htmlContent) {
    console.log('Отображение HTML-отчета');
    
    // Скрываем блоки обработки и загрузки
    const uploadBlock = document.getElementById('upload-block');
    const processingBlock = document.getElementById('processing-block');
    const errorBlock = document.getElementById('error-block');
    
    if (uploadBlock) uploadBlock.style.display = 'none';
    if (processingBlock) processingBlock.style.display = 'none';
    if (errorBlock) errorBlock.style.display = 'none';
    
    // Проверяем существование контейнера для отчета или создаем его
    let reportContainer = document.getElementById('report-container');
    
    if (!reportContainer) {
        console.log('Создание контейнера для отчета');
        reportContainer = document.createElement('div');
        reportContainer.id = 'report-container';
        reportContainer.className = 'report-container';
        
        // Стили для контейнера отчета
        reportContainer.style.backgroundColor = '#ffffff';
        reportContainer.style.padding = '20px';
        reportContainer.style.borderRadius = '8px';
        reportContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        reportContainer.style.margin = '20px 0';
        
        // Добавляем кнопку "Назад" для возврата к загрузке
        const backButton = document.createElement('button');
        backButton.textContent = 'Вернуться к загрузке';
        backButton.className = 'btn btn-primary mt-3 mb-3';
        backButton.onclick = function() {
            reportContainer.style.display = 'none';
            if (uploadBlock) uploadBlock.style.display = 'block';
            resetUploadedFile();
        };
        
        // Создаем контейнер для содержимого отчета
        const reportContent = document.createElement('div');
        reportContent.id = 'report-content';
        reportContent.className = 'report-content';
        
        // Добавляем элементы в контейнер
        reportContainer.appendChild(backButton);
        reportContainer.appendChild(reportContent);
        
        // Добавляем контейнер на страницу
        const mainContainer = document.querySelector('.container') || document.body;
        mainContainer.appendChild(reportContainer);
    } else {
        // Если контейнер уже существует, показываем его
        reportContainer.style.display = 'block';
    }
    
    // Получаем контейнер для содержимого отчета
    const reportContent = document.getElementById('report-content');
    if (!reportContent) {
        console.error('Не удалось найти контейнер для содержимого отчета');
        return;
    }
    
    // Устанавливаем HTML-содержимое отчета
    reportContent.innerHTML = htmlContent;
    
    // Прокручиваем страницу к началу отчета
    reportContainer.scrollIntoView({ behavior: 'smooth' });
    
    console.log('HTML-отчет успешно отображен');
}
/**
 * Настраивает обработку ошибок на странице
 * @returns {void}
 */
function setupErrorHandling() {
    console.log('Настройка обработки ошибок');
    const tryAgainButton = document.getElementById('try-again-btn');
    const uploadBlock = document.getElementById('upload-block');
    const errorBlock = document.getElementById('error-block');
    
    if (!tryAgainButton) {
        console.warn('Кнопка "Попробовать снова" не найдена');
        return;
    }
    
    tryAgainButton.addEventListener('click', function() {
        console.log('Нажата кнопка "Попробовать снова"');
        // Скрыть блок ошибки и показать блок загрузки
        if (errorBlock) errorBlock.style.display = 'none';
        if (uploadBlock) uploadBlock.style.display = 'block';
        
        // Сбросить загруженный файл
        resetUploadedFile();
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
        // Если внешней функции нет, создаем и показываем уведомление внутри страницы
        createInlineNotification(title, message, type);
    }
}

/**
 * Создает и показывает уведомление внутри страницы
 * @param {string} title - Заголовок уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error, warning, info)
 * @returns {void}
 */
function createInlineNotification(title, message, type = 'info') {
    // Создаем контейнер для уведомлений, если его нет
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.maxWidth = '350px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.backgroundColor = getBackgroundColorByType(type);
    notification.style.color = '#fff';
    notification.style.padding = '15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Создаем заголовок
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.margin = '0 0 5px 0';
    
    // Создаем текст
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.margin = '0';
    
    // Добавляем кнопку закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.onclick = function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    };
    
    // Собираем уведомление
    notification.appendChild(titleElement);
    notification.appendChild(messageElement);
    notification.appendChild(closeButton);
    
    // Добавляем уведомление на страницу
    notificationContainer.appendChild(notification);
    
    // Анимируем появление
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(() => {
            if (notification.parentNode === notificationContainer) {
                notificationContainer.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    /**
     * Возвращает цвет фона в зависимости от типа уведомления
     * @param {string} type - Тип уведомления
     * @returns {string} - CSS-цвет
     */
    function getBackgroundColorByType(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            case 'info':
            default: return '#17a2b8';
        }
    }
}
