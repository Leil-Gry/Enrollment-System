const constants = {
  // Application: status
  APPLICATION_STATUS_EDITING: 1,
  APPLICATION_STATUS_SUBMITTED: 2,
  APPLICATION_STATUS_CHECKED: 3,
  APPLICATION_STATUS_RECOMMENDED: 4,
  APPLICATION_STATUS_EXAMED: 11,
  APPLICATION_STATUS_ADMITTED: 12,
  APPLICATION_STATUS: [1,2,3,4,11,12],

  APPLICATION_STATUS_INFO: {
    1:
    {
      text:'报名中',
      stepNum:1,
      labelType:'btn-default',
      bigTitle:'填写报名信息',
      subTitle:'请认真填写以下信息进行报名.',
      stepLabel: '报名'
    },
    2:
    {
      text:'待审核',
      stepNum:2,
      labelType:'btn-default',
      bigTitle:'等待审核',
      subTitle:'你已提交报名表，请耐心等待审核.',
      stepLabel: '提交'
    },
    3:
    {
      text:'待推荐',
      stepNum:3,
      labelType:'btn-primary',
      bigTitle:'审核已通过',
      subTitle:'请等待推荐.',
      stepLabel: '审核'
    },
    4:
    {
      text:'等待体检',
      stepNum:4,
      labelType:'btn-warning',
      bigTitle:'等待体检',
      subTitle:'',
      stepLabel: '推荐'
    },
    11:
    {
      text:'等待录取',
      stepNum:5,
      labelType:'btn-info',
      bigTitle:'等待录取',
      subTitle:'',
      stepLabel: '体检'
    },
    12:
    {
      text:'已录取',
      stepNum:6,
      labelType:'btn-success',
      bigTitle:'已录取',
      subTitle:'',
      stepLabel: '录取'
    },
  },

  POLITICS: [
    {
      id: 'party',
      name: '中共党员'
    },
    {
      id: 'probationary ',
      name: '中共预备党员'
    },
    {
      id: 'league',
      name: '共青团员'
    },
    {
      id: 'public',
      name: '群众'
    },
  ],

  EDUCATION: [
    {
      id: 'college',
      name: '专科'
    },
    {
      id: 'bachelor',
      name: '本科'
    },
    {
      id: 'master',
      name: '硕士研究生'
    },
    {
      id: 'doctor',
      name: '博士研究生'
    }
  ],

  IFOBEYTHEADJUSTMENT: [
    {
      value:true,
      label:'服从'
    },
    {
      value:false,
      label:'不服从'
    }
  ],

  IFWORKEDINTHECYL: [
    {
      value:true,
      label:'是'
    },
    {
      value:false,
      label:'否'
    }
  ],

  INTENTTYPES: [
    '支教',
    '支农',
    '支医',
    '扶贫',
    '水利',
    '就业和社会保障服务平台',
    '其他'
  ]
};


