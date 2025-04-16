/**
 * Интерактивный скрипт для отчета о проверке документов
 * Добавляет анимации, интерактивность и визуальные эффекты
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initializeDocumentCards();
    initializeRuleItems();
    initializePassedRulesToggle();
    initializeBackToTop();
    //initializeFilters();
    //initializeSearchFunctionality();
    initializeParticlesBackground();
    initializeFloatingElements();
    initializeComplianceMeter();
    //initializeTooltips();
    initializeNotifications();
    removeUnwantedButtons();
    initializeFixedRulesProgress();
    expandAllPassedRulesContainers();
    initializeCopyButtons(); 
    // Показать приветственное уведомление
    showNotification('Отчет успешно загружен', 'success');
});

/**
 * Инициализация карточек документов
 */
function initializeDocumentCards() {
    const documentCards = document.querySelectorAll('.document-card');
    
    documentCards.forEach(card => {
        const header = card.querySelector('.document-header');
        const details = card.querySelector('.document-details');
        
        // Добавление обработчика клика для сворачивания/разворачивания деталей
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
            
            if (card.classList.contains('expanded')) {
                details.style.maxHeight = details.scrollHeight + 'px';
            } else {
                details.style.maxHeight = '0';
            }
        });
        
        // Инициализация кнопок действий
        const actionButtons = card.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                
                const action = button.getAttribute('data-action');
                if (action === 'expand-all') {
                    expandAllRules(card);
                } else if (action === 'collapse-all') {
                    collapseAllRules(card);
                } else if (action === 'download') {
                    downloadReport(card);
                }
            });
        });
    });
}

/**
 * Инициализация элементов правил
 */
function initializeRuleItems() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        const header = item.querySelector('.rule-header');
        
        if (header) {
            // Добавление обработчика клика для сворачивания/разворачивания деталей
            header.addEventListener('click', () => {
                if (item.id) {
                    toggleRule(item.id);
                }
            });
        }
    });
    
    console.log('Инициализация правил завершена');
}

/**
 * Инициализация переключателя для отображения пройденных правил
 */
function initializePassedRulesToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-passed-rules');
    
    toggleButtons.forEach(toggleButton => {
        const documentCard = toggleButton.closest('.document-card');
        if (!documentCard) return;
        
        const documentId = documentCard.id;
        const passedRulesList = document.getElementById('passed-' + documentId);
        
        if (!passedRulesList) return;
        
        // Автоматически раскрываем список пройденных правил при загрузке
        passedRulesList.classList.add('expanded');
        passedRulesList.style.maxHeight = 'none';
        passedRulesList.style.overflow = 'visible';
        
        // Обновляем текст и иконк�� заголовка
        const toggleIcon = toggleButton.querySelector('.toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = '▲';
        }
        
        // Добавляем обработчик клика для возможности свернуть/развернуть
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            
            passedRulesList.classList.toggle('expanded');
            
            if (passedRulesList.classList.contains('expanded')) {
                passedRulesList.style.maxHeight = 'none';
                passedRulesList.style.overflow = 'visible';
                if (toggleIcon) toggleIcon.textContent = '▲';
            } else {
                passedRulesList.style.maxHeight = '0';
                passedRulesList.style.overflow = 'hidden';
                if (toggleIcon) toggleIcon.textContent = '▼';
            }
        });
    });
    
    console.log('Инициализация переключателей пройденных правил завершена');
}

/**
 * Инициализация кнопки "Наверх"
 */
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Показать/скрыть кнопку при прокрутке
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Прокрутка наверх при клике
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Инициализация фильтров
 */
function initializeFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Переключение активного состояния
            tag.classList.toggle('active');
            
            // Применение фильтров
            applyFilters();
        });
    });
}

/**
 * Применение фильтров к правилам
 */
