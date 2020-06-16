parasails.registerPage('distribution', {
  data: {
    posts:[],
  },

  beforeMount: async function() {
    this.getPosts();
  },

  methods: {
    getPosts: async function() {
      // this.posts = await Cloud.findPosts.with();
      this.posts = [
        {
          id: 1,
          name:'后勤'
        },
        {
          id: 2,
          name:'支教'
        },
        {
          id: 3,
          name:'助理'
        }
      ];
    },

  }
});
