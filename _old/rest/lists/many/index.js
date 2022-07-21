module.exports = {

    resource: '/lists',

    title: 'search lists and create new one',

    methods: {
        GET: require('./GET'),
        POST: require('./POST')
    }
};