function applyFilters() {
    const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
        .map(tag => tag.getAttribute('data-filter'));
    
    const ruleItems = document.querySelectorAll('.rule-item');
    
    // Если нет активных фильтров, показать все
    if (activeFilters.length === 0) {
        ruleItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    // Применение фильтров
    ruleItems.forEach(item => {
        const ruleType = item.getAttribute('data-rule-type');
        const ruleGost = item.getAttribute('data-gost');
        
        // Проверка соответствия фильтрам
        const matchesFilter = activeFilters.some(filter => {
            return filter === ruleType || filter === ruleGost;
        });
        
        if (matchesFilter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Инициализация функциональности поиска
 */
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            // Поиск по правилам
            const ruleItems = document.querySelectorAll('.rule-item');
            
            ruleItems.forEach(item => {
                const ruleName = item.querySelector('.rule-name').textContent.toLowerCase();
                const ruleDescription = item.querySelector('.rule-description').textContent.toLowerCase();
                
                if (ruleName.includes(searchTerm) || ruleDescription.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Инициализация фоновых частиц
 */
function initializeParticlesBackground() {
    const particlesContainer = document.querySelector('.particles-container');
    
    if (particlesContainer) {
        // Создание частиц
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Случайные размеры и позиции
            const size = Math.random() * 20 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 60;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.animationDelay = delay + 's';
            
            // Случайный цвет
            const hue = Math.random() * 60 + 200; // Оттенки синего и фиолетового
            particle.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
            
            particlesContainer.appendChild(particle);
        }
    }
}

/**
 * Инициализация плавающих элементов
 */
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
 * Инициализация индикатора соответствия
 */
function initializeComplianceMeter() {
    const complianceValue = document.querySelector('.compliance-value');
    
    if (complianceValue) {
        const percentage = parseInt(complianceValue.textContent);
        
        // Установка ширины индикатора
        complianceValue.style.width = percentage + '%';
        
        // Установка цвета в зависимости от процента
        if (percentage >= 80) {
            complianceValue.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        } else if (percentage >= 50) {
            complianceValue.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        } else {
            complianceValue.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
        
        // Анимация заполнения
        setTimeout(() => {
            complianceValue.classList.add('animated');
        }, 500);
    }
}

/**
 * Инициализация всплывающих подсказок
 */
function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        // Создание элемента подсказки
        const tooltipText = document.createElement('span');
        tooltipText.classList.add('tooltip-text');
        tooltipText.textContent = tooltip.getAttribute('data-tooltip');
        
        tooltip.appendChild(tooltipText);
    });
}

/**
 * Инициализация системы уведомлений
 */
function initializeNotifications() {
    // Создание контейнера для уведомлений, если его нет
    if (!document.querySelector('.notifications-container')) {
        const container = document.createElement('div');
        container.classList.add('notifications-container');
        document.body.appendChild(container);
    }
}

/**
 * Показать уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error)
 */
function showNotification(message, type = 'success') {
    const container = document.querySelector('.notifications-container');
    
    // Создание уведомления
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    
    // Иконка
    const icon = document.createElement('span');
    icon.classList.add('notification-icon');
    icon.textContent = type === 'success' ? '✓' : '✗';
    
    // Текст
    const text = document.createElement('span');
    text.textContent = message;
    
    // Кнопка закрытия
    const closeButton = document.createElement('span');
    closeButton.classList.add('notification-close');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Сборка уведомления
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeButton);
    
    // Добавление в контейнер
    container.appendChild(notification);
    
    // Показать уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Развернуть все правила в карточке документа
 * @param {Element} card - Карточка документа
 */
function expandAllRules(card) {
    const ruleItems = card.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        item.classList.add('expanded');
        const details = item.querySelector('.rule-details');
        if (details) {
            details.style.display = 'block';
            details.style.maxHeight = 'none';
            details.style.overflow = 'visible';
            
            // Также разворачиваем вложенные списки
            const locationList = details.querySelector('.locations-list');
            if (locationList) {
                locationList.style.maxHeight = 'none';
                locationList.style.overflow = 'visible';
            }
        }
        
        // Обновляем иконку
        const toggleIcon = item.querySelector('.toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = '▲';
        }
    });
}

/**
 * Свернуть все правила в карточке документа
 * @param {Element} card - Карточка документа
 */
function collapseAllRules(card) {
    const ruleItems = card.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        item.classList.remove('expanded');
        const details = item.querySelector('.rule-details');
        details.style.maxHeight = '0';
    });
}

/**
 * Скачать отчет по документу
 * @param {Element} card - Карточка документа
 */
function downloadReport(card) {
    const fileName = card.getAttribute('data-file-name') || 'document_report.txt';
    const documentName = card.querySelector('.document-name').textContent;
    const failedRules = card.querySelectorAll('.rule-item.failed');
    const passedRules = card.querySelectorAll('.rule-item.passed');
    
    // Формирование текста отчета
    let reportText = `Отчет о проверке документа: ${documentName}\n`;
    reportText += `Дата проверки: ${new Date().toLocaleString()}\n\n`;
    
    reportText += `Всего правил проверено: ${failedRules.length + passedRules.length}\n`;
    reportText += `Пройдено правил: ${passedRules.length}\n`;
    reportText += `Не пройдено правил: ${failedRules.length}\n\n`;
    
    // Добавление информации о непройденных правилах
    if (failedRules.length > 0) {
        reportText += `НЕПРОЙДЕННЫЕ ПРАВИЛА:\n`;
        reportText += `===================\n\n`;
        
        failedRules.forEach((rule, index) => {
            const ruleName = rule.querySelector('.rule-name').textContent;
            const ruleDescription = rule.querySelector('.rule-description').textContent;
            const ruleDetails = rule.querySelector('.rule-details-content').textContent.trim();
            
            reportText += `${index + 1}. ${ruleName}\n`;
            reportText += `   Описание: ${ruleDescription}\n`;
            reportText += `   Детали: ${ruleDetails}\n\n`;
        });
    }
    
    // Добавление информации о пройденных правилах
    if (passedRules.length > 0) {
        reportText += `ПРОЙДЕННЫЕ ПРАВИЛА:\n`;
        reportText += `=================\n\n`;
        
        passedRules.forEach((rule, index) => {
            const ruleName = rule.querySelector('.rule-name').textContent;
            reportText += `${index + 1}. ${ruleName}\n`;
        });
    }
    
    // Создание и скачивание файла
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showNotification('Отчет успешно скачан', 'success');
}

/**
 * Обновление сводки исправлений
 */
function updateFixSummary() {
    const markedItems = document.querySelectorAll('.rule-item.marked-for-fix');
    const fixSummary = document.querySelector('.fix-summary');
    
    if (fixSummary) {
        if (markedItems.length > 0) {
            fixSummary.textContent = `Отмечено для исправления: ${markedItems.length}`;
            fixSummary.style.display = 'block';
        } else {
            fixSummary.style.display = 'none';
        }
    }
}

/**
 * Экспорт списка исправлений
 */
function exportFixList() {
    const markedItems = document.querySelectorAll('.rule-item.marked-for-fix');
    
    if (markedItems.length === 0) {
        showNotification('Нет отмеченных правил для исправления', 'error');
        return;
    }
    
    // Формирование текста списка исправлений
    let fixText = `Список правил для исправления\n`;
    fixText += `Дата: ${new Date().toLocaleString()}\n\n`;
    
    // Группировка по документам
    const documentMap = new Map();
    
    markedItems.forEach(item => {
        const documentCard = item.closest('.document-card');
        const documentName = documentCard.querySelector('.document-name').textContent;
        const ruleName = item.querySelector('.rule-name').textContent;
        const ruleDescription = item.querySelector('.rule-description').textContent;
        
        if (!documentMap.has(documentName)) {
            documentMap.set(documentName, []);
        }
        
        documentMap.get(documentName).push({
            name: ruleName,
            description: ruleDescription
        });
    });
    
    // Формирование текста по группам
    documentMap.forEach((rules, documentName) => {
        fixText += `Документ: ${documentName}\n`;
        fixText += `${'-'.repeat(documentName.length + 10)}\n\n`;
        
        rules.forEach((rule, index) => {
            fixText += `${index + 1}. ${rule.name}\n`;
            fixText += `   Описание: ${rule.description}\n\n`;
        });
        
        fixText += '\n';
    });
    
    // Создание и скачивание файла
    const blob = new Blob([fixText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fix_list.txt';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showNotification('Список исправлений успешно скачан', 'success');
}

/**
 * Печать отчета
 */
function printReport() {
    // Подготовка страницы для печати
    const originalTitle = document.title;
    document.title = 'Отчет о проверке документов - ' + new Date().toLocaleDateString();
    
    // Добавление класса для печати
    document.body.classList.add('printing');
    
    // Печать
    window.print();
    
    // Восстановление
    document.body.classList.remove('printing');
    document.title = originalTitle;
}

/**
 * Обновление статистики
 */
function updateStatistics() {
    const totalDocuments = document.querySelectorAll('.document-card').length;
    const totalRules = document.querySelectorAll('.rule-item').length;
    const failedRules = document.querySelectorAll('.rule-item.failed').length;
    const passedRules = totalRules - failedRules;
    
    // Обновление счетчиков
    const documentsCounter = document.querySelector('.stat-documents');
    const rulesCounter = document.querySelector('.stat-rules');
    const passedCounter = document.querySelector('.stat-passed');
    const failedCounter = document.querySelector('.stat-failed');
    
    if (documentsCounter) documentsCounter.textContent = totalDocuments;
    if (rulesCounter) rulesCounter.textContent = totalRules;
    if (passedCounter) passedCounter.textContent = passedRules;
    if (failedCounter) failedCounter.textContent = failedRules;
    
    // Обновление процента соответствия
    const compliancePercentage = Math.round((passedRules / totalRules) * 100) || 0;
    const complianceCounter = document.querySelector('.stat-compliance');
    const complianceValue = document.querySelector('.compliance-value');
    
    if (complianceCounter) complianceCounter.textContent = compliancePercentage + '%';
    
    if (complianceValue) {
        complianceValue.style.width = compliancePercentage + '%';
        
        // Обновление цвета
        if (compliancePercentage >= 80) {
            complianceValue.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        } else if (compliancePercentage >= 50) {
            complianceValue.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        } else {
            complianceValue.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
    }
}

/**
 * Инициализация графиков
 */
function initializeCharts() {
    const chartContainer = document.querySelector('.chart-container');
    
    if (chartContainer) {
        const totalRules = document.querySelectorAll('.rule-item').length;
        const failedRules = document.querySelectorAll('.rule-item.failed').length;
        const passedRules = totalRules - failedRules;
        
        // Процент успешных правил
        const successPercentage = Math.round((passedRules / totalRules) * 100) || 0;
        
        // Обновление переменных CSS для графика
        document.documentElement.style.setProperty('--success-percentage', successPercentage + '%');
        
        // Создание круговой диаграммы
        const pieChart = document.createElement('div');
        pieChart.classList.add('pie-chart');
        
        const pieChartLabel = document.createElement('div');
        pieChartLabel.classList.add('pie-chart-label');
        pieChartLabel.textContent = successPercentage + '%';
        
        chartContainer.appendChild(pieChart);
        pieChart.appendChild(pieChartLabel);
        
        // Добавление легенды
        const legend = document.createElement('div');
        legend.classList.add('chart-legend');
        legend.innerHTML = `
            <div class="legend-item">
                <span class="legend-color" style="background: var(--success-color)"></span>
                <span class="legend-text">Пройдено: ${passedRules} (${successPercentage}%)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: var(--accent-color)"></span>
                <span class="legend-text">Не пройдено: ${failedRules} (${100 - successPercentage}%)</span>
            </div>
        `;
        
        chartContainer.appendChild(legend);
    }
}

// Вызов функции обновления статистики при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateStatistics();
    initializeCharts();
    
    // Добавление обработчиков для кнопок экспорта и печати
    const exportButton = document.querySelector('.export-button');
    if (exportButton) {
        exportButton.addEventListener('click', exportFixList);
    }
    
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.addEventListener('click', printReport);
    }
});

// Переключение видимости документа
function toggleDocument(documentId) {
    console.log("toggleDocument вызвана для", documentId);
    
    const card = document.getElementById(documentId);
    if (!card) {
        console.error("Элемент с ID", documentId, "не найден");
        return;
    }
    
    const details = card.querySelector('.document-details');
    if (!details) {
        console.error("Элемент .document-details не найден внутри", documentId);
        return;
    }
    
    const toggleIcon = card.querySelector('.document-header .toggle-icon');
    
    // Переключаем класс expanded
    card.classList.toggle('expanded');
    
    if (card.classList.contains('expanded')) {
        // Показываем детали без ограничений высоты
        details.style.display = 'block';
        details.style.maxHeight = 'none';
        details.style.overflow = 'visible';
        
        // Обновляем иконку
        if (toggleIcon) toggleIcon.textContent = '▲';
        
        // Устанавливаем стили для всех вложенных элементов
        const rulesLists = card.querySelectorAll('.rules-list');
        rulesLists.forEach(list => {
            list.style.maxHeight = 'none';
            list.style.overflow = 'visible';
        });
        
        const ruleItems = card.querySelectorAll('.rule-item');
        ruleItems.forEach(item => {
            const ruleDetails = item.querySelector('.rule-details');
            if (ruleDetails) {
                ruleDetails.style.maxHeight = 'none';
                ruleDetails.style.overflow = 'visible';
            }
        });
        
        const locationLists = card.querySelectorAll('.locations-list');
        locationLists.forEach(list => {
            list.style.maxHeight = 'none';
            list.style.overflow = 'visible';
        });
    } else {
        // Сворачиваем детали
        details.style.maxHeight = '0';
        details.style.overflow = 'hidden';
        
        // Обновляем иконку
        if (toggleIcon) toggleIcon.textContent = '▼';
        
        // Задержка для анимации перед скрытием
        setTimeout(() => {
            if (!card.classList.contains('expanded')) {
                details.style.display = 'none';
            }
        }, 300);
    }
}
/**
 * Переключение видимости правила
 */
function toggleRule(ruleId) {
    console.log('toggleRule вызвана для ' + ruleId);
    const rule = document.getElementById(ruleId);
    if (!rule) {
        console.warn('Элемент с ID ' + ruleId + ' не найден');
        return;
    }
    
    const details = rule.querySelector('.rule-details');
    const toggleIcon = rule.querySelector('.rule-header .toggle-icon');
    
    // Переключаем класс expanded
    rule.classList.toggle('expanded');
    
    if (rule.classList.contains('expanded')) {
        // Показываем детали правила без ограничений высоты
        details.style.display = 'block';
        details.style.maxHeight = 'none';
        details.style.overflow = 'visible';
        
        // Устанавливаем стили для вложенных элементов
        const locationList = details.querySelector('.locations-list');
        if (locationList) {
            locationList.style.maxHeight = 'none';
            locationList.style.overflow = 'visible';
        }
        
        // Обновляем иконку
        if (toggleIcon) {
            toggleIcon.textContent = '▲';
        }
    } else {
        // Сворачиваем детали
        details.style.maxHeight = '0';
        details.style.overflow = 'hidden';
        
        // Обновляем иконку
        if (toggleIcon) {
            toggleIcon.textContent = '▼';
        }
        
        // Задержка для анимации
        setTimeout(() => {
            if (!rule.classList.contains('expanded')) {
                details.style.display = 'none';
            }
        }, 300);
    }
}

// Добавляем обработчики событий при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен, добавляем обработчики событий");
    
    // Добавляем обработчики для всех заголовков правил
    const ruleHeaders = document.querySelectorAll('.rule-header');
    ruleHeaders.forEach(header => {
        const ruleItem = header.closest('.rule-item');
        if (ruleItem && ruleItem.id) {
            header.addEventListener('click', function() {
                toggleRule(ruleItem.id);
            });
            console.log("Добавлен обработчик для", ruleItem.id);
        }
    });
    
    // Добавляем обработчики для всех заголовков документов
    const documentHeaders = document.querySelectorAll('.document-header');
    documentHeaders.forEach(header => {
        const documentCard = header.closest('.document-card');
        if (documentCard && documentCard.id) {
            header.addEventListener('click', function() {
                toggleDocument(documentCard.id);
            });
        }
    });
    
    // Инициализация других элементов управления
    initializeControls();
});

// Инициализация элементов управления
function initializeControls() {
    // Кнопки управления
    document.getElementById('expand-all')?.addEventListener('click', expandAllDocuments);
    document.getElementById('collapse-all')?.addEventListener('click', collapseAllDocuments);
    document.getElementById('show-only-errors')?.addEventListener('click', showOnlyDocumentsWithErrors);
    document.getElementById('show-all')?.addEventListener('click', showAllDocuments);
    
    // Кнопка печати
    document.querySelector('.print-button')?.addEventListener('click', function() {
        window.print();
    });
    
    // Кнопка экспорта
    document.querySelector('.export-button')?.addEventListener('click', exportFixList);
    
    // Кнопка "Наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Показываем кнопку при прокрутке
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
}

// Переключение видимости документа
function toggleDocument(documentId) {
    console.log("toggleDocument вызвана для", documentId); // Отладочный вывод
    
    const card = document.getElementById(documentId);
    if (!card) {
        console.error("Элемент с ID", documentId, "не найден");
        return;
    }
    
    const details = card.querySelector('.document-details');
    if (!details) {
        console.error("Элемент .document-details не найден внутри", documentId);
        return;
    }
    
    const toggleIcon = card.querySelector('.document-header .toggle-icon');
    
    // Переключаем класс expanded
    card.classList.toggle('expanded');
    
    if (card.classList.contains('expanded')) {
        // Показываем детали
        details.style.display = 'block';
        details.style.maxHeight = '2000px'; // Большое значение
        if (toggleIcon) toggleIcon.textContent = '▲';
    } else {
        details.style.maxHeight = '0';
        setTimeout(() => {
            if (!card.classList.contains('expanded')) {
                details.style.display = 'none';
            }
        }, 300); // Задержка для анимации
        if (toggleIcon) toggleIcon.textContent = '▼';
    }
}
/**
 * Переключение видимости пройденных правил
 * @param {string} documentId - ID документа
 */
