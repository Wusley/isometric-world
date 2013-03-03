
	/*
	 * Module dependencies.
	 */
  
	var express	= require('express'),
	  	routes	= require('./routes'),
	  	io		= require('socket.io'),
	  	app		= module.exports = express.createServer(),
	  	mongo	= require('mongoose');
	  	
		mongo.connect('mongodb://localhost/db_meworls');
	               
	// Configuration
                   
	app.configure(function() {
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.methodOverride());		   
	  	app.use(app.router); 
	  	app.use(express.static(__dirname + '/public'));
	});
	                 
	/* 
	app.configure('development', function() {
		app.set('address', 'localhost');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}); 
	*/  
	  
	app.configure('development', function() {
		//app.set('address', 'localhost');
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}); 
	  
	app.configure('production', function() {
		//app.set('address', '192.168.1.101');
		//app.set('address', 'other.com');
		app.use(express.errorHandler());
	}); 
     
	// Erguendo servidos     
	app.listen(3000, function() {
		console.log("Servidor iniciado na porta %d em modo %s", app.address().port, app.settings.env);
	});         
         
	//require("socket").start(io.listen(app),coll);	
	// Instanciando socket
	var socket = require("socket").start(io.listen(app));
          
	// instanciando DB
	// referenciando um manipulador User DB
	var daoUser =  require("dao/daoUser").create(mongo);
	           
	// referenciando manipulador Staff DB
	var daoStaff =  require("dao/daoStaff").create(mongo);
	
	// referenciando manipulador do modulo Chr
	var daoChr =  require("dao/modules/daoChr").create(mongo);
	             
	// Routes
	// Principal 
	app.get('/', routes.index);
	 
	// Login
	app.get('/login', routes.login_join);
	//PAGINAS PROTEGIDAS  
	app.get('/join', routes.login_join);
	////////////////////
	       	        
	// meWorls
	app.post('/join', function(req,res) {
                                   
		// Logando no sistema
		daoUser.selectLogin(req,res,socket,daoChr);
		 
	});          
	               
	// Cadastro
	//app.get('/user', routes.create);
	app.get('/user', function(req, res) {
		
		// get register
		res.render('create', { title: 'meWorls' });
		//daoChr.select(req,res);
		  
	});
	                
	// Cadastrando
	app.post('/user', function(req,res) {
		daoUser.insert(req,res);
	});
	     
	// Atualizar dados
	app.put('/user', routes.update);
	
	// Atualizando dados
	app.post('/user');
	 
	// Login Admin
	//app.get('/login', routes.login_admin);
	//PAGINAS PROTEGIDAS
	//app.get('/admin', routes.login_admin);
	////////////////////   
	   
	// Admin
	//app.post('/admin', function(req,res) {
	app.get('/admin', function(req,res) {     
		   
		res.render('admin/admin',{ title: 'Admin meWorls' });
		// Instanciando socket e chr
		//daoUser.selectLogin(req,res,socket);
	});
	            
	app.post('/chr', function(req,res) {
		  
		daoChr.insert(req,res);

	});
                                    
	app.get('/chr', function(req,res) {
		 
		daoChr.select(req,res); 
    
	});
            
	app.post('/chr/:id', function(req,res) {
		var id = req.body.id;
		
		daoChr.selectData(id,res);
       
	});    
	                       
	app.put('/chr/:id', function(req,res) {
  
		daoChr.update(req,res);
        
	}); 
	    
	app.del('/chr/:id', function(req,res) {
 
		daoChr.remove(req,res);
        
	});