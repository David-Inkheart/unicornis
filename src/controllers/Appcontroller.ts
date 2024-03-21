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
        API_docs: 'coming soon',
      },
    };
  }
}

export default AppController;