function togglePassedRules(documentId) {
    const passedRulesList = document.getElementById('passed-' + documentId);
    const toggleButton = document.querySelector(`#${documentId} .toggle-passed-rules`);
    const toggleIcon = toggleButton?.querySelector('.toggle-icon');
    
    if (passedRulesList) {
        passedRulesList.classList.toggle('expanded');
        
        if (passedRulesList.classList.contains('expanded')) {
            passedRulesList.style.maxHeight = 'none';
            passedRulesList.style.overflow = 'visible';
            if (toggleIcon) toggleIcon.textContent = '▲';
        } else {
            passedRulesList.style.maxHeight = '0';
            passedRulesList.style.overflow = 'hidden';
            if (toggleIcon) toggleIcon.textContent = '▼';
        }
    }
}


// Обновление счетчика исправленных нарушений
function updateFixedCount() {
    const fixedRules = document.querySelectorAll('.rule-item.fixed').length;
    const fixedCountElement = document.getElementById('fixed-count');
    
    if (fixedCountElement) {
        fixedCountElement.textContent = fixedRules;
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const container = document.querySelector('.notifications-container');
    
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Обработчик для кнопки закрытия
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Инициализация при загрузке страницы
//document.addEventListener('DOMContentLoaded', function() {
//    // Инициализация кнопок управления
//    document.getElementById('expand-all')?.addEventListener('click', expandAllDocuments);
//    document.getElementById('collapse-all')?.addEventListener('click', collapseAllDocuments);
//    document.getElementById('show-only-errors')?.addEventListener('click', showOnlyDocumentsWithErrors);
//    document.getElementById('show-all')?.addEventListener('click', showAllDocuments);
//    
//    // Инициализация кнопки печати
//    document.querySelector('.print-button')?.addEventListener('click', printReport);
//    
//    // Инициализация кнопки экспорта
//    document.querySelector('.export-button')?.addEventListener('click', exportFixList);
//});

// Развернуть все документы
function expandAllDocuments() {
    const documents = document.querySelectorAll('.document-card');
    documents.forEach(doc => {
        if (!doc.classList.contains('expanded')) {
            toggleDocument(doc.id);
        }
    });
}

// Свернуть все документы
function collapseAllDocuments() {
    const documents = document.querySelectorAll('.document-card.expanded');
    documents.forEach(doc => {
        toggleDocument(doc.id);
    });
}

// Показать только документы с ошибками
function showOnlyDocumentsWithErrors() {
    const documents = document.querySelectorAll('.document-card');
    documents.forEach(doc => {
        if (doc.classList.contains('has-errors')) {
            doc.style.display = 'block';
        } else {
            doc.style.display = 'none';
        }
    });
}

// Показать все документы
function showAllDocuments() {
    const documents = document.querySelectorAll('.document-card');
    documents.forEach(doc => {
        doc.style.display = 'block';
    });
}

// Печать отчета
function printReport() {
    window.print();
}

// Экспорт списка исправлений
function exportFixList() {
    const fixedRules = document.querySelectorAll('.rule-item.fixed');
    
    if (fixedRules.length === 0) {
        showNotification('Нет отмеченных исправлений для экспорта', 'error');
        return;
    }
    
    let content = "# Список исправленных нарушений\n\n";
    content += `Дата: ${new Date().toLocaleDateString()}\n\n`;
    
    // Группировка по документам
    const documentMap = new Map();
    
    fixedRules.forEach(rule => {
        const documentCard = rule.closest('.document-card');
        const documentName = documentCard.querySelector('.document-name').textContent;
        const ruleName = rule.querySelector('.rule-name').textContent;
        const ruleDescription = rule.querySelector('.rule-description')?.textContent || '';
        
        if (!documentMap.has(documentName)) {
            documentMap.set(documentName, []);
        }
        
        documentMap.get(documentName).push({
            name: ruleName,
            description: ruleDescription
        });
    });
    
    // Формирование содержимого файла
    documentMap.forEach((rules, documentName) => {
        content += `## ${documentName}\n\n`;
        
        rules.forEach((rule, index) => {
            content += `${index + 1}. **${rule.name}**\n`;
            if (rule.description) {
                content += `   ${rule.description}\n`;
            }
            content += '\n';
        });
    });
    
    // Создание и скачивание файла
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fixed_rules.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Список исправлений успешно экспортирован', 'success');
}


/**
 * Удаление нежелательных кнопок и элементов
 */
function removeUnwantedButtons() {
    // По желанию, можно скрыть или удалить ненужные кнопки или элементы
    const unwantedButtons = document.querySelectorAll('.unwanted-button');
    unwantedButtons.forEach(button => {
        button.style.display = 'none';
    });
}

/**
 * Инициализация прогресса исправленных правил
 */
function initializeFixedRulesProgress() {
    // Находим все чекбоксы для исправления правил
    const fixCheckboxes = document.querySelectorAll('.fix-checkbox');
    
    // Устанавливаем обработчики событий для всех чекбоксов правил
    fixCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const ruleId = this.id.replace('fix-', '');
            markAsFixed(ruleId, this.checked);
        });
    });
    
    // Инициализация обработчиков для местоположений
    const locationCheckboxes = document.querySelectorAll('.location-fix-checkbox');
    
    locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const ruleId = this.getAttribute('data-rule-id');
            const locationIndex = this.getAttribute('data-location-index');
            markLocationAsFixed(ruleId, locationIndex, this.checked);
        });
    });
    
    // Обновляем индикатор прогресса
    updateFixedProgressBar();
    
    console.log('Инициализация прогресса исправленных правил завершена');
}

/**
 * Обновление индикатора прогресса исправленных правил
 */
function updateFixedProgressBar() {
    const totalFailedRules = document.querySelectorAll('.rule-item.failed').length;
    const fixedRules = document.querySelectorAll('.rule-item.fixed').length;
    
    // Если нет проваленных правил, выходим
    if (totalFailedRules === 0) return;
    
    // Вычисляем процент исправленных правил
    const fixedPercentage = Math.round((fixedRules / totalFailedRules) * 100);
    
    // Обновляем индикатор прогресса
    const fixedProgress = document.querySelector('.fixed-progress');
    if (fixedProgress) {
        fixedProgress.style.width = fixedPercentage + '%';
    }
    
    // Обновляем счетчик ис��равленных правил
    const fixedCountElement = document.getElementById('fixed-count');
    if (fixedCountElement) {
        fixedCountElement.textContent = fixedRules;
    }
    
    // Обновляем счетчик в фиксированной шапке
    const stickyFixedRules = document.getElementById('sticky-fixed-rules');
    if (stickyFixedRules) {
        stickyFixedRules.textContent = fixedRules;
    }
    
    console.log(`Обновлен прогресс исправленных правил: ${fixedRules}/${totalFailedRules} (${fixedPercentage}%)`);
}
/**
 * Загрузка сохраненных отметок исправлений
 */
function loadFixedLocations() {
    try {
        const fixedLocations = JSON.parse(localStorage.getItem('fixedLocations') || '{}');
        
        // Применяем сохраненные отметки
        for (const locationId in fixedLocations) {
            if (fixedLocations[locationId]) {
                const checkbox = document.getElementById(`fix-${locationId}`);
                if (checkbox) {
                    checkbox.checked = true;
                    
                    // Применяем стили к родительскому элементу
                    const locationItem = checkbox.closest('.location-item');
                    if (locationItem) {
                        locationItem.classList.add('fixed');
                    }
                }
            }
        }
        
        // Обновляем отметки правил, у которых все местоположения исправлены
        updateRuleFixedStatus();
    } catch (error) {
        console.error('Ошибка при загрузке исправленных местоположений:', error);
    }
}

/**
 * Синхронизирует состояние чекбоксов между правило-ориентированным и документо-ориентированным представлениями
 * @param {string} ruleId - ID правила
 * @param {number|string} locationIndex - Индекс локации
 * @param {boolean} isFixed - Состояние чекбокса (включен/выключен)
 */
function syncCheckboxes(ruleId, locationIndex, isFixed) {
    console.log(`Синхронизация чекбоксов для правила ${ruleId}, локации ${locationIndex}, состояние: ${isFixed}`);
    
    // Обновляем чекбокс локации в правило-ориентированном представлении
    const ruleLocationCheckbox = document.getElementById(`fix-location-${ruleId}-${locationIndex}`);
    if (ruleLocationCheckbox && ruleLocationCheckbox.checked !== isFixed) {
        ruleLocationCheckbox.checked = isFixed;
        
        // Обновляем внешний вид локации
        const locationItem = ruleLocationCheckbox.closest('.location-item');
        if (locationItem) {
            if (isFixed) {
                locationItem.classList.add('fixed');
            } else {
                locationItem.classList.remove('fixed');
            }
        }
    } else if (!ruleLocationCheckbox) {
        console.warn(`Чекбокс локации не найден: fix-location-${ruleId}-${locationIndex}`);
    }
    
    // Обновляем чекбокс в документо-ориентированном представлении
    // Находим все чекбоксы параграфов для данного правила и локации
    const paragraphCheckboxes = document.querySelectorAll(`.paragraph-fix-checkbox[data-rule-id="${ruleId}"][data-location-index="${locationIndex}"]`);
    
    if (paragraphCheckboxes.length === 0) {
        console.warn(`Чекбоксы параграфов не найдены для правила ${ruleId}, локации ${locationIndex}`);
    }
    
    paragraphCheckboxes.forEach(checkbox => {
        if (checkbox.checked !== isFixed) {
            checkbox.checked = isFixed;
            
            // Обновляем внешний вид нарушения
            const violationItem = checkbox.closest('.paragraph-violation-item');
            if (violationItem) {
                if (isFixed) {
                    violationItem.classList.add('fixed');
                } else {
                    violationItem.classList.remove('fixed');
                }
            }
        }
    });
    
    // Проверяем, все ли локации данного правила отмечены как исправленные
    updateRuleFixedStateBasedOnLocations(ruleId);
}

/**
 * Отмечает локацию правила как исправленную/неисправленную
 * @param {string} ruleId - ID правила
 * @param {number|string} locationIndex - Индекс локации
 * @param {boolean} isFixed - Флаг, указывающий исправлена ли локация
 */
function markLocationAsFixed(ruleId, locationIndex, isFixed = true) {
    console.log(`Marking location ${locationIndex} of rule ${ruleId} as ${isFixed ? 'fixed' : 'not fixed'}`);
    
    // Проверка входных данных
    if (!ruleId) {
        console.error('Ошибка: ID правила не указан');
        return;
    }
    
    // Синхронизируем состояние чекбоксов
    syncCheckboxes(ruleId, locationIndex, isFixed);
    
    // Обновляем счетчик исправленных ошибок
    updateFixedRulesCount();
    
    // Обновляем общий прогресс
    updateComplianceProgress();
    
    // Сохраняем состояние в localStorage для персистентности
    try {
        const locationKey = `${ruleId}-${locationIndex}`;
        const fixedLocations = JSON.parse(localStorage.getItem('fixedLocations') || '{}');
        fixedLocations[locationKey] = isFixed;
        localStorage.setItem('fixedLocations', JSON.stringify(fixedLocations));
    } catch (error) {
        console.warn('Не удалось сохранить состояние в localStorage:', error);
    }
}


