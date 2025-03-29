// Скрипт для обработки модального окна с формой обратной связи
document.addEventListener('DOMContentLoaded', function() {
    // Находим элемент email в футере
    const emailLink = document.querySelector('.social-links a[title="Email"]');
    
    // Заменяем обработчик клика
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            showContactModal();
        });
        
        // Убираем href, чтобы избежать стандартного поведения mailto
        emailLink.setAttribute('href', '#');
    }
    
    // Функция для отображения модального окна
    function showContactModal() {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        
        // Создаем содержимое модального окна
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Напишите нам</h2>
                <form id="contact-form">
                    <div class="form-group">
                        <label for="name">Ваше имя</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Ваш email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Сообщение</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn">Отправить</button>
                </form>
                <div id="form-message" class="hidden"></div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        document.body.appendChild(modal);
        
        // Показываем модальное окно с анимацией
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Обработчик закрытия модального окна
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            closeModal(modal);
        });
        
        // Закрытие по клику вне контента
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        // Обработка отправки формы
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            
            // Здесь будет код для отправки данных на се��вер
            // В демо-версии просто показываем сообщение об успехе
            
            formMessage.textContent = 'Спасибо! Ваше сообщение отправлено.';
            formMessage.className = 'success-message';
            
            // Очищаем форму
            form.reset();
            
            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
                closeModal(modal);
            }, 3000);
        });
    }
    
    // Функция закрытия модального окна
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
});