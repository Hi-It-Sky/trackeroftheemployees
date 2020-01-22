// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var connection = require("../config/connection.js");

// Routes
// =============================================================
module.exports = function(app) {
  // Get all departments
  app.getdepo("/api/all", function(req, res) {
    var dbQuery = "SELECT * FROM departments";

    connection.query(dbQuery, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  // Add a department
  app.postdepo("/api/new", function(req, res) {
    console.log("department Data:");
    console.log(req.body);

    var dbQuery = "INSERT INTO department (name) VALUES (?)";

    connection.query(dbQuery, [req.body.name], function(err, result) {
      if (err) throw err;
      console.log("Department Successfully Saved!");
      res.end();
    });
    // Get all roles
    app.getrole("/api/all", function(req, res) {
      var dbQuery = "SELECT * FROM role";
  
      connection.query(dbQuery, function(err, result) {
        if (err) throw err;
        res.json(result);
      });
    });
  
    // Add a role
    app.postrole("/api/new", function(req, res) {
      console.log("department Data:");
      console.log(req.body);
  
      var dbQuery = "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
  
      connection.query(dbQuery, [req.body.title, req.body.salary, req.body.department_id], function(err, result) {
        if (err) throw err;
        console.log("Role Successfully Saved!");
        res.end();
      });
      // Get a;l Employees
      app.getempl("/api/all", function(req, res) {
        var dbQuery = "SELECT * FROM employee";
    
        connection.query(dbQuery, function(err, result) {
          if (err) throw err;
          res.json(result);
        });
      });
    
      // Add an employee
      app.postdepo("/api/new", function(req, res) {
        console.log("eployee Data:");
        console.log(req.body);
    
        var dbQuery = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
    
        connection.query(dbQuery, [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id], function(err, result) {
          if (err) throw err;
          console.log("Employee Successfully Saved!");
          res.end();
        });
  });
};