/**
 * Обновляет состояние правила на основе состояния его локаций
 * @param {string} ruleId - ID правила
 */
function updateRuleFixedStateBasedOnLocations(ruleId) {
    const ruleCheckbox = document.getElementById(`fix-${ruleId}`);
    if (!ruleCheckbox) return;
    
    const locationCheckboxes = document.querySelectorAll(`.location-fix-checkbox[data-rule-id="${ruleId}"]`);
    if (locationCheckboxes.length === 0) return;
    
    // Проверяем, все ли локации отмечены как исправленные
    const allLocationsFixed = Array.from(locationCheckboxes).every(checkbox => checkbox.checked);
    
    // Если все локации исправлены, отмечаем правило как исправленное
    if (allLocationsFixed !== ruleCheckbox.checked) {
        ruleCheckbox.checked = allLocationsFixed;
        
        // Обновляем внешний вид правила
        const ruleItem = document.getElementById(ruleId);
        if (ruleItem) {
            if (allLocationsFixed) {
                ruleItem.classList.add('fixed');
            } else {
                ruleItem.classList.remove('fixed');
            }
        }
    }
    
    // Обновляем счетчик исправленных ошибок
    updateFixedRulesCount();
    
    // Обновляем общий прогресс
    updateComplianceProgress();
}

/**
 * Инициализирует обработчики для чекбоксов локаций с улучшенным логированием
 */
function initializeLocationCheckboxes() {
    // Добавляем обработчики для чекбоксов локаций
    const locationCheckboxes = document.querySelectorAll('.location-fix-checkbox');
    console.log(`Found ${locationCheckboxes.length} location checkboxes`);
    
    // Логируем все найденные чекбоксы для отладки
    locationCheckboxes.forEach((checkbox, index) => {
        const ruleId = checkbox.getAttribute('data-rule-id');
        const locationIndex = checkbox.getAttribute('data-location-index');
        console.log(`Checkbox ${index}: rule=${ruleId}, location=${locationIndex}, id=${checkbox.id}`);
    });
    
    locationCheckboxes.forEach(checkbox => {
        // Удаляем существующие обработчики, чтобы избежать дублирования
        const oldCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(oldCheckbox, checkbox);
        checkbox = oldCheckbox;
        
        checkbox.addEventListener('change', function() {
            const ruleId = this.getAttribute('data-rule-id');
            const locationIndex = this.getAttribute('data-location-index');
            const isChecked = this.checked;
            
            console.log(`Location checkbox changed: rule=${ruleId}, location=${locationIndex}, checked=${isChecked}`);
            
            // Отмечаем локацию как исправленную
            markLocationAsFixed(ruleId, locationIndex, isChecked);
            
            // Обновляем соответствующий чекбокс в документо-ориентированном представлении
            const paragraphCheckboxes = document.querySelectorAll(
                `.paragraph-fix-checkbox[data-rule-id="${ruleId}"][data-location-index="${locationIndex}"]`
            );
            
            console.log(`Found ${paragraphCheckboxes.length} matching paragraph checkboxes`);
            
            paragraphCheckboxes.forEach(paragraphCheckbox => {
                if (paragraphCheckbox.checked !== isChecked) {
                    console.log(`Updating paragraph checkbox: ${paragraphCheckbox.id}`);
                    paragraphCheckbox.checked = isChecked;
                    
                    // Обновляем внешний вид элемента
                    const violationItem = paragraphCheckbox.closest('.paragraph-violation-item');
                    if (violationItem) {
                        if (isChecked) {
                            violationItem.classList.add('fixed');
                        } else {
                            violationItem.classList.remove('fixed');
                        }
                    }
                }
            });
        });
    });
    
    console.log('Location checkboxes initialized with improved logging');
}

// Добавляем вызов функции инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeLocationCheckboxes();
    console.log('Location checkboxes initialized');
});

/**
 * Синхронизация состояния чекбоксов для одного и того же правила
 * @param {string} currentRuleId - ID текущего правила
 * @param {string} ruleName - Название правила
 * @param {boolean} isFixed - Состояние (исправлено/неисправлено)
 */
function syncRuleCheckboxes(currentRuleId, ruleName, isFixed) {
    // Находим все элементы правил с таким же названием
    const allRuleItems = document.querySelectorAll('.rule-item.failed');
    
    allRuleItems.forEach(item => {
        // Пропускаем текущее правило
        if (item.id === currentRuleId) return;
        
        // Проверяем, является ли это экземпляром того же правила
        const itemName = item.querySelector('.rule-name').textContent.trim();
        if (itemName === ruleName) {
            // Находим чекбокс
            const itemCheckbox = document.getElementById('fix-' + item.id);
            if (itemCheckbox && itemCheckbox.checked !== isFixed) {
                // Обновляем состояние чекбокса без вызова события change
                itemCheckbox.checked = isFixed;
                
                // Обновляем класс правила
                if (isFixed) {
                    item.classList.add('fixed');
                } else {
                    item.classList.remove('fixed');
                }
                
                // Также синхронизируем все местоположения
                const locationCheckboxes = item.querySelectorAll('.location-fix-checkbox');
                locationCheckboxes.forEach(checkbox => {
                    checkbox.checked = isFixed;
                    const locationItem = checkbox.closest('.location-item');
                    if (locationItem) {
                        if (isFixed) {
                            locationItem.classList.add('fixed');
                        } else {
                            locationItem.classList.remove('fixed');
                        }
                    }
                });
            }
        }
    });
}


/**
 * Синхронизация состояния чекбоксов для одного и того же местоположения
 * @param {string} ruleId - ID правила
 * @param {string|number} locationIndex - Индекс местоположения
 * @param {boolean} isFixed - Состояние (исправлено/неисправлено)
 */
function syncLocationCheckboxes(ruleId, locationIndex, isFixed) {
    // Находим все экземпляры этого правила
    const rule = document.getElementById(ruleId);
    if (!rule) return;
    
    const ruleName = rule.querySelector('.rule-name').textContent.trim();
    const allRuleItems = document.querySelectorAll('.rule-item.failed');
    
    allRuleItems.forEach(item => {
        // Пропускаем текущее правило
        if (item.id === ruleId) return;
        
        // Проверяем, является ли это экземпляром того же правила
        const itemName = item.querySelector('.rule-name').textContent.trim();
        if (itemName === ruleName) {
            // Находим соответствующий чекбокс местоположения
            const locationCheckbox = document.getElementById(`fix-location-${item.id}-${locationIndex}`);
            if (locationCheckbox && locationCheckbox.checked !== isFixed) {
                // Обновляем состояние чекбокса без вызова события change
                locationCheckbox.checked = isFixed;
                
                // Обновляем внешний вид местоположения
                const locationItem = locationCheckbox.closest('.location-item');
                if (locationItem) {
                    if (isFixed) {
                        locationItem.classList.add('fixed');
                    } else {
                        locationItem.classList.remove('fixed');
                    }
                }
            }
        }
    });
}

/**
 * Сохранение состояния исправления местоположения
 * @param {string} locationId - Идентификатор местоположения
 * @param {boolean} isFixed - Исправлено ли местоположение
 */
function saveFixedLocation(locationId, isFixed) {
    try {
        // Получаем сохраненные отметки
        const fixedLocations = JSON.parse(localStorage.getItem('fixedLocations') || '{}');
        
        // Обновляем состояние для данного местоположения
        fixedLocations[locationId] = isFixed;
        
        // Сохраняем обновленные данные
        localStorage.setItem('fixedLocations', JSON.stringify(fixedLocations));
    } catch (error) {
        console.error('Ошибка при сохранении состояния исправления:', error);
    }
}

/**
 * Обновление прогресс-бара на основе исправленных ошибок
 */
function updateProgressBar() {
    console.log('Обновление прогресс-бара');
    
    // Находим прогресс-бар
    const progressBar = document.querySelector('.compliance-value');
    if (!progressBar) {
        console.error('Прогресс-бар не найден');
        return;
    }
    
    // Подсчитываем количество правил
    const totalRules = document.querySelectorAll('.rule-item').length;
    const failedRules = document.querySelectorAll('.rule-item.failed').length;
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed').length;
    const passedRules = totalRules - failedRules + fixedRules;
    
    console.log(`Всего правил: ${totalRules}`);
    console.log(`Правил с ошибками: ${failedRules}`);
    console.log(`Исправленных правил: ${fixedRules}`);
    console.log(`Пройденных правил: ${passedRules}`);
    
    // Вычисляем процент соответствия
    const compliancePercentage = Math.round((passedRules / totalRules) * 100);
    console.log(`Процент соответствия: ${compliancePercentage}%`);
    
    // Обновляем прогресс-бар
    progressBar.style.width = compliancePercentage + '%';
    progressBar.textContent = compliancePercentage + '%';
    
    // Обновляем текст под прогресс-баром
    const summaryBox = document.querySelector('.summary-box');
    if (summaryBox) {
        const paragraphs = summaryBox.querySelectorAll('p');
        if (paragraphs.length >= 3) {
            paragraphs[0].textContent = `Общее соответствие стандартам: ${compliancePercentage}%`;
            paragraphs[1].textContent = `Пройдено правил: ${passedRules} из ${totalRules}`;
            paragraphs[2].textContent = `Нарушений: ${failedRules - fixedRules}`;
        }
    }
    
    // Обновляем статистику, если она есть
    const statComplianceElement = document.querySelector('.stat-compliance');
    if (statComplianceElement) {
        statComplianceElement.textContent = compliancePercentage + '%';
    }
    
    console.log('Прогресс-бар обновлен');
}

/**
 * Инициализация прогресс-бара с учетом исправленных нарушений
 */
function initializeComplianceMeter() {
    const complianceValues = document.querySelectorAll('.compliance-value');
    const fixedProgressBars = document.querySelectorAll('.fixed-progress');
    
    if (complianceValues.length) {
        const percentage = parseInt(complianceValues[0].textContent);
        
        // Установка ширины индикаторов основного прогресса
        complianceValues.forEach(value => {
            value.style.width = percentage + '%';
            
            // Установка цвета в зависимости от процента
            if (percentage >= 80) {
                value.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
            } else if (percentage >= 50) {
                value.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
            } else {
                value.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
            }
        });
        
        // Анимация заполнения
        setTimeout(() => {
            complianceValues.forEach(value => {
                value.classList.add('animated');
            });
        }, 500);
    }
    
    // Инициализация фиксированной панели с прогресс-баром
    initializeStickyProgressBar();
}

/**
 * Инициализация фиксированной панели с прогресс-баром
 */
