const router = require('express').Router();
const User = require('../models/user-model');
const checkAuth = require('../middleware/check-auth');

// get signed-in user permission
router.get('/permission', checkAuth, (req, res) => {
    User.findOne({ email: req.userData.email }).exec()
    .then(user => {
        if (!user) {
            return res.send({ success: false, message: "No user was found" });
        } else {
            return res.send({ success: true, permission: user.permission });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// get all users
router.get('/management', checkAuth, (req, res) => {
    User.findOne({ email: req.userData.email }).exec()
    .then(mainUser => {
        if (!mainUser) {
            return res.send({ success: false, message: "No user was found" });
        } else if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
            User.find({}).select('name username email permission').exec()
            .then(users => {
                if (!users) {
                    return res.send({ success: false, message: "Users not found" });
                } else {
                    return res.send({ success: true, users: users, permission: mainUser.permission });
                }
            })
            .catch(err => {
                console.log(err);
                return res.send({ success: false, message: err });
            });
        } else {
            return res.send({ success: false, message: 'Insufficient permissson' });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// delete user
router.delete('/management/:username', checkAuth, (req, res) => {
    const deletedUsername = req.params.username;
    User.findOne({ email: req.userData.email }).exec()
    .then(mainUser => {
        if (!mainUser) {
            return res.send({ success: false, message: 'No user found' });
        } else if (mainUser.permission !== 'admin') {
            return res.send({ success: false, message: 'Insufficient Permissions' });
        } else if (!deletedUsername) {
            return res.send({ success: false, message: 'No user found to delete' });
        } else {
            User.findOneAndRemove({ username: deletedUsername}).exec()
            .then(user => {
                if (!user) {
                    return res.send({ success: false, message: 'No user found to delete' });
                } else {
                    return res.send({ success: true, message: 'User deleted successfully' });
                }
            })
            .catch(err => {
                console.log(err);
                return res.send({ success: false, message: err });
            });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// get user to be edited
router.get('/edit/:id', checkAuth, (req, res) => {
    const editUserId = req.params.id;
    User.findOne({ email: req.userData.email }).exec()
    .then(mainUser => {
        if (!mainUser) {
            return res.send({ success: false, message: 'No user found' });
        } else if (mainUser.permission !== 'admin' && mainUser.permission !== 'moderator') {
            return res.send({ success: false, message: 'Insufficient Permissions' });
        } else if (!editUserId) {
            return res.send({ success: false, message: 'No user found to edit' });
        } else {
            User.findOne({ _id: editUserId}).select('name username email permission').exec()
            .then(user => {
                if (!user) {
                    return res.send({ success: false, message: 'No user found to edit' });
                } else {
                    return res.send({ success: true, user: user });
                }
            })
            .catch(err => {
                console.log(err);
                return res.send({ success: false, message: err });
            });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// update user
router.put('/edit', checkAuth, (req, res) => {
    User.findOne({ email: req.userData.email }).exec()
    .then(mainUser => {
        if (!mainUser) {
            return res.send({ success: false, message: 'No user found' });
        } else if (mainUser.permission !== 'admin' && mainUser.permission !== 'moderator') {
            return res.send({ success: false, message: 'Insufficient Permissions' });
        } else if (!req.body.user || !req.body.id) {
            return res.send({ success: false, message: 'No user found to update' });
        } else {
            if (mainUser.permission === 'admin') {
                User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.user.name, username: req.body.user.username, email: req.body.user.email, permission: req.body.user.permission }).select('name username email permission').exec()
                .then(user => {
                    if (!user) {
                        return res.send({ success: false, message: 'No user found to update' });
                    } else {
                        return res.send({ success: true, message: 'User updated successfully' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.send({ success: false, message: err });
                });
            } else if (mainUser.permission === 'moderator' && req.body.user.permission === 'admin') {
                User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.user.name, username: req.body.user.username, email: req.body.user.email }).select('name username email permission').exec()
                .then(user => {
                    if (!user) {
                        return res.send({ success: false, message: 'No user found to update' });
                    } else if (user.permission === 'admin') {
                        return res.send({ success: true, message: 'User\'s name, username and email has been updated successfully.' });
                    } else {
                        return res.send({ success: true, message: 'User\'s name, username and email has been updated successfully. Moderator does not have the rights to promote someone to admin permissions' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.send({ success: false, message: err });
                });
            } else if (mainUser.permission === 'moderator') {
                User.findOne({ _id: req.body.id }).select('name username email permission').exec()
                .then(user => {
                    if (!user) {
                        return res.send({ success: false, message: 'No user found to update' });
                    } else if (user.permission === 'admin'){
                        return res.send({ success: false, message: 'Moderator does not have the rights to demote someone from admin level' });
                    } else {
                        User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.user.name, username: req.body.user.username, email: req.body.user.email, permission: req.body.user.permission }).select('name username email permission').exec()
                        .then(updatedUser => {
                            if (!updatedUser) {
                                return res.send({ success: false, message: 'No user found to update' });
                            } else {
                                return res.send({ success: true, message: 'User updated successfully' });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return res.send({ success: false, message: err });
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.send({ success: false, message: err });
                });
            }
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

module.exports = router;