/* eslint-disable*/
import axios from "axios";
import { get, post, getImg, getFile, postFile } from "./http";

// =====================================================================> 登陆页 API
/**
 * 登录（POST）
 * 需要传入三个参数
 * username：用户名
 * password：密码
 * captcha：验证码
 * @param {URLSearchParams} params
 * @returns
 */
export const login = (params) => post(`login`, params);

/**
 * 获取验证码（GET）
 * 需要传入一个随机数
 * 返回blob数据，需手动渲染
 * 注意检查cookie是否可以跨域，否则验证码会失效
 * @param {number} v
 * @returns
 */
export const getCaptcha = (v) => getImg(`captcha?v = ${v}`);

// =====================================================================> 全局 API
/**
 * 检查登陆状态（GET）
 * @returns
 */
export const checkState = () => get(`oem/mine`);

/**
 * 退出登录（POST）
 * @returns
 */
export const logout = () => get(`oem/logout`);

/**
 * 获取图片（GET）
 * 需要传入url
 * 返回blob数据，需手动渲染
 * 注意检查cookie是否可以跨域，否则图片会失效
 * @param {string} path
 * @returns
 */
export const getImage = (path) => getImg(`${path}`);

// =====================================================================> 首页 API
/**
 * 用于首页初始化（GET)
 * 返回值说明:
 * inform: 广播消息
 * l_name: 用户姓名
 * l_username: 用户编号
 * l_role: 用户角色
 * l_roleId: 角色ID  [1:系统管理员 2:院系领导 3:教师 4:任课教师 5:学生]
 * 如果是学生的话还有以下参数
 * l_grade: 年级
 * l_major: 专业
 * l_class: 班级
 * @returns
 */
export const initHome = () => get(`oem/home`);

// =====================================================================> 作业记录页 API
/**
 * 获取个人作业列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getMyWorkList = (params) => get(`oem/mine/list`, params);

/**
 * 获取学生个人作业详情（GET）
 * 需传入的参数
 * id: 作业ID
 * @param {URLSearchParams} params
 * @returns
 */
export const getStuDetail = (params) => get(`oem/detail-stu`, params);

// =====================================================================> 章节视频页 API

/**
 * 获取课程列表（GET）
 * @returns
 */
export const initSubject = () => get(`oem/subject`);

/**
 * 获取个人作业列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getVideo = (params) => get(`oem/video/video`, params);

/**
 * 上传视频(POST)
 * @param {URLSearchParams} params
 * @returns
 */
export const addVideo = (data) => postFile(`oem/subject/add`, data);

/**
 * 上传资源(POST)
 * @param {URLSearchParams} params
 * @returns
 */
export const addSource = (data) => postFile(`oem/subject/addSource`, data);

/**
 * 获取课程列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getSubjectList = (params) =>
  get(`oem/subject/listSubject`, params);

/**
 * 获取可播放章节列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getVideoList = (params) => get(`oem/video/listVideo`, params);

/**
 * 获取可下载资源列表（GET）
 * 需传入的参数
 * @param {URLSearchParams} params
 * @returns
 */
export const getSourceList = (params) => get(`oem/video/getSourceList`, params);

/**
 * 获取可播放章节列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const searchVideoList = (params) =>
  get(`oem/video/getVideoList`, params);

/**
 * 进行签到（GET）
 * 需传入的参数
 * videoId: 视频ID
 * @param {URLSearchParams} params
 * @returns
 */
export const VideoSign = (params) => get(`oem/video/sign`, params);

/**
 * 查看签到表（GET）
 * 需传入的参数
 * videoId: 视频ID
 * SubjectId: 课程ID
 * keyUserName: 用户名
 * KeyName: 姓名
 * @param {URLSearchParams} params
 * @returns
 */
export const getSignList = (params) => get(`oem/video/listSign`, params);

/**
 * 删除课程
 * 请求方法: POST
 */
export const delSub = (params) => post(`oem/subject/deleteSubject`, params);

/**
 * 删除视频
 * 请求方法: POST
 */
export const delVideo = (params) => post(`oem/subject/deleteVideo`, params);

/**
 * 删除资源
 * 请求方法: POST
 */
export const delSource = (params) => post(`oem/subject/deleteSource`, params);

/**
 * 添加课程（POST）
 * 需传入的参数
 * name: 奖项名
 * @param {URLSearchParams} params
 * @returns
 */
export const addSubject = (params) => post(`oem/subject-add/add`, params);

// =====================================================================> 作业上传页 API

/**
 * 获取可上传作业列表（GET）
 * 需传入的参数
 * limit：每页的记录条数
 * page：当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getWorkList = (params) => get(`oem/upload/listWork`, params);

/**
 * 上传作业（POST）
 * 需传入的参数
 * WorkId: 作业ID
 * WorkName: 作业名
 * WorkTime: 2021-02-04 时间
 * WorkPlace: 作业级别
 * file: (二进制)
 * @param {FormData} data
 * @returns
 */