function initializeStickyProgressBar() {
    const stickyProgress = document.querySelector('.sticky-progress');
    
    if (stickyProgress) {
        // Показываем/скрываем панель при прокрутке
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            const headerBottom = header.offsetTop + header.offsetHeight;
            
            if (window.pageYOffset > headerBottom) {
                stickyProgress.classList.add('visible');
            } else {
                stickyProgress.classList.remove('visible');
            }
        });
    }
}


/**
 * Обновление прогресс-бара на основе исправленных ошибок
 */
function updateProgressBar() {
    console.log('Обновление прогресс-бара');
    
    // Находим основной прогресс-бар и фиксированный прогресс-бар
    const progressBars = document.querySelectorAll('.compliance-value');
    const fixedProgressBars = document.querySelectorAll('.fixed-progress');
    const progressTexts = document.querySelectorAll('.progress-text');
    
    if (!progressBars.length) {
        console.error('Прогресс-бар не найден');
        return;
    }
    
    // Подсчитываем количество правил
    const totalRules = document.querySelectorAll('.rule-item').length;
    const failedRules = document.querySelectorAll('.rule-item.failed').length;
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed').length;
    const passedRules = totalRules - failedRules + fixedRules;
    
    console.log(`Всего правил: ${totalRules}`);
    console.log(`Правил с ошибками: ${failedRules}`);
    console.log(`Исправленных правил: ${fixedRules}`);
    console.log(`Пройденных правил: ${passedRules}`);
    
    // Вычисляем процент соответствия и процент испра��ленных нарушений
    const compliancePercentage = Math.round((passedRules / totalRules) * 100) || 0;
    const fixedPercentage = Math.round((fixedRules / totalRules) * 100) || 0;
    console.log(`Процент соответствия: ${compliancePercentage}%`);
    console.log(`Процент исправленных: ${fixedPercentage}%`);
    
    // Обновляем основной прогресс-бар
    progressBars.forEach(bar => {
        bar.style.width = compliancePercentage + '%';
        // Установка цвета в зависимости от процента
        if (compliancePercentage >= 80) {
            bar.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        } else if (compliancePercentage >= 50) {
            bar.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        } else {
            bar.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
    });
    
    // Обновляем фиолетовую полоску исправленных нарушений
    fixedProgressBars.forEach(bar => {
        bar.style.width = fixedPercentage + '%';
    });
    
    // Обновляем текст внутри прогресс-бара
    progressTexts.forEach(text => {
        text.textContent = compliancePercentage + '%';
    });
    
    // Обновляем текст под прогресс-баром
    const summaryBox = document.querySelector('.summary-box');
    if (summaryBox) {
        const paragraphs = summaryBox.querySelectorAll('p');
        if (paragraphs.length >= 3) {
            paragraphs[0].textContent = `Общее соответствие стандартам: ${compliancePercentage}%`;
            paragraphs[1].textContent = `Пройдено правил: ${passedRules} из ${totalRules}`;
            paragraphs[2].textContent = `Нарушений: ${failedRules - fixedRules}`;
        }
    }
    
    // Обновляем текст в фиксированной панели
    document.getElementById('sticky-compliance-value').textContent = compliancePercentage + '%';
    document.getElementById('sticky-passed-rules').textContent = passedRules;
    document.getElementById('sticky-total-rules').textContent = totalRules;
    document.getElementById('sticky-fixed-rules').textContent = fixedRules;
    
    // Обновляем счетчик исправленных нарушений
    const fixedCountElement = document.getElementById('fixed-count');
    if (fixedCountElement) {
        fixedCountElement.textContent = fixedRules;
    }
    
    // Обновляем статистику, если она есть
    const statComplianceElement = document.querySelector('.stat-compliance');
    if (statComplianceElement) {
        statComplianceElement.textContent = compliancePercentage + '%';
    }
    
    console.log('Прогресс-бар обновлен');
}
/**
 * Отмечает правило как исправленное/неисправленное и обновляет соответствующие элементы
 * @param {string} ruleId - ID правила
 * @param {boolean} isFixed - Флаг, указывающий исправлено ли правило
 */
function markAsFixed(ruleId, isFixed = true) {
    console.log(`Marking rule ${ruleId} as ${isFixed ? 'fixed' : 'not fixed'}`);
    
    // Находим правило в документе
    const ruleItem = document.getElementById(ruleId);
    if (!ruleItem) {
        console.warn(`Rule with ID ${ruleId} not found`);
        return;
    }
    
    // Если правило найдено, обновляем его класс
    if (isFixed) {
        ruleItem.classList.add('fixed');
    } else {
        ruleItem.classList.remove('fixed');
    }
    
    // Обновляем чекбокс правила, если он существует
    const checkbox = document.getElementById(`fix-${ruleId}`);
    if (checkbox && checkbox.checked !== isFixed) {
        checkbox.checked = isFixed;
    }
    
    // Если правило отмечено как исправленное, отмечаем все его локации
    const locationCheckboxes = document.querySelectorAll(`.location-fix-checkbox[data-rule-id="${ruleId}"]`);
    locationCheckboxes.forEach(locationCheckbox => {
        if (locationCheckbox.checked !== isFixed) {
            locationCheckbox.checked = isFixed;
            
            // Обновляем внешний вид локации
            const locationItem = locationCheckbox.closest('.location-item');
            if (locationItem) {
                if (isFixed) {
                    locationItem.classList.add('fixed');
                } else {
                    locationItem.classList.remove('fixed');
                }
            }
        }
    });
    
    // Обновляем счетчик исправленных ошибок
    updateFixedRulesCount();
    
    // Обновляем общий прогресс
    updateComplianceProgress();
}

/**
 * Синхронизация состояния чекбоксов для одного и того же правила
 * @param {string} currentRuleId - ID текущего правила
 * @param {string} ruleName - Название правила
 * @param {boolean} isFixed - Состояние (исправлено/неисправлено)
 */
function syncRuleCheckboxes(currentRuleId, ruleName, isFixed) {
    // Находим все элементы правил с таким же названием
    const allRuleItems = document.querySelectorAll('.rule-item.failed');
    
    allRuleItems.forEach(item => {
        // Пропускаем текущее правило
        if (item.id === currentRuleId) return;
        
        // Проверяем, является ли это экземпляром того же правила
        const itemName = item.querySelector('.rule-name').textContent.trim();
        if (itemName === ruleName) {
            // Находим чекбокс
            const itemCheckbox = document.getElementById('fix-' + item.id);
            if (itemCheckbox && itemCheckbox.checked !== isFixed) {
                // Обновляем состояние чекбокса без вызова события change
                itemCheckbox.checked = isFixed;
                
                // Обновляем класс правила
                if (isFixed) {
                    item.classList.add('fixed');
                } else {
                    item.classList.remove('fixed');
                }
            }
        }
    });
}


/**
 * Инициализация переключателя режимов отображения (по правилам / по документу)
 */
function initializeViewModeToggle() {
    // Создаем контейнер для переключателя режимов
    const viewToggleContainer = document.createElement('div');
    viewToggleContainer.className = 'view-mode-toggle';
    viewToggleContainer.innerHTML = `
        <div class="view-toggle-label">По правилам</div>
        <label class="toggle-switch">
            <input type="checkbox" id="view-mode-toggle">
            <span class="toggle-slider"></span>
        </label>
        <div class="view-toggle-label-right">По документу</div>
    `;
    
    // Добавляем переключатель после блока статистики
    const statisticsBlock = document.querySelector('.statistics-block');
    if (statisticsBlock) {
        statisticsBlock.parentNode.insertBefore(viewToggleContainer, statisticsBlock.nextSibling);
        
        // Добавляем обработчик события на переключение
        const viewModeToggle = document.getElementById('view-mode-toggle');
        if (viewModeToggle) {
            viewModeToggle.addEventListener('change', function() {
                toggleViewMode(this.checked);
            });
        }
        
        // Добавляем стили для переключателя
        addViewToggleStyles();
    }
}

/**
 * Добавление стилей для переключателя режимов отображения
 */
function addViewToggleStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .view-mode-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 1rem 0 2rem;
            padding: 1rem;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .view-toggle-label {
            margin-right: 1rem;
            font-weight: 500;
            color: var(--dark-blue);
        }
        
        .view-toggle-label-right {
            margin-left: 1rem;
            font-weight: 500;
            color: var(--dark-blue);
        }
        
        .document-oriented-view {
            display: none;
        }
        
        .rule-oriented-view {
            display: block;
        }
        
        body.document-mode .document-oriented-view {
            display: block;
        }
        
        body.document-mode .rule-oriented-view {
            display: none;
        }
        
        .location-group {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.7);
            border-radius: var(--border-radius);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        
        .location-group-header {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark-blue);
        }
        
        .location-group-rules {
            margin-left: 1rem;
        }
        
        .location-rule-item {
            margin-bottom: 0.5rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
        }
        
        .location-rule-name {
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .location-rule-description {
            font-size: 0.9rem;
            color: var(--text-light);
        }
    `;
    document.head.appendChild(styleElement);
}


/**
 * Переключение между режимами отображения
 * @param {boolean} isDocumentMode - Флаг, указывающий на режим отображения по документу
 */
function toggleViewMode(isDocumentMode) {
    console.log(`Переключение режима отображения на: ${isDocumentMode ? 'по документу' : 'по правилам'}`);
    
    // Добавляем/удаляем класс для тела документа
    if (isDocumentMode) {
        document.body.classList.add('document-mode');
        
        // Перестраиваем вид, ориентированный на документ, чтобы обновить все связи
        initializeDocumentOrientedView();
        
        showNotification('Режим отображения по документу включен', 'success');
    } else {
        document.body.classList.remove('document-mode');
        showNotification('Режим отображения по правилам включен', 'success');
    }
    
    // Обновляем состояние всех чекбоксов для синхронизации между представлениями
    updateAllCheckboxesState();
}

/**
 * Обновляет состояние всех чекбоксов для синхронизации между представлениями
 */
function updateAllCheckboxesState() {
    // Находим все чекбоксы локаций в правило-ориентированном представлении
    const locationCheckboxes = document.querySelectorAll('.location-fix-checkbox');
    
    locationCheckboxes.forEach(checkbox => {
        const ruleId = checkbox.getAttribute('data-rule-id');
        const locationIndex = checkbox.getAttribute('data-location-index');
        const isChecked = checkbox.checked;
        
        if (ruleId && locationIndex !== undefined) {
            // Синхронизируем с чекбоксами в документо-ориентированном представлении
            const paragraphCheckboxes = document.querySelectorAll(
                `.paragraph-fix-checkbox[data-rule-id="${ruleId}"][data-location-index="${locationIndex}"]`
            );
            
            paragraphCheckboxes.forEach(paragraphCheckbox => {
                paragraphCheckbox.checked = isChecked;
                
                // Обновляем внешний вид элемента
                const violationItem = paragraphCheckbox.closest('.paragraph-violation-item');
                if (violationItem) {
                    if (isChecked) {
                        violationItem.classList.add('fixed');
                    } else {
                        violationItem.classList.remove('fixed');
                    }
                }
            });
        }
    });
    
    console.log('Состояние всех чекбоксов обновлено');
}

/**
 * Построение вида, ориентированного на документ (ошибки группируются по местоположению)
 */
function buildDocumentOrientedView() {
    // Проходим по всем документам
    const documentCards = document.querySelectorAll('.document-card');
    
    documentCards.forEach(card => {
        // Проверяем, уже есть ли представление по документу
        if (card.querySelector('.document-oriented-view')) {
            return; // Уже создано
        }
        
        // Собираем все нарушения с их местоположениями
        const failedRules = Array.from(card.querySelectorAll('.rule-item.failed'));
        
        // Создаем отображение по местоположениям
        const documentView = document.createElement('div');
        documentView.className = 'document-oriented-view';
        
        // Если нет нарушений, показываем сообщение
        if (failedRules.length === 0) {
            documentView.innerHTML = `
                <div class="no-errors-message">
                    <p>В документе не найдено нарушений.</p>
                </div>
            `;
        } else {
            // Создаем структуру для группировки по местоположениям
            const locationGroups = groupRulesByLocation(failedRules);
            
            // Создаем представление для каждой группы местоположений
            const locationGroupsHTML = buildLocationGroupsHTML(locationGroups);
            documentView.innerHTML = locationGroupsHTML;
        }
        
        // Добавляем представление в документ, после блока действий
        const documentDetails = card.querySelector('.document-details');
        const actionsBlock = documentDetails.querySelector('.document-actions');
        
        // Добавляем класс rule-oriented-view к исходному списку правил
        const rulesSection = documentDetails.querySelector('.rules-section');
        if (rulesSection) {
            rulesSection.classList.add('rule-oriented-view');
        }
        
        // Вставляем новое представление после блока действий
        actionsBlock.insertAdjacentElement('afterend', documentView);
    });
}

/**
 * Группировка правил по местоположению
 * @param {Array} rules - Массив элементов правил
 * @returns {Object} - Объект с группами правил по местоположению
 */
function groupRulesByLocation(rules) {
    const locationGroups = {};
    
    rules.forEach(rule => {
        const ruleName = rule.querySelector('.rule-name').textContent;
        const ruleDescription = rule.querySelector('.rule-description').textContent;
        const ruleId = rule.id;
        
        // Получаем все местоположения для правила
        const locationItems = rule.querySelectorAll('.location-item');
        
        if (locationItems.length === 0) {
            // Если нет конкретных местоположений, добавляем в группу "Общие нарушения"
            const groupKey = 'general';
            if (!locationGroups[groupKey]) {
                locationGroups[groupKey] = {
                    name: 'Общие нарушения',
                    rules: []
                };
            }
            
            locationGroups[groupKey].rules.push({
                id: ruleId,
                name: ruleName,
                description: ruleDescription
            });
        } else {
            // Обрабатываем каждое местоположение
            locationItems.forEach(location => {
                const locationType = location.querySelector('.location-type').textContent;
                
                // Создаем ключ для группы на основе типа местоположения
                let groupKey = locationType.trim();
                
                // Специальная обработка для параграфов, разделов и т.д.
                if (groupKey.startsWith('Параграф')) {
                    groupKey = `paragraph-${groupKey.replace('Параграф ', '')}`;
                } else if (groupKey.startsWith('Р��здел')) {
                    groupKey = `section-${groupKey.replace('Раздел ', '')}`;
                } else if (groupKey.startsWith('Таблица')) {
                    groupKey = `table-${groupKey.replace('Таблица ', '')}`;
                }
                
                // Создаем группу, если она еще не существует
                if (!locationGroups[groupKey]) {
                    locationGroups[groupKey] = {
                        name: locationType,
                        rules: [],
                        // Получаем текст параграфа, если он есть
                        paragraphText: ''
                    };
                    
                    // Добавляем текст параграфа, если он есть
                    const locationText = location.querySelector('.location-text');
                    if (locationText) {
                        locationGroups[groupKey].paragraphText = locationText.textContent.trim();
                    }
                }
                
                // Добавляем правило в группу
                locationGroups[groupKey].rules.push({
                    id: ruleId,
                    name: ruleName,
                    description: ruleDescription
                });
            });
        }
    });
    
    return locationGroups;
}

/**
 * Создание HTML для групп местоположений
 * @param {Object} locationGroups - Объект с группами правил по местоположению
 * @returns {string} - HTML-код для групп местоположений
 */
function buildLocationGroupsHTML(locationGroups) {
    let html = '<h3>Нарушения по местоположению в документе:</h3>';
    
    // Сортируем группы по порядку их появления в документе
    const sortedGroupKeys = Object.keys(locationGroups).sort((a, b) => {
        // Общие нарушения всегда в конце
        if (a === 'general') return 1;
        if (b === 'general') return -1;
        
        // Сортировка по типу и номеру
        const aType = a.split('-')[0];
        const bType = b.split('-')[0];
        
        if (aType !== bType) {
            // Сортировка по типу: параграфы, разделы, таблицы
            const typeOrder = { 'paragraph': 1, 'section': 2, 'table': 3 };
            return (typeOrder[aType] || 99) - (typeOrder[bType] || 99);
        } else {
            // Если типы одинаковые, сортируем по номеру
            const aNumber = parseInt(a.split('-')[1]) || 0;
            const bNumber = parseInt(b.split('-')[1]) || 0;
            return aNumber - bNumber;
        }
    });
    
    // Создаем HTML для каждой группы
    sortedGroupKeys.forEach(key => {
        const group = locationGroups[key];
        
        html += `
            <div class="location-group">
                <div class="location-group-header">${group.name}</div>
        `;
        
        // Добавляем текст параграфа, если это группа параграфов и есть текст
        if (group.paragraphText && group.paragraphText.length > 0) {
            html += `
                <div class="location-paragraph-text">
                    <span class="paragraph-text-prefix">Текст параграфа: </span>
                    <span class="paragraph-text-content">${group.paragraphText}</span>
                </div>
            `;
        }
        
        html += `<div class="location-group-rules">`;
        
        // Добавляем правила в группу
        group.rules.forEach(rule => {
            html += `
                <div class="location-rule-item" data-rule-id="${rule.id}">
                    <div class="location-rule-name">${rule.name}</div>
                    <div class="location-rule-description">${rule.description}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    return html;
}


