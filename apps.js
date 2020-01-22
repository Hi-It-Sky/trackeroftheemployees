//const jest = require('jest');
const inquirer = require('inquirer');
//var express = require("express");
//var exphbs = require("express-handlebars");
var path=require("path");
//const fs = require('fs');/
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root2',
    password: 'mollydog',
    database: 'tracker'
});

connection.connect();

getNext();

function getNext(){
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'choice',
                message: 'Select an action',
                choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee'],
            }
        ]).then(answers => {
            //console.log('Answer: ', answers);
            switch (answers.choice) {
                case 'View all employees':
                    connection.query("SELECT employee.id,first_name,last_name,title,department.name AS department,salary,"+
                    "(select concat(m.first_name,' ',m.last_name) FROM employee m where m.id=employee.manager_id) AS manager "+
                    "FROM employee JOIN role ON role_id=role.id "+
                    "JOIN department ON department_id=department.id;", function(err, rows, fields) {
                        if(err) throw err;
                        console.table(rows);
                        getNext();
                        //console.log(rows);
                    });
                break;
                case 'View all employees by department':
                    connection.query("SELECT name FROM department", function(err, rows, fields) {
                        if(err) throw err;
                        inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'choice',
                                message: 'Select department',
                                choices: rows,
                            }
                        ]).then(answers => {
                            connection.query("SELECT employee.id,first_name,last_name,title,department.name AS department,salary,"+
                            "(select concat(m.first_name,' ',m.last_name) FROM employee m where m.id=employee.manager_id) AS manager "+
                            "FROM employee JOIN role ON role_id=role.id "+
                            "JOIN department ON department_id=department.id WHERE department.name=?;",[answers.choice], function(err, rows, fields) {
                                console.table(rows);
                                getNext();

                            })
                        //console.log(rows);
                            
                    });
                });
                break;
                case 'View all employees by manager':
                    connection.query("select concat(m.first_name,' ',m.last_name) as name FROM employee m where m.id IN (SELECT DISTINCT manager_id FROM employee)", function(err, rows, fields) {
                        if(err) throw err;
                        inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'choice',
                                message: 'Select Manager',
                                choices: rows,
                            }
                        ]).then(answers => {
                            connection.query("SELECT employee.id,first_name,last_name,title,department.name AS department,salary,"+
                            "(select concat(m.first_name,' ',m.last_name) FROM employee m where m.id=employee.manager_id) AS manager "+
                            "FROM employee JOIN role ON role_id=role.id "+
                            "JOIN department ON department_id=department.id WHERE manager_id IN (SELECT id from employee where concat(first_name,' ',last_name)=?);",[answers.choice], function(err, rows, fields) {
                                console.table(rows);
                                getNext();
                            })
                        //console.log(rows);
                            
                    });
                });
                break;
                case 'Add employee':
                    connection.query("SELECT title as name FROM role", function(err, rows1, fields) {
                        if(err) throw err;
                        var roles = rows1;
                        connection.query("select concat(m.first_name,' ',m.last_name) as name FROM employee m", function(err, rows, fields) {
                            if(err) throw err;
                            var managers = rows;
                            inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'first_name',
                                    message: 'enter your first name: '
                                },
                                {
                                    type: 'input',
                                    name: 'last_name',
                                    message: 'enter your last name: '
                                },
                                {
                                    type: 'rawlist',
                                    name: 'manager',
                                    message: 'Select manager',
                                    choices: managers,
                                },
                                {
                                    type: 'rawlist',
                                    name: 'role',
                                    message: 'Select role',
                                    choices: rows1,
                                },
                            ]).then(answers => {
                                connection.query("INSERT INTO employee (id,first_name,last_name,manager_id,role_id) VALUES("+
                                    "(SELECT 1 + MAX(s.id) FROM employee s),?,?,(SELECT m.id from employee m where concat(m.first_name,' ',m.last_name)=?),(SELECT id FROM role WHERE title = ?))",
                                        [answers.first_name,answers.last_name,answers.manager,answers.role], function(err, results, fields) {
                                    if(err) throw err;

//                                    console.table(rows);
                                    getNext();
                                });
                            });
                        //console.log(rows);
                            
                    });
                });
                break;
                case 'Remove employee':
                    
                    connection.query("select concat(first_name,' ',last_name) as name FROM employee", function(err, rows, fields) {
                        if(err) throw err;
                        inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'choice',
                                message: 'Select Employee to Remove',
                                choices: rows,
                            }
                        ]).then(answers => {
                            connection.query("DELETE FROM employee where concat(first_name,' ',last_name)=?",[answers.choice], function(err, rows, fields) {
                                console.table(rows);
                                getNext();
                            })
                        //console.log(rows);
                            
                    });
                });
                break;
                case 'Update employee':
                    connection.query("select concat(first_name,' ',last_name) as name FROM employee", function(err, rows, fields) {
                        if(err) throw err;
                        inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'choice',
                                message: 'Select Employee to Update',
                                choices: rows,
                            }
                        ]).then(answers => {
                            connection.query("SELECT id, first_name, last_name, (SELECT title "+
                                "FROM role WHERE role.id=e.role_id) AS role, (select concat(m.first_name,' ',m.last_name) FROM employee m WHERE m.id=e.manager_id) AS manager " +
                                "FROM employee e WHERE concat(first_name,' ',last_name)=?",[answers.choice],
                                 function(err, rows1, fields) {
                                if(err) throw err;
                                var employee = rows1[0];
                                console.log(employee);
                                connection.query("SELECT title as name FROM role", function(err, rows1, fields) {
                                    if(err) throw err;
                                    var roles = rows1;
                                    connection.query("select concat(m.first_name,' ',m.last_name) as name FROM employee m", function(err, rows, fields) {
                                        if(err) throw err;
                                        var managers = rows;

                            inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'first_name',
                                    message: 'enter your first name: ',
                                    default: employee.first_name,
                                },
                                {
                                    type: 'input',
                                    name: 'last_name',
                                    message: 'enter your last name: ',
                                    default: employee.last_name,
                                },
                                {
                                    type: 'rawlist',
                                    name: 'manager',
                                    message: 'Select manager',
                                    choices: managers,
                                    default: employee.manager,
                                },
                                {
                                    type: 'rawlist',
                                    name: 'role',
                                    message: 'Select role',
                                    choices: roles,
                                    default: employee.role,
                                },
                            ]).then(answers => {
                                connection.query("UPDATE employee SET "+
                                    "first_name=?,last_name=?,manager_id=(SELECT * FROM(SELECT m.id from employee m where concat(m.first_name,' ',m.last_name)=?)t1),role_id=(SELECT id FROM role WHERE title = ?) "+
                                    "WHERE id=?",
                                        [answers.first_name,answers.last_name,answers.manager,answers.role,employee.id], function(err, results, fields) {
                                    if(err) throw err;

//                                    console.table(rows);
                                    getNext();
                                });
                            });
                        //console.log(rows);
                            
                    });
                }); 
            }); 
        });
    });
                break;
            }
        }
        )}
return;
