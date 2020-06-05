const constants = {
  // Application: status
  APPLICATION_STATUS_EDITING: 1,
  APPLICATION_STATUS_SUBMITTED: 2,
  APPLICATION_STATUS_CHECKED: 3,
  APPLICATION_STATUS_RECOMMENDED: 4,
  APPLICATION_STATUS_EXAMED: 11,
  APPLICATION_STATUS_ADMITTED: 12,
  APPLICATION_STATUS: [
    {
      id:1,
      status:1,
      label: '报名'
    },
    {
      id:2,
      status:2,
      label: '提交'
    },
    {
      id:3,
      status:3,
      label: '审核'
    },
    {
      id:4,
      status:4,
      label: '推荐'
    },
    {
      id:5,
      status:11,
      label: '体检'
    },
    {
      id:6,
      status:12,
      label: '录取'
    },

  ]
};

const IFWORKEDINTHECYL= [
  {
    value:true,
    label:'是'
  },
  {
    value:false,
    label:'否'
  }
];

const IFOBEYTHEADJUSTMENT = [
  {
    value:true,
    label:'服从'
  },
  {
    value:false,
    label:'不服从'
  }
];

const POLITICS = [
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
];

const EDUCATION = [
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
];

const FORMTITLE = {
  1:
  {
    text:'报名中',
    labelType:'btn-default',
    bigTitle:'填写报名信息',
    subTitle:'请认真填写以下信息进行报名.'
  },
  2:
  {
    text:'待审核',
    labelType:'btn-default',
    bigTitle:'等待审核',
    subTitle:'你已提交报名表，请耐心等待审核.'
  },
  3:
  {
    text:'待推荐',
    labelType:'btn-primary',
    bigTitle:'审核已通过',
    subTitle:'请等待推荐.'
  },
  4:
  {
    text:'等待体检',
    labelType:'btn-warning',
    bigTitle:'等待体检',
    subTitle:''
  },
  11:
  {
    text:'等待录取',
    labelType:'btn-info',
    bigTitle:'等待录取',
    subTitle:''
  },
  12:
  {
    text:'已录取',
    labelType:'btn-success',
    bigTitle:'已录取',
    subTitle:'',
  },

};