/**
 * Обработчик события клика по правилу в представлении по документу
 * @param {Event} event - Событие клика
 */
function handleDocumentViewRuleClick(event) {
    // Находим ближайший элемент правила
    const ruleItem = event.target.closest('.location-rule-item');
    if (!ruleItem) return;
    
    // Получаем ID соответствующего правила
    const ruleId = ruleItem.getAttribute('data-rule-id');
    if (!ruleId) return;
    
    // Находим оригинальное правило
    const originalRule = document.getElementById(ruleId);
    if (!originalRule) return;
    
    // Переключаемся в режим по правилам
    const viewModeToggle = document.getElementById('view-mode-toggle');
    if (viewModeToggle) {
        viewModeToggle.checked = false;
        toggleViewMode(false);
    }
    
    // Разворачиваем документ, содержащий правило
    const documentCard = originalRule.closest('.document-card');
    if (documentCard && !documentCard.classList.contains('expanded')) {
        toggleDocument(documentCard.id);
    }
    
    // Разворачиваем правило
    if (!originalRule.classList.contains('expanded')) {
        toggleRule(ruleId);
    }
    
    // Прокручиваем страницу к правилу
    originalRule.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Добавляем эффект выделения
    originalRule.classList.add('highlight-rule');
    setTimeout(() => {
        originalRule.classList.remove('highlight-rule');
    }, 3000);
}

// Добавляем обработчик события для документоориентированного представления
document.addEventListener('click', function(event) {
    const ruleItem = event.target.closest('.location-rule-item');
    if (ruleItem) {
        handleDocumentViewRuleClick(event);
    }
});

