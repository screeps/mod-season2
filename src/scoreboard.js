const _ = require('lodash'),
    q = require('q');

module.exports = function(config) {
    if(config.backend && config.backend.router) {
        config.backend.router.get('/scoreboard/list', async (request, response) => {
            if(!(parseInt(request.query.limit) <= 20)) {
                return q.reject('invalid params');
            }
            const length = await config.common.storage.db['users'].count({cpu: {$gt: 0}, rank: {$exists: true}});
            const start = parseInt(request.query.offset||0), end = parseInt(request.query.offset||0) + parseInt(request.query.limit);
            const users = await config.common.storage.db['users'].find({cpu: {$gt: 0}, rank: {$exists: true, $gt: start, $lte: end}}, {username: 1, badge: 1, score: 1, rank: 1});

            response.json({ok: 1, users: _.sortBy(users, 'rank'), meta: {length}});
        });
    }

    if(config.cronjobs) {
        config.cronjobs.updateRanks = [60, async function() {
            const users = await config.common.storage.db['users'].find({cpu: {$gt: 0}}, {username: 1, resources: 1, score: 1, rank: 1, gcl: 1});
            const promises = [];
            for(let user of users) {
                const score = Object.values(user.resources.symbols||{}).sort().reduce((a, v, k) => (a+v*(1+k)), 0);
                if(user.score != score) {
                    user.score = score;
                    promises.push(config.common.storage.db['users'].update({_id: user._id}, {$set: {score}}));
                }
            }

            const sortedUsers = _.sortByOrder(users, [u => (u.score||0), u => (u.gcl||0)], ['desc', 'desc']);
            for(let i in sortedUsers) {
                const rank = parseInt(i)+1;
                if(sortedUsers[i].rank != rank) {
                    promises.push(config.common.storage.db['users'].update({_id: sortedUsers[i]._id}, {$set: {rank}}));
                }
            }
            await q.all(promises);
        }];
    }
};