export const uploadWork = (data) => postFile(`oem/upload/upload`, data);

// =====================================================================> 作业审核页 API
/**
 * 初始化查询参数（GET）
 * 返回的参数有
 * grade：年级列表
 * major：专业列表
 * @returns
 */
export const initReview = () => get(`oem/review`);

/**
 * 获取未审核的作业列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * keyWorkName: 作业名（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const getReviewWorkList = (params) => get(`oem/review/list`, params);

/**
 * 学生作业分数批改（GET）
 * 需传入的参数
 * id：作业id
 * score: 学生分数score
 * @param {URLSearchParams} params
 * @returns
 */
export const WorkReview = (params) => get(`oem/review/review`, params);

// =====================================================================> 班级信息管理 API

/**
 * 初始化查询参数（GET）
 * 返回的参数有
 * grade：年级列表
 * major：专业列表
 * @returns
 */
export const initManageClass = () => get(`oem/class-management`);

/**
 * 获取班级列表（GET）
 * 需传入的参数
 * gradeId：年级ID
 * majorId：专业ID
 * @param {URLSearchParams} params
 * @returns
 */
export const getNewClassList = (params) =>
  get(`oem/class-management/listClass`, params);

/**
 * 获取教师班级列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * classNo: 班级号码（可选）
 * teacherId: 教师id（可选）
 * teaName：教师名字（可选）
 * className：班级全名（可选）
 * order: 排序方式（可选）
 * field: 排序字段（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const getInsClassList = (params) =>
  get(`oem/class-management/list`, params);

/**
 * 解除教师与班级的联系
 * 请求方法: POST
 * classIds[]: 69119132
 */
export const delClass = (params) => post(`oem/class-management/delete`, params);

// =====================================================================> 系统设置页 API
/**
 * 修改密码（POST）
 * 需要传入三个参数
 * old-pass：旧密码
 * new-pass：新密码
 * new-pass-v：确认密码
 * @param {URLSearchParams} params
 * @returns
 */
export const updatePass = (params) => post(`oem/password/update`, params);

// =====================================================================> 管理学生作业 API
/**
 * 初始化查询参数（GET）
 * 返回的参数有
 * grade：年级列表
 * major：专业列表
 * @returns
 */
export const initQueryStu = () => get(`oem/query-stu`);

/**
 * 获取学生作业列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * keyWorkName: 作业名（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const getStuWorkList = (params) => get(`oem/query-stu/list`, params);

/**
 * 导出学生作业表格文件（GET）
 * 需传入的参数
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * keyWorkName: 作业名（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const exportStuWorkXLS = (params) =>
  getFile(`oem/query-stu/exportXLS`, params);

/**
 * 导出学生作业表格文件（GET）
 * 需传入的参数
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * keyVideoName: 章节名（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const exportStuSignXLS = (params) =>
  getFile(`oem/video/exportXLS`, params);

/**
 * 导出课程附件（GET）
 * @param {URLSearchParams} params
 * @returns
 */
export const exportSubjectPDF = (params) =>
  getFile(`oem/subject/exportPDF`, params);

/**
 * 导出学生作业图片压缩包（GET）
 * 需传入的参数
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * keyWorkName: 作业名（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const exportStuWorkZIP = (params) =>
  getFile(`oem/query-stu/exportZIP`, params);

/**
 * 获取班级列表（GET）
 * 需传入的参数
 * gradeId：年级ID
 * majorId：专业ID
 * @param {URLSearchParams} params
 * @returns
 */
export const getClassList = (params) => get(`oem/query-stu/listClass`, params);

/**
 * 删除学生作业（GET）
 * 需传入的参数
 * id：作业id
 * @param {URLSearchParams} params
 * @returns
 */
export const delStuWork = (params) => get(`oem/query-stu/del`, params);

/**
 * 更新作业图片（POST）
 * 需传入的参数
 * id: 项目ID
 * file: (二进制)
 * @param {FormData} data
 * @returns
 */
export const updateWorkImg = (data) =>
  postFile(`oem/query-stu/updateImg`, data);

// =====================================================================> 公告组件 API
/**
 * 添加公告（POST）
 * 需要传入的参数
 * title: 标题
 * content: 内容
 * @param {URLSearchParams} params
 * @returns
 */
export const addInform = (params) => post(`oem/home/informadd`, params);

/**
 * 删除公告（POST）
 * 需要传入的参数
 * id：该项id
 * @param {URLSearchParams} params
 * @returns
 */
export const delInform = (params) => post(`oem/home/informdel`, params);

/**
 * 获取展示的作业列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * @param {URLSearchParams} params
 * @returns
 */
export const getInformList = (params) => get(`oem/home/informlist`, params);

// =====================================================================> 作业管理 API
/**
 * 获取全部作业列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * type: 0：全部 1:学生 2:教师 作业类型
 * key: 关键词
 * order: desc
 * @param {URLSearchParams} params
 * @returns
 */
