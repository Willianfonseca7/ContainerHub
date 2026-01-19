export default {
  routes: [
    {
      method: 'GET',
      path: '/profiles/me',
      handler: 'profile.me',
      config: {},
    },
    {
      method: 'PUT',
      path: '/profiles/me',
      handler: 'profile.updateMe',
      config: {},
    },
    {
      method: 'POST',
      path: '/profiles/me',
      handler: 'profile.updateMe',
      config: {},
    },
  ],
};
