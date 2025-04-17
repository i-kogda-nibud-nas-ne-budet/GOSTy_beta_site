/**
 * Normify API Client
 * Библиотека для взаимодействия с Normify API 
 */

class NormifyApi {
  constructor(baseUrl = 'https://xn--j1acbdcdcbnev7j.xn--p1ai/') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('normify_token') || null;
  }

  /**
   * Установка базового URL API
   * @param {string} url - URL сервера API
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  /**
   * Получение заголовков для запросов
   * @param {boolean} includeAuth - Включать ли токен авторизации
   * @returns {Object} - Заголовки запроса
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Accept': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Выполнение HTTP запроса
   * @param {string} method - HTTP метод
   * @param {string} endpoint - Эндпоинт API
   * @param {Object|FormData} data - Данные запроса
   * @param {boolean} isFormData - Флаг, указывающий на FormData
   * @returns {Promise<Object>} - Результат запроса
   */
  async request(method, endpoint, data = null, isFormData = false) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(!isFormData),
      credentials: 'include',
    };

    if (data) {
      if (isFormData) {
        options.body = data;
        // Убираем заголовки, чтобы браузер сам установил их для FormData
        delete options.headers['Content-Type'];
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, options);
      
      // Для ответов не в формате JSON (например, HTML отчет)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        return await response.text();
      }

      // Обработка ошибок
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка запроса к API');
      }

      // Обычный JSON-ответ
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя 
   * @returns {Promise<Object>} - Данные созданного пользователя
   */
  async register(userData) {
    return await this.request('POST', '/api/register', userData);
  }

  /**
   * Авторизация пользователя
   * @param {string} username - Имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise<Object>} - Данные токена
   */
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseUrl}/api/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка авторизации');
    }

    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('normify_token', data.access_token);
    
    return data;
  }

  /**
   * Выход из системы
   */
  logout() {
    this.token = null;
    localStorage.removeItem('normify_token');
  }

  /**
   * Проверка авторизации
   * @returns {boolean} - Флаг авторизации
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Загрузка и проверка документа
   * @param {File} file - Файл документа
   * @returns {Promise<Object>} - Результаты проверки
   */
  async validateDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return await this.request('POST', '/api/documents/validate', formData, true);
  }

  /**
   * Загрузка и проверка документа (для неавторизованных пользователей)
   * @param {File} file - Файл документа
   * @returns {Promise<Object>} - Результаты проверки
   */
  async validateDocumentAnonymous(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      return await this.request('POST', '/api/documents/validate-anonymous', formData, true);
    } catch (error) {
      // Если превышен лимит запросов, предложим авторизоваться
      if (error.message.includes('лимит запросов')) {
        error.limitExceeded = true;
      }
      throw error;
    }
  }

  /**
   * Получение истории проверок
   * @param {number} limit - Лимит записей
   * @param {number} offset - Смещение для пагинации
   * @returns {Promise<Array>} - Список проверок
   */
  async getValidationHistory(limit = 10, offset = 0) {
    return await this.request('GET', `/api/documents/history?limit=${limit}&offset=${offset}`);
  }

  /**
   * Получение HTML отчета
   * @param {string} documentId - ID документа
   * @returns {Promise<string>} - HTML отчет
   */
  async getDocumentReport(documentId) {
    return await this.request('GET', `/api/documents/report/${documentId}`);
  }

  /**
   * Проверка состояния API
   * @returns {Promise<Object>} - Статус API
   */
  async healthCheck() {
    return await this.request('GET', '/api/health');
  }
}

// Создаем экземпляр API клиента
const normifyApi = new NormifyApi();

// Экспортируем для использования на страницах
window.normifyApi = normifyApi;
