/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"findSchool":{"verb":"GET","url":"/api/v1/school","args":[]},"findNation":{"verb":"GET","url":"/api/v1/nation","args":[]},"findProvince":{"verb":"GET","url":"/api/v1/province","args":[]},"findCity":{"verb":"GET","url":"/api/v1/city","args":[]},"findIntention":{"verb":"GET","url":"/api/v1/intention","args":[]},"getApply":{"verb":"GET","url":"/api/v1/user/apply","args":[]},"createApplication":{"verb":"POST","url":"/api/v1/application/apply","args":[]},"submitApplication":{"verb":"POST","url":"/api/v1/application/submit","args":[]},"uploadPhoto":{"verb":"POST","url":"/api/v1/application/:id/file","args":["id"]},"download":{"verb":"GET","url":"/api/v1/application/:id/download","args":["id"]},"findApplication":{"verb":"GET","url":"/api/v1/application","args":[]},"findOneApplication":{"verb":"GET","url":"/api/v1/application/:id","args":["id"]},"setOrder":{"verb":"POST","url":"/api/v1/application/:id","args":["id","order"]},"updateSchoolApplicationStatus":{"verb":"POST","url":"/api/v1/school/application/:id/status","args":["id","status"]},"updateApplicationStatus":{"verb":"POST","url":"/api/v1/admin/application/:id/status","args":["id","status"]},"getStats":{"verb":"GET","url":"/api/v1/admin/stats","args":["groupBySchool"]}}
  /* eslint-enable */

});