export const getAllWorkList = (params) => get(`oem/work/list`, params);

/**
 * 更新作业名称（GET）
 * 需传入的参数
 * id: 作业的ID
 * newName: 新名称
 * @param {URLSearchParams} params
 * @returns
 */
export const updateWorkContent = (params) => post(`oem/work/update`, params);

/**
 * 删除作业（POST）
 * 需传入的参数
 * ids: 作业的ID 「List」
 * @param {URLSearchParams} params
 * @returns
 */
export const delwork = (params) => post(`oem/work/delete`, params);

/**
 * 添加作业（POST）
 * 需传入的参数
 * name: 作业名
 * type: 作业类型「1:学生作业 2:教师作业」
 * @param {URLSearchParams} params
 * @returns
 */
export const addwork = (params) => post(`oem/work-add/add`, params);

// =====================================================================> 学生信息管理 API
/**
 * 初始化查询参数（GET）
 * 返回的参数有
 * grade：年级列表
 * major：专业列表
 * @returns
 */
export const initManageStu = () => get(`oem/student-management`);

/**
 * 获取学生列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * gradeId: 年级id（可选）
 * majorId: 专业id（可选）
 * classId: 班级id（可选）
 * keyUsername: 学号（可选）
 * keyName: 姓名（可选）
 * order: 排序方式（可选）
 * field: 排序字段（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const getStuList = (params) =>
  get(`oem/student-management/list`, params);

/**
 * 重置密码
 * 请求方法: POST
 * ids[]: 2636
 */
export const resetStuPass = (params) =>
  post(`oem/student-management/reset`, params);

/**
 * 删除学生
 * 请求方法: POST
 * studentNos[]: 10419832
 */
export const delStu = (params) => post(`oem/student-management/delete`, params);

/**
 * 更新学生信息
 * 请求方法: POST
 * modifiedField: majorName
 * stuNo: 10419832
 * newName: 赖志豪
 * newGradeId: 2021
 * newMajorName: 计算机科学与技术
 * newClassNo: 8
 */
export const updateStu = (params) =>
  post(`oem/student-management/update`, params);

// =====================================================================> 教师信息管理 API
/**
 * 初始化查询参数（GET）
 * 返回的参数有
 * grade：年级列表
 * major：专业列表
 * role：角色列表
 * @returns
 */
export const initManageTea = () => get(`oem/teacher-management`);

/**
 * 获取教职工列表（GET）
 * 需传入的参数
 * limit: 每页的记录条数
 * page: 当前页码
 * keyUsername: 教职工号（可选）
 * keyName: 姓名（可选）
 * order: 排序方式（可选）
 * field: 排序字段（可选）
 * @param {URLSearchParams} params
 * @returns
 */
export const getTeaList = (params) =>
  get(`oem/teacher-management/list`, params);

/**重置密码
 *
 * 请求 URL: http://localhost/oem/teacher-management/reset
 * 请求方法: POST
 * ids[]: 2636
 */
export const resetTeaPass = (params) =>
  post(`oem/teacher-management/reset`, params);

/**
 * 删除教师
 * 请求方法: POST
 * teacherNos[]: 69119132
 */
export const delTea = (params) => post(`oem/teacher-management/delete`, params);

/**更新教师信息
 * 请求方法: POST
 * username: 999100236
 * newName: 凌明1
 */
export const updateTea = (params) =>
  post(`oem/teacher-management/update`, params);

/**
 * 设置教师
 * 请求方法: POST
 * ids[]: 63
 * classIds[]: 140
 * classIds[]: 141
 * classIds[]: 142
 * classIds[]: 143
 * classIds[]: 144
 * usernames[]: 999100235
 * roleId: 3
 * oldroleIds[]: 3
 * 设置其他角色
 * ids[]: 91
 * usernames[]: 999100236
 * roleId: 2
 * oldroleIds[]: 3
 */
export const setRole = (params) =>
  post(`oem/teacher-management/setRole`, params);

// =====================================================================> 教师导入页 API
/**
 * 下载教师模板
 * @returns
 */
export const getTeaTemplate = () => getFile(`oem/import-tea/download`);

/**
 * 上传教师（POST）
 * 需传入的参数
 * file: (二进制)
 * @param {FormData} data
 * @returns
 */
export const uploadTeaTemplate = (data) =>
  postFile(`oem/import-tea/upload`, data);

// =====================================================================> 学生导入页 API
/**
 * 下载学生模板
 * @returns
 */
export const getStuTemplate = () => getFile(`oem/import-stu/download`);

/**
 * 上传学生（POST）
 * 需传入的参数
 * class: 班级号「classId」
 * file: (二进制)
 * @param {FormData} data
 * @returns
 */
export const uploadStuTemplate = (data) =>
  postFile(`oem/import-stu/upload`, data);