// Инициализация переключателя режимов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeViewModeToggle();
    
    // Добавляем стили для выделения правила
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes highlightRule {
            0% { background-color: rgba(52, 152, 219, 0.3); }
            100% { background-color: transparent; }
        }
        
        .highlight-rule {
            animation: highlightRule 3s ease-out;
        }
    `;
    document.head.appendChild(styleElement);
});

/**
 * Обновляет состояние правила на основе состояния его локаций
 * @param {string} ruleId - ID правила
 */
function updateRuleFixedStateBasedOnLocations(ruleId) {
    const ruleCheckbox = document.getElementById(`fix-${ruleId}`);
    if (!ruleCheckbox) return;
    
    const locationCheckboxes = document.querySelectorAll(`.location-fix-checkbox[data-rule-id="${ruleId}"]`);
    if (locationCheckboxes.length === 0) return;
    
    // Проверяем, все ли локации отмечены как исправленные
    const allLocationsFixed = Array.from(locationCheckboxes).every(checkbox => checkbox.checked);
    
    // Если все локации исправлены, отмечаем правило как исправленное
    if (allLocationsFixed !== ruleCheckbox.checked) {
        ruleCheckbox.checked = allLocationsFixed;
        
        // Обновляем внешний вид правила
        const ruleItem = document.getElementById(ruleId);
        if (ruleItem) {
            if (allLocationsFixed) {
                ruleItem.classList.add('fixed');
            } else {
                ruleItem.classList.remove('fixed');
            }
        }
    }
}

/**
 * Обновляет счетчик исправленных ошибок
 */
function updateFixedRulesCount() {
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed');
    const totalFailedRules = document.querySelectorAll('.rule-item.failed');
    
    // Обновляем счетчик в статистике
    const fixedCountElement = document.getElementById('fixed-count');
    if (fixedCountElement) {
        fixedCountElement.textContent = fixedRules.length;
    }
    
    // Обновляем счетчик в верхней панели
    const stickyFixedRules = document.getElementById('sticky-fixed-rules');
    if (stickyFixedRules) {
        stickyFixedRules.textContent = fixedRules.length;
    }
    
    // Показываем процент исправленных ошибок
    const fixedPercentage = totalFailedRules.length > 0 
        ? Math.round((fixedRules.length / totalFailedRules.length) * 100) 
        : 0;
    
    console.log(`Fixed rules: ${fixedRules.length}/${totalFailedRules.length} (${fixedPercentage}%)`);
}

/**
 * Обновляет прогресс соответствия с учетом исправленных ошибок
 */
function updateComplianceProgress() {
    const totalRules = document.querySelectorAll('.rule-item').length;
    const passedRules = document.querySelectorAll('.rule-item.passed').length;
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed').length;
    
    // Вычисляем общий процент соответствия
    const totalCompliance = totalRules > 0 
        ? Math.round(((passedRules + fixedRules) / totalRules) * 100)
        : 0;
    
    // Вычисляем процент исправленных ошибок
    const fixedPercentage = totalRules > 0
        ? Math.round((fixedRules / totalRules) * 100)
        : 0;
    
    // Обновляем прогресс-бар
    const complianceValues = document.querySelectorAll('.compliance-value');
    complianceValues.forEach(complianceValue => {
        complianceValue.style.width = totalCompliance + '%';
        const progressText = complianceValue.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = totalCompliance + '%';
        }
        
        // Обновляем цвет в зависимости от процента
        if (totalCompliance >= 80) {
            complianceValue.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        } else if (totalCompliance >= 50) {
            complianceValue.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        } else {
            complianceValue.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
    });
    
    // Обновляем полоску исправленных правил
    const fixedProgresses = document.querySelectorAll('.fixed-progress');
    fixedProgresses.forEach(fixedProgress => {
        fixedProgress.style.width = fixedPercentage + '%';
    });
    
    // Обновляем статистику в верхней панели
    const stickyComplianceValue = document.getElementById('sticky-compliance-value');
    if (stickyComplianceValue) {
        stickyComplianceValue.textContent = totalCompliance + '%';
    }
    
    // Обновляем значение в блоке статистики
    const complianceStatValue = document.querySelector('.stat-compliance');
    if (complianceStatValue) {
        complianceStatValue.textContent = totalCompliance + '%';
    }
    
    console.log(`Compliance updated: ${totalCompliance}% (fixed: ${fixedPercentage}%)`);
}
/**
 * Устанавливает обработчики для чекбоксов и инициализирует их состояние
 */
function initializeFixedRulesProgress() {
    // Добавляем обработчики для чекбоксов правил
    const ruleCheckboxes = document.querySelectorAll('.fix-checkbox');
    ruleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const ruleId = this.id.replace('fix-', '');
            const isChecked = this.checked;
            
            // Отмечаем правило как исправленное
            markAsFixed(ruleId, isChecked);
        });
    });
    
    // Добавляем обработчики для чекбоксов локаций
    const locationCheckboxes = document.querySelectorAll('.location-fix-checkbox');
    locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const ruleId = this.getAttribute('data-rule-id');
            const locationIndex = this.getAttribute('data-location-index');
            const isChecked = this.checked;
            
            // Отмечаем локацию как исправленную
            markLocationAsFixed(ruleId, locationIndex, isChecked);
        });
    });
    
    // Отображаем прогресс-бар при прокрутке
    window.addEventListener('scroll', function() {
        const stickyProgress = document.querySelector('.sticky-progress');
        if (window.scrollY > 300 && stickyProgress) {
            stickyProgress.classList.add('visible');
        } else if (stickyProgress) {
            stickyProgress.classList.remove('visible');
        }
    });
    
    // Обновляем счетчик исправленных ошибок
    updateFixedRulesCount();
    
    // Обновляем общий прогресс
    updateComplianceProgress();
    
    console.log('Fixed rules progress initialized');
}

// Добавляем вызов функции инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeFixedRulesProgress();
});

/**
 * Обновляет счетчик исправленных ошибок
 */
function updateFixedRulesCount() {
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed');
    const totalFailedRules = document.querySelectorAll('.rule-item.failed');
    
    // Обновляем счетчик в статистике
    const fixedCountElement = document.getElementById('fixed-count');
    if (fixedCountElement) {
        fixedCountElement.textContent = fixedRules.length;
    }
    
    // Обновляем счетчик в верхней панели
    const stickyFixedRules = document.getElementById('sticky-fixed-rules');
    if (stickyFixedRules) {
        stickyFixedRules.textContent = fixedRules.length;
    }
    
    console.log(`Fixed rules count updated: ${fixedRules.length}/${totalFailedRules.length}`);
}

/**
 * Обновляет прогресс соответствия с учетом исправленных ошибок
 */
function updateComplianceProgress() {
    const totalRules = document.querySelectorAll('.rule-item').length;
    const passedRules = document.querySelectorAll('.rule-item.passed').length;
    const fixedRules = document.querySelectorAll('.rule-item.failed.fixed').length;
    
    // Вычисляем общий процент соответствия
    const totalCompliance = totalRules > 0 
        ? Math.round(((passedRules + fixedRules) / totalRules) * 100)
        : 0;
    
    // Вычисляем процент исправленных ошибок
    const fixedPercentage = totalRules > 0
        ? Math.round((fixedRules / totalRules) * 100)
        : 0;
    
    // Обновляем прогресс-бар
    const complianceValues = document.querySelectorAll('.compliance-value');
    complianceValues.forEach(complianceValue => {
        complianceValue.style.width = totalCompliance + '%';
        const progressText = complianceValue.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = totalCompliance + '%';
        }
        
        // Обновляем цвет в зависимости от процента
        if (totalCompliance >= 80) {
            complianceValue.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        } else if (totalCompliance >= 50) {
            complianceValue.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        } else {
            complianceValue.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        }
    });
    
    // Обновляем полоску исправленных правил
    const fixedProgresses = document.querySelectorAll('.fixed-progress');
    fixedProgresses.forEach(fixedProgress => {
        fixedProgress.style.width = fixedPercentage + '%';
    });
    
    console.log(`Compliance progress updated: ${totalCompliance}% (fixed: ${fixedPercentage}%)`);
}
/**
 * Инициализация документо-ориентированного вида
 * Полностью переписанная функция для исправления проблем с индексами
 */
function initializeDocumentOrientedView() {
    console.log("Initializing document-oriented view with fixed indexing");
    
    // Находим все карточки документов
    const documentCards = document.querySelectorAll('.document-card');
    
    documentCards.forEach((card, docIndex) => {
        // Удаляем существующее представление, если оно есть
        const existingView = card.querySelector('.document-oriented-view');
        if (existingView) {
            existingView.remove();
        }
        
        // Создаем новое представление
        const documentView = document.createElement('div');
        documentView.className = 'document-oriented-view';
        
        // Создаем заголовок
        const viewHeader = document.createElement('h3');
        viewHeader.textContent = 'Вид документа с нарушениями';
        documentView.appendChild(viewHeader);
        
        // Создаем структуру данных для хранения параграфов и их нарушений
        const paragraphs = new Map();
        
        // Получаем все правила с ошибками
        const failedRules = card.querySelectorAll('.rule-item.failed');
        
        // Для каждого правила собираем локации
        failedRules.forEach(rule => {
            const ruleId = rule.id;
            const ruleName = rule.querySelector('.rule-name').textContent;
            
            // Получаем все локации для этого правила
            const locations = rule.querySelectorAll('.location-item');
            
            locations.forEach(location => {
                // Находим чекбокс локации, чтобы получить правильный индекс
                const locationCheckbox = location.querySelector('.location-fix-checkbox');
                if (!locationCheckbox) {
                    console.warn(`Чекбокс не найден для локации в правиле ${ruleId}`);
                    return;
                }
                
                // Получаем индекс локации из атрибута data-location-index
                const locationIndex = locationCheckbox.getAttribute('data-location-index');
                if (locationIndex === null || locationIndex === undefined) {
                    console.warn(`Индекс локации не найден для чекбокса в правиле ${ruleId}`);
                    return;
                }
                
                // Получаем информацию о параграфе
                const paragraphText = location.querySelector('.location-text')?.textContent;
                if (!paragraphText) {
                    console.warn(`Текст параграфа не найден для локации в правиле ${ruleId}`);
                    return;
                }
                
                const paragraphTypeElement = location.querySelector('.location-type');
                const paragraphTypeText = paragraphTypeElement ? paragraphTypeElement.textContent : '';
                const paragraphNumber = paragraphTypeText.match(/\d+/)?.[0];
                
                // Создаем уникальный ключ для параграфа
                const paragraphKey = paragraphNumber ? 
                    `para-${paragraphNumber}` : 
                    `text-${paragraphText.substring(0, 30)}`;
                
                // Если параграф еще не добавлен, создаем его
                if (!paragraphs.has(paragraphKey)) {
                    paragraphs.set(paragraphKey, {
                        number: paragraphNumber,
                        text: paragraphText,
                        typeText: paragraphTypeText,
                        violations: [] // Массив нарушений для этого параграфа
                    });
                }
                
                // Проверяем, не добавляли ли мы уже это правило для этого параграфа
                const existingViolation = paragraphs.get(paragraphKey).violations.find(
                    v => v.ruleId === ruleId && v.locationIndex === locationIndex
                );
                
                if (!existingViolation) {
                    // Добавляем информацию о нарушении с точным индексом
                    paragraphs.get(paragraphKey).violations.push({
                        ruleId: ruleId,
                        ruleName: ruleName,
                        locationIndex: locationIndex,
                        // Используем тот же формат ID, что и в оригинальном чекбоксе
                        checkboxId: `fix-location-${ruleId}-${locationIndex}`
                    });
                }
            });
        });
        
        // Если есть параграфы с нарушениями, отображаем их
        if (paragraphs.size > 0) {
            // Преобразуем Map в массив и сортируем по номеру параграфа
            const sortedParagraphs = Array.from(paragraphs.values())
                .sort((a, b) => {
                    if (a.number && b.number) {
                        return parseInt(a.number) - parseInt(b.number);
                    }
                    return 0;
                });
            
            // Создаем элементы для каждого параграфа
            sortedParagraphs.forEach(paragraph => {
                const paragraphContainer = document.createElement('div');
                paragraphContainer.className = 'paragraph-container';
                
                // Добавляем заголовок параграфа
                const paragraphHeader = document.createElement('div');
                paragraphHeader.className = 'paragraph-header';
                paragraphHeader.textContent = paragraph.typeText || 'Параграф';
                paragraphContainer.appendChild(paragraphHeader);
                
                // Добавляем текст параграфа
                const paragraphTextDiv = document.createElement('div');
                paragraphTextDiv.className = 'location-paragraph-text';
                
                const textPrefix = document.createElement('span');
                textPrefix.className = 'paragraph-text-prefix';
                textPrefix.textContent = 'Текст параграфа: ';
                
                const textContent = document.createElement('span');
                textContent.className = 'paragraph-text-content';
                textContent.textContent = paragraph.text;
                
                paragraphTextDiv.appendChild(textPrefix);
                paragraphTextDiv.appendChild(textContent);
                paragraphContainer.appendChild(paragraphTextDiv);
                
                // Добавляем список нарушений
                if (paragraph.violations && paragraph.violations.length > 0) {
                    const violationsList = document.createElement('div');
                    violationsList.className = 'paragraph-violations-list';
                    
                    // Группируем нарушения по имени правила
                    const ruleNameMap = new Map();
                    paragraph.violations.forEach(violation => {
                        if (!ruleNameMap.has(violation.ruleName)) {
                            ruleNameMap.set(violation.ruleName, []);
                        }
                        ruleNameMap.get(violation.ruleName).push(violation);
                    });
                    
                    // Создаем элементы для каждого уникального правила
                    ruleNameMap.forEach((violations, ruleName) => {
                        const violationItem = document.createElement('div');
                        violationItem.className = 'paragraph-violation-item';
                        
                        // Берем первое нарушение для это��о правила
                        const firstViolation = violations[0];
                        violationItem.dataset.ruleId = firstViolation.ruleId;
                        
                        // Создаем чекбокс
                        const checkboxContainer = document.createElement('div');
                        checkboxContainer.className = 'paragraph-checkbox-container';
                        
                        // Создаем уникальный ID для чекбокса в документо-ориентированном представлении
                        const checkboxId = `fix-paragraph-${firstViolation.ruleId}-${firstViolation.locationIndex}-${docIndex}`;
                        
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = checkboxId;
                        checkbox.className = 'paragraph-fix-checkbox';
                        checkbox.dataset.ruleId = firstViolation.ruleId;
                        checkbox.dataset.locationIndex = firstViolation.locationIndex;
                        
                        // Находим оригинальный чекбокс по его ID
                        const originalCheckbox = document.getElementById(firstViolation.checkboxId);
                        
                        if (originalCheckbox) {
                            console.log(`Найден оригинальный чекбокс ${firstViolation.checkboxId} для параграфа`);
                            
                            // Синхронизируем начальное состояние
                            checkbox.checked = originalCheckbox.checked;
                            
                            // Если чекбокс отмечен, добавляем класс fixed
                            if (checkbox.checked) {
                                violationItem.classList.add('fixed');
                            }
                            
                            // Добавляем обработчик для синхронизации
                            checkbox.addEventListener('change', function() {
                                console.log(`Изменение чекбокса параграфа ${checkboxId}, новое состояние: ${this.checked}`);
                                
                                // Обновляем оригинальный чекбокс
                                originalCheckbox.checked = this.checked;
                                
                                // Вызываем событие change на оригинальном чекбоксе
                                const event = new Event('change', { bubbles: true });
                                originalCheckbox.dispatchEvent(event);
                                
                                // Обновляем внешний вид параграфа
                                if (this.checked) {
                                    violationItem.classList.add('fixed');
                                } else {
                                    violationItem.classList.remove('fixed');
                                }
                            });
                        } else {
                            console.warn(`Оригинальный чекбокс ${firstViolation.checkboxId} не найден`);
                        }
                        
                        const label = document.createElement('label');
                        label.htmlFor = checkboxId;
                        label.textContent = 'Исправлено';
                        
                        checkboxContainer.appendChild(checkbox);
                        checkboxContainer.appendChild(label);
                        
                        // Создаем описание нарушения
                        const violationDescription = document.createElement('div');
                        violationDescription.className = 'paragraph-violation-description';
                        violationDescription.textContent = ruleName;
                        
                        violationItem.appendChild(checkboxContainer);
                        violationItem.appendChild(violationDescription);
                        
                        violationsList.appendChild(violationItem);
                    });
                    
                    paragraphContainer.appendChild(violationsList);
                }
                
                documentView.appendChild(paragraphContainer);
            });
        } else {
            // Если нет параграфов с нарушениями, показываем сообщение
            const noLocationsMessage = document.createElement('p');
            noLocationsMessage.textContent = 'Нет доступных параграфов с нарушениями.';
            noLocationsMessage.className = 'no-locations-message';
            documentView.appendChild(noLocationsMessage);
        }
        
        // Вставляем представление в документ
        const documentDetails = card.querySelector('.document-details');
        if (documentDetails) {
            const firstChild = documentDetails.querySelector('.document-path');
            if (firstChild) {
                firstChild.insertAdjacentElement('afterend', documentView);
            } else {
                documentDetails.appendChild(documentView);
            }
        }
    });
    
    console.log("Document-oriented view initialized with fixed indexing");
}
// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeDocumentOrientedView();
});

/**
 * Инициализация переключателей для пройденных правил
 */
function initializePassedRulesToggle() {
    console.log('Инициализация переключателей для пройденных правил');
    
    const toggleButtons = document.querySelectorAll('.toggle-passed-rules');
    
    toggleButtons.forEach(button => {
        // Находим соответствующий список пройденных правил
        const documentId = button.closest('.document-card')?.id;
        if (!documentId) {
            console.warn('Не удалось найти ID документа для кнопки переключения пройденных правил');
            return;
        }
        
        const passedRulesList = document.getElementById(`passed-${documentId}`);
        if (!passedRulesList) {
            console.warn(`Список пройденных правил не найден для документа ${documentId}`);
            return;
        }
        
        // Добавление обработчика клика
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            togglePassedRules(documentId);
        });
        
        // Добавление иконки, если её нет
        let toggleIcon = button.querySelector('.toggle-icon');
        if (!toggleIcon) {
            toggleIcon = document.createElement('span');
            toggleIcon.classList.add('toggle-icon');
            toggleIcon.textContent = '▼';
            button.appendChild(toggleIcon);
        }
        
        console.log(`Инициализирован переключатель для документа ${documentId}`);
    });
}

// Обеспечиваем вызов функции при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Другие инициализации...
    
    // Инициализация переключателей пройденных правил
    initializePassedRulesToggle();
    
    // Проверка наличия пройденных правил и их отобра��ение
    const passedRulesLists = document.querySelectorAll('.passed-rules-list');
    console.log(`Найдено ${passedRulesLists.length} списков пройденных правил`);
    
    // Проверка наличия пройденных правил в каждом списке
    passedRulesLists.forEach((list, index) => {
        const passedRules = list.querySelectorAll('.rule-item.passed');
        console.log(`Список ${index + 1}: найдено ${passedRules.length} пройденных правил`);
    });
});

/**
 * Раскрывает все контейнеры с пройденными правилами
 */
function expandAllPassedRulesContainers() {
    const passedRulesLists = document.querySelectorAll('.passed-rules-list');
    const toggleButtons = document.querySelectorAll('.toggle-passed-rules');
    
    passedRulesLists.forEach(list => {
        // Добавляем класс expanded
        list.classList.add('expanded');
        
        // Устанавливаем стили для отображения
        list.style.display = 'block';
        list.style.maxHeight = 'none';
        list.style.overflow = 'visible';
    });
    
    // Меняем значок на стрелку вверх для всех кнопок-переключателей
    toggleButtons.forEach(button => {
        const toggleIcon = button.querySelector('.toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = '▲';
        }
    });
    
    console.log('Все контейнеры с пройденными правилами раскрыты');
}

// Переопределяем функцию togglePassedRules для правильной работы с уже раскрытыми контейнерами
function togglePassedRules(documentId) {
    const passedRulesList = document.getElementById('passed-' + documentId);
    const toggleButton = document.querySelector(`#${documentId} .toggle-passed-rules`);
    const toggleIcon = toggleButton?.querySelector('.toggle-icon');
    
    if (passedRulesList) {
        passedRulesList.classList.toggle('expanded');
        
        if (passedRulesList.classList.contains('expanded')) {
            passedRulesList.style.display = 'block';
            passedRulesList.style.maxHeight = 'none';
            passedRulesList.style.overflow = 'visible';
            if (toggleIcon) toggleIcon.textContent = '▲';
        } else {
            passedRulesList.style.maxHeight = '0';
            passedRulesList.style.overflow = 'hidden';
            if (toggleIcon) toggleIcon.textContent = '▼';
            
            // Задержка перед скрытием для анимации
            setTimeout(() => {
                if (!passedRulesList.classList.contains('expanded')) {
                    passedRulesList.style.display = 'none';
                }
            }, 300);
        }
    }
}

