//CONNECTIVITY SETUP
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const socketIO = require('socket.io');
const moment = require('moment');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Partners} = require('./models/partners');
const {Students} = require('./models/students');

const viewsPath = path.join(__dirname, '../views');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('views', viewsPath);  
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', (req, res) => {
    res.redirect('/newStudents');
});

app.use(express.static(viewsPath));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/newStudents', (req, res) => {
    Students.find().sort({ studentName: 'asc' }).then((students) => {
        Partners.find().sort({ partnerName: 'asc' }).then((partners) => {
            res.render("newStudents/newStudents.html", {students, partners});
        }).catch((e) => res.send("Can not find partners, please try again later."));
    }).catch((e) => res.send("Can not find the students, please try again later."));
});

app.post('/newStudentForm', (req, res) => {
    Partners.findOne({ partnerName: req.body.partnerName }).then((partner) => {
        var left = req.body.ccPayment - req.body.received;
        var partnerCommissionAmount = req.body.partnerPayment * partner.commissionRate / 100;
        var partnerLeft = partnerCommissionAmount - req.body.partnerReceived; 
        
        var student = new Students ({
            studentName: req.body.studentName,
            ccPayment: req.body.ccPayment,
            received: req.body.received,
            left,
            partnerName: req.body.partnerName,
            partnerType: partner.type,
            partnerPayment: req.body.partnerPayment,
            partnerCommissionRate: partner.commissionRate,
            partnerCommissionAmount,
            partnerCommissionStructure: partner.commissionStructure,
            partnerReceived: req.body.partnerReceived,
            partnerLeft,
            details: req.body.details
        });
        student.save().then(() => {
            res.redirect('/newStudents');
        }).catch((e) => res.send("Student can not be added. Please try again later."));
    }).catch((e) => res.send("Partner could not be found. Please try again later."));
});

app.post('/editStudentCcForm', (req, res) => {
    Students.findOne({studentName: req.body.studentToEditCc}).then((student) => {
        var exReceived = student.received;
        var newReceived = parseFloat(req.body.receivedEdit);
        var totalReceived = exReceived + newReceived;
        
        var newLeft = student.ccPayment - totalReceived;
        
        Students.findOneAndUpdate({studentName: req.body.studentToEditCc}, {$set: {received: totalReceived, left: newLeft}}, {new: true}).then((student) => {
            res.redirect('/newStudents');
        }).catch((e) => res.send("Student to findoneandupdate Cc can not be found."));
    }).catch((e) => res.send("Student to edit Cc can not be found."));
});

app.post('/editStudentPartnerForm', (req, res) => {
    Students.findOne({studentName: req.body.studentToEditPartner}).then((student) => {
        var exReceived = student.partnerReceived;
        var newReceived = parseFloat(req.body.partnerReceivedEdit);
        var totalReceived = exReceived + newReceived;
        
        var newLeft = student.partnerCommissionAmount - totalReceived;
        
        Students.findOneAndUpdate({studentName: req.body.studentToEditPartner}, {$set: {partnerReceived: totalReceived, partnerLeft: newLeft}}, {new: true}).then((student) => {
            res.redirect('/newStudents');
        }).catch((e) => res.send("Student to findoneandupdate Partner can not be found."));
    }).catch((e) => res.send("Student to edit Partner can not be found."));
});

app.post('/deleteStudentForm', (req, res) => {
    Students.findOneAndDelete({studentName: req.body.studentToDelete}).then((student) => {
        if(!student) {
            res.send("Deleting did not happen.<br>Name could not be found!");
        };
        res.redirect('/newStudents');
    }).catch((e) => res.send("Deleting did not happen. Can not find one and delete."));
});

app.get('/addPartners', (req, res) => {
    Partners.find().sort({ partnerName: 'asc' }).then((partners) => {
        res.render("addPartners/addPartners.html", {partners});
    }).catch((e) => res.send("Can not find the products, please try again later."));
});

app.post('/addPartnerForm', (req, res) => {
    var partner = new Partners ({
        partnerName: req.body.partnerName,
        type: req.body.type,
        commissionRate: req.body.commissionRate,
        commissionStructure: req.body.commissionStructure
    });
    partner.save().then(() => {
        res.redirect('/addPartners');
    }).catch((e) => res.send("Partner can not be added. Please try again later."));
});

//IO CONNECTIONS
io.on('connection', (socket) => {
    console.log('New user connected.');
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});
    
server.listen(port, () => console.log(`Server is up on port ${port}`));