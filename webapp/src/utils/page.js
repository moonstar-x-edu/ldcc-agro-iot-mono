export const updatePageTitle = (title) => {
  if (!document) {
    throw new Error('No document global object available!');
  }

  document.title = `${title} | Sistema de Agricultura Inteligente`;
};
