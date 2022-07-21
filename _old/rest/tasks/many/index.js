module.exports = {

    resource: '/tasks',

    title: 'tasks',

    methods: {

        GET: require('./GET'),
        POST: require('./POST')
    }
};