/**
 * Инициализация кнопок копирования для всех текстов параграфов
 * Работает как в правилоориентированном, так и в документоориентированном режиме
 */
function initializeCopyButtons() {
    // Функция для добавления кнопки к элементам параграфа
    function addCopyButtonTo(paragraphText) {
        // Проверяем, что у элемента есть текст для копирования
        if (paragraphText.textContent.trim() !== '') {
            // Проверяем, не добавлена ли уже кнопка копирования
            const parentElement = paragraphText.parentElement;
            if (!parentElement.querySelector('.copy-button')) {
                // Создаем кнопку копирования
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.innerHTML = '📋 Копировать';
                copyButton.title = 'Копировать текст в буфер обмена';
                
                // Добавляем обработчик события клика
                copyButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Копируем текст в буфер обмена
                    const textToCopy = paragraphText.textContent;
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            // Меняем текст кнопки на короткое время для подтверждения
                            const originalText = copyButton.innerHTML;
                            copyButton.innerHTML = '✅ Скопировано!';
                            copyButton.classList.add('copied');
                            
                            // Возвращаем исходный текст через 2 секунды
                            setTimeout(() => {
                                copyButton.innerHTML = originalText;
                                copyButton.classList.remove('copied');
                            }, 2000);
                            
                            // Показываем уведомление
                            showNotification('Текст скопирован в буфер обмена', 'success');
                        })
                        .catch(err => {
                            console.error('Ошибка при копировании текста:', err);
                            copyButton.innerHTML = '❌ Ошибка';
                            setTimeout(() => {
                                copyButton.innerHTML = '📋 Копировать';
                            }, 2000);
                            
                            showNotification('Не удалось скопировать текст', 'error');
                        });
                });
                
                // Вместо добавления кнопки в родительский элемент, вставляем её после текстового элемента
                // Это ключевое изменение, которое гарантирует, что кнопка будет под текстом
                paragraphText.insertAdjacentElement('afterend', copyButton);
            }
        }
    }
    
    // Находим все элементы с текстом параграфа в правилоориентированном представлении
    const ruleBasedParagraphs = document.querySelectorAll('.location-text');
    ruleBasedParagraphs.forEach(addCopyButtonTo);
    
    // Обработчик для документоориентированного представления
    function processParagraphContainers() {
        // Находим все элементы с текстом параграфа в документоориентированном представлении
        const documentBasedParagraphs = document.querySelectorAll('.paragraph-text-content');
        documentBasedParagraphs.forEach(addCopyButtonTo);
        
        // Также находим содержимое локаций в документоориентированном представлении
        const locationParagraphs = document.querySelectorAll('.location-paragraph-text .paragraph-text-content');
        locationParagraphs.forEach(addCopyButtonTo);
    }
    
    // Обрабатываем документоориентированное представление
    processParagraphContainers();
    
    // Добавляем обработчик для переключения режимов просмотра
    const viewModeToggle = document.getElementById('view-mode-toggle');
    if (viewModeToggle) {
        viewModeToggle.addEventListener('change', function() {
            // При переключении режимов заново инициализируем кнопки
            setTimeout(processParagraphContainers, 100);
        });
    }
    
    // Обработчик мутаций для динамического добавления кнопок к новым элементам
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // Проверяем, есть ли среди добавленных узлов документоориентированное представление
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Проверяем, что это элемент
                        if (node.classList && 
                           (node.classList.contains('document-oriented-view') || 
                            node.classList.contains('paragraph-container') || 
                            node.classList.contains('location-paragraph-text'))) {
                            setTimeout(processParagraphContainers, 100);
                            break;
                        }
                    }
                }
            }
        });
    });
    
    // Наблюдаем за изменениями в документе
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('Инициализация кнопок копирования завершена');
}
