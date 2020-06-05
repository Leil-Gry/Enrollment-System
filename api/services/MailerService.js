'use strict';

const nodemailer = require('nodemailer');
const scTransport = require('nodemailer-sendcloud-transport');

const config = require('../../config/services/mailer');

// Note: Change in node_modules/nodemailer_sendcloud-transport/src/sendcloud-transport.js
// Change path : '/webapi/mail.send.json'
// to path : '/webapi/mail.send_template.json'

module.exports = nodemailer.createTransport(scTransport(config.services.mailer.sendcloud));
