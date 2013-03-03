
/*
 * GET home page.
 */

// get home
exports.index = function(req, res){
	res.render('index', { title: 'meWorls' });
}; 

// get interactive
//exports.join = function(req, res){
//	res.render('join', { title: 'meWorls' });
//};

// get begin
exports.login_join = function(req, res){
	res.render('login', { title: 'meWorls' });
};

// get register
exports.create = function(req, res){
	res.render('create', { title: 'meWorls' });
};

// get update
exports.update = function(req, res){
	res.render('update', { title: 'meWorls' });
};

// get admin
exports.login_admin = function(req, res){
	res.render('admin/login-admin', { title: 'Admin meWorls' });
};