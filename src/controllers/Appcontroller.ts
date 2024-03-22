class AppController {
  static getHome() {
    return {
      success: true,
      message: 'Unicornis API is online, welcome!',
      data: {
        name: 'Unicornis API',
        purpose: 'Manage your Unicorns',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'https://documenter.getpostman.com/view/27102918/2sA35Ba47e',
      },
    };
  }
}

export default AppController;
