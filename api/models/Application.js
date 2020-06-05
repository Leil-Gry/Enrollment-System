/**
 * Application.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    status: {
      type: 'number',
      columnType: 'int',
      defaultsTo: constants.APPLICATION_STATUS_EDITING
    },

    photo: {
      type: 'string'
    },

<<<<<<< HEAD
=======
    school: {
      type: 'string',
      required: true
    },

>>>>>>> 2b1d9814caeaf0c7876cb8732803ead859467d2d
    name: {
      type: 'string',
      required: true
    },

    sex:{
      type: 'string',
      required: true
    },

    nation:{
      type: 'string',
      required: true
    },

    birthDate:{
      type: 'string',
      required: true
    },

    politicalStatus:{
      type: 'string',
      required: true
    },

    IDNumber:{
      type: 'string',
      required: true
    },

    education:{
      type: 'string',
      required: true
    },

    major:{
      type: 'string',
      required: true
    },

    specialty:{
      type: 'string'
    },

    healthStatus:{
      type: 'string',
      required: true
    },

    pastMedicalHistory:{
      type: 'string'
    },

    // 户籍省
    domicileProvince:{
      type: 'string',
      required: true
    },

    // 户籍市
    domicileCity:{
      type: 'string',
      required: true
    },

    // 户籍地址（市以下具体地址）
    domicileAddr:{
      type: 'string',
      required: true
    },

    phone:{
      type: 'string',
      // columnType: 'int',
      required: true
    },

    email:{
      type: 'string',
      required: true
    },

    homeAddressAndPhone:{
      type: 'string',
      required: true
    },

<<<<<<< HEAD
    intentType: {
      type: 'string',
      required: true
    },

=======
>>>>>>> 2b1d9814caeaf0c7876cb8732803ead859467d2d
    intention1:{
      type: 'string',
      required: true
    },

    intention2:{
      type: 'string',
      required: true
    },

    obeyTheAdjustment:{
      type: 'boolean',
      required: true
    },

    workedInTheCYL:{
      type: 'boolean',
      required: true
    },

    resume:{
      type: 'string',
      required: true
    },

    volunteeringExperience:{
      type: 'string',
      required: true
    },

    rewardsAndPunishment:{
      type: 'string',
      required: true
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user: {
      model: 'user',
      required: true
    },

    batch: {
      model: 'batch',
      required: true
    },

    school: {
      model: 'school',
      required: true
    }
  }
};

