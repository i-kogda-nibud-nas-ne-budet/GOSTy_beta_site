// Notification handler for the "Проверить документ" functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all links to check.html
    const checkLinks = document.querySelectorAll('a[href="check.html"]');
    
    // Add click event listener to each link
    checkLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default navigation
            event.preventDefault();
            
            // Create notification element
            showNotification('В настоящее время функционал проверки документов недоступен. Автор работает над серверами и деплоем. Приносим извинения за временные неудобства.');
        });
    });
    
    // Function to show notification
    function showNotification(message) {
        // Check if notification already exists
        let notification = document.querySelector('.custom-notification');
        if (notification) {
            notification.remove();
        }
        
        // Create notification element
        notification = document.createElement('div');
        notification.className = 'custom-notification';
        
        // Create message content
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        // Add icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-info-circle notification-icon';
        content.appendChild(icon);
        
        // Add message text
        const text = document.createElement('p');
        text.textContent = message;
        content.appendChild(text);
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Assemble notification
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});